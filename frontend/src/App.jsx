import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { useAuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { authUser } = useAuthContext();
  return (
    <div className="p-4 h-screen flex items-center justify-center">
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {/* <ChatProvider> */}
              <Home />
              {/* </ChatProvider> */}
            </ProtectedRoute>
          }
        />
        {/* Public routes - redirect to home if already authenticated */}
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" /> : <SignUp />}
        />

        {/* Catch-all route - redirect to home or login */}
        <Route
          path="*"
          element={authUser ? <Navigate to="/" /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default App;
