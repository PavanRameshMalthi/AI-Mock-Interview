import { useState } from "react";
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../../components/UI/Toast";

import resumeService from "../../services/resumeService";

const ResumeUpload = () => {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      showError("Please Select Resume");
      return;
    }

    const toastId = showLoading(
      "Uploading Resume..."
    );

    try {
      const formData = new FormData();

      formData.append("resume", file);

      await resumeService.uploadResume(formData);

      dismissToast(toastId);

      showSuccess("Resume Uploaded Successfully");
    } catch (error) {
      dismissToast(toastId);

      showError(
        error.response?.data?.message ||
          "Upload Failed"
      );
    }
  };

  return (
    <div>
      <h2>Upload Resume</h2>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) =>
          setFile(e.target.files[0])
        }
      />

      <button onClick={handleUpload}>
        Upload Resume
      </button>
    </div>
  );
};

export default ResumeUpload;