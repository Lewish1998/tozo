import pytest
from typing import AsyncGenerator
from quart_db import Connection
from backend.run import quart_db
from quart import Quart
from backend.run import app

@pytest.fixture(name="app", scope="function")
async def _app() -> AsyncGenerator[Quart, None]:
    async with app.test_app():
        yield app
        
@pytest.fixture(name="connection", scope="function")
async def _connection(app: Quart) -> AsyncGenerator[Connection, None]:
    async with quart_db.connection() as connection:
        async with connection.transaction():
            yield connection