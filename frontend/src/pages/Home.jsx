import { useAuthContext } from "../context/AuthContext";

const Home = () => {
  const { authUser, logout } = useAuthContext();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login"; // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div>
      <h1>Chat App Home</h1>
      <p>Welcome, {authUser.fullName}!</p>
      <button onClick={() => handleLogout()}>Logout</button>
    </div>
  );
};

export default Home;
