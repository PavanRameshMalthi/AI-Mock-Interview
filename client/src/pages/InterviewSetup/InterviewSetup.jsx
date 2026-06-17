import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const InterviewSetup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    difficulty: "Medium",
    questionCount: 5,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStartInterview = async () => {
    if (!formData.role || !formData.experience) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/interview/generate-questions",
        formData
      );

      localStorage.setItem(
        "questions",
        JSON.stringify(res.data.questions)
      );

      localStorage.setItem(
        "interviewConfig",
        JSON.stringify(formData)
      );

      navigate("/interview-session");
    } catch (error) {
      console.error(error);
      alert("Failed to generate questions");
    }
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
          placeholder="Frontend Developer"
          value={formData.role}
          onChange={handleChange}
          style={inputStyle}
        />

        <label>Years of Experience</label>
        <input
          type="number"
          name="experience"
          placeholder="2"
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
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
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