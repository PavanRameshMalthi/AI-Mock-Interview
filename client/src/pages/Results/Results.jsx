import { useNavigate } from "react-router-dom";

const Results = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "50px",
      }}
    >
      <h1>Interview Results</h1>

      <h2>Score: 85%</h2>

      <p>✅ Strong Technical Knowledge</p>
      <p>✅ Good Communication Skills</p>
      <p>⚠️ Improve Confidence During Answers</p>

      <button
        onClick={() => navigate("/dashboard")}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default Results;