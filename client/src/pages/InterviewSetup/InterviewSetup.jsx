import { useState } from "react";

import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../../components/UI/Toast";

import interviewService from "../../services/interviewService";

const InterviewSetup = () => {
  const [jobRole, setJobRole] = useState("");

  const [difficulty, setDifficulty] =
    useState("Beginner");

  const generateInterview = async () => {
    const toastId = showLoading(
      "Generating Questions..."
    );

    try {
      const response =
        await interviewService.generateQuestions({
          jobRole,
          difficulty,
        });

      dismissToast(toastId);

      showSuccess(
        "Interview Generated Successfully"
      );

      console.log(response);
    } catch (error) {
      dismissToast(toastId);

      showError(
        error.response?.data?.message ||
          "Failed To Generate Questions"
      );
    }
  };

  return (
    <div>
      <h2>Interview Setup</h2>

      <input
        type="text"
        placeholder="Job Role"
        value={jobRole}
        onChange={(e) =>
          setJobRole(e.target.value)
        }
      />

      <select
        value={difficulty}
        onChange={(e) =>
          setDifficulty(e.target.value)
        }
      >
        <option>Beginner</option>
        <option>Intermediate</option>
        <option>Advanced</option>
      </select>

      <button onClick={generateInterview}>
        Generate Interview
      </button>
    </div>
  );
};

export default InterviewSetup;