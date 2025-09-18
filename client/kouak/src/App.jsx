import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/forgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Chat from "./pages/Chat";
import { useAuth } from "./context/AuthContext";
import './App.css'

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  const { token } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/resetPassword/:token" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
