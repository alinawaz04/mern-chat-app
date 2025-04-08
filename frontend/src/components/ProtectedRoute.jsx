import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
  const { authUser, loading } = useAuthContext();

  // show loading state until user is fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <svg
          className="animate-spin h-10 w-10 text-blue-500"
          viewBox="3 3 18 18"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="9"
            strokeWidth="2"
          ></circle>
          <path className="opacity-75" fill="currentColor" d="M12 3v6h6"></path>
        </svg>
      </div>
    );
  }
  // if user is not logged in, redirect to login page
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  // if user is logged in, show the children
  return children;
};
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
