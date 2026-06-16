import { useState } from "react";
import { useNavigate } from "react-router-dom";

const InterviewSetup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    difficulty: "Medium",
    questionCount: 10,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStartInterview = () => {
    if (!formData.role || !formData.experience) {
      alert("Please fill all fields");
      return;
    }

    localStorage.setItem(
      "interviewConfig",
      JSON.stringify(formData)
    );

    navigate("/interview-session");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f9",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "500px",
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Interview Setup
        </h1>

        <label>Job Role</label>

        <input
          type="text"
          name="role"
          placeholder="e.g. Frontend Developer"
          value={formData.role}
          onChange={handleChange}
          style={inputStyle}
        />

        <label>Years of Experience</label>

        <input
          type="number"
          name="experience"
          placeholder="e.g. 2"
          value={formData.experience}
          onChange={handleChange}
          style={inputStyle}
        />

        <label>Difficulty Level</label>

        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          style={inputStyle}
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <label>Number of Questions</label>

        <select
          name="questionCount"
          value={formData.questionCount}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>

        <button
          onClick={handleStartInterview}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "20px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Start Interview
        </button>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "8px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

export default InterviewSetup;