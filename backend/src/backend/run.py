from quart import Quart, ResponseReturnValue
from backend.blueprints.control import blueprint as control_blueprint
from backend.lib.api_error import APIError
from quart_auth import QuartAuth
from quart_rate_limiter import RateLimiter, RateLimitExceeded
from quart_schema import QuartSchema, RequestSchemaValidationError
from quart_db import QuartDB
import os
from subprocess import call # nosec
from urllib.parse import urlparse
import logging
from backend.blueprints.sessions import blueprint as sessions_blueprint
from backend.blueprints.members import blueprint as members_blueprint
from backend.blueprints.todos import blueprint as todos_blueprint


app = Quart(__name__)
app.config.from_prefixed_env(prefix="TOZO")
auth_manager = QuartAuth(app)
rate_limiter = RateLimiter(app)
schema = QuartSchema(app, convert_casing=True)
quart_db = QuartDB(app)

app.register_blueprint(control_blueprint)
app.register_blueprint(sessions_blueprint)
app.register_blueprint(members_blueprint)
app.register_blueprint(todos_blueprint)

# Error handling
@app.errorhandler(APIError) # type: ignore
async def handle_api_error(error: APIError) -> ResponseReturnValue:
    return {"code": error.code}, error.status_code

@app.errorhandler(500)
async def handle_generic_error(error: Exception) -> ResponseReturnValue:
    return {"code": "INTERNAL_SERVER_ERROR"}, 500 

@app.errorhandler(RateLimitExceeded) # type: ignore
async def handle_rate_limit_exceeded_error(error: RateLimitExceeded) -> ResponseReturnValue:
    return {}, error.get_headers(), 429

@app.errorhandler(RequestSchemaValidationError) # type: ignore
async def handle_request_validation_error(error: RequestSchemaValidationError) -> ResponseReturnValue:
    if isinstance(error.validation_error, TypeError):
        return {"errors": str(error.validation_error)}, 400
    else:
        return {"errors": error.validation_error.json()}, 400
    

# Database recreation
@app.cli.command("recreate_db")
def recreate_db() -> None:
    db_url = urlparse(os.environ["TOZO_QUART_DB_DATABASE_URL"])
    call( # nosec
        ["psql", "-U", "lewis", "-c", f"DROP DATABASE IF EXISTS {db_url.path.removeprefix('/')}"], # where lewis is postgres superuser
    )
    call( # nosec
        ["psql", "-U", "lewis", "-c", f"DROP USER IF EXISTS {db_url.username}"],
    )
    call( # nosec
        ["psql", "-U", "lewis", "-c", f"CREATE USER {db_url.username} LOGIN PASSWORD '{db_url.password}' CREATEDB"],
    )
    call( # nosec
        ["psql", "-U", "lewis", "-c", f"CREATE DATABASE {db_url.path.removeprefix('/')}"],
    )


# Logging
logging.basicConfig(level=logging.INFO)