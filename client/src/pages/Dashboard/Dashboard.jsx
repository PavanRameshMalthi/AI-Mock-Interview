import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

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

      <p>Email: {user?.email}</p>

      <div style={{ marginTop: "30px" }}>
        <button
          onClick={() => navigate("/resume-upload")}
          style={{
            padding: "10px 20px",
            margin: "10px",
            cursor: "pointer",
          }}
        >
          Upload Resume
        </button>

        <button
          onClick={() => navigate("/interview-setup")}
          style={{
            padding: "10px 20px",
            margin: "10px",
            cursor: "pointer",
          }}
        >
          Start Interview
        </button>

        <button
          onClick={logout}
          style={{
            padding: "10px 20px",
            margin: "10px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;