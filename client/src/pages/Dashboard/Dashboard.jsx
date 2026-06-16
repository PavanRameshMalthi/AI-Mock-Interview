import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "50px",
      }}
    >
      <h1>AI Mock Interview Dashboard</h1>

      <h2>Welcome, {user?.name}</h2>

      <p>{user?.email}</p>

      <button
        onClick={() =>
          navigate("/resume-upload")
        }
      >
        Resume Upload
      </button>

      <button
        onClick={() =>
          navigate("/interview-setup")
        }
        style={{ marginLeft: "10px" }}
      >
        Interview Setup
      </button>

      <button
        onClick={logout}
        style={{
          marginLeft: "10px",
          background: "red",
          color: "white",
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;