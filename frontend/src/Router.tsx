import { BrowserRouter, Routes, Route } from "react-router-dom";

import ScrollToTop from "src/components/ScrollToTop";
import TopBar from "src/components/TopBar";
import Register from "src/pages/Register";
import ConfirmEmail from "src/pages/ConfirmEmail";
import Login from "src/pages/Login";
import RequireAuth from "src/components/RequireAuth";
import ChangePassword from "src/pages/ChangePassword";
import ForgottenPassword from "src/pages/ForgottenPassword";
import ResetPassword from "src/pages/ResetPassword";
import Todos from "src/pages/Todos";
import CreateTodo from "src/pages/CreateTodo";
import EditTodo from "src/pages/EditTodo";

const Router = () => (
    <BrowserRouter>
        <ScrollToTop />
        <TopBar />
        <Routes>
            <Route path="/confirm-email/:token" element={<ConfirmEmail />} />
            <Route path="/register/" element={<Register />} />
            <Route path="/login/" element={<Login />} />
            <Route path="/change-password/" element={<RequireAuth><ChangePassword /></RequireAuth>} />
            <Route path="/forgotten-password/" element={<ForgottenPassword />} />
            <Route path="/reset-password/" element={<ResetPassword />} />
            <Route path="/" element={<RequireAuth><Todos /></RequireAuth>} />
            <Route path="/todos/new" element={<RequireAuth><CreateTodo /></RequireAuth>} />
            <Route path="/todos/:id" element={<RequireAuth><EditTodo /></RequireAuth>} />
        </Routes>
    </BrowserRouter>
);

export default Router;