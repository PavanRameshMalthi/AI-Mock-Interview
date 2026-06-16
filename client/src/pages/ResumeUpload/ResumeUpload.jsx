import { useState } from "react";
import axios from "axios";

const ResumeUpload = () => {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      return alert("Select a file");
    }

    const formData = new FormData();

    formData.append("resume", file);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/resume/upload",
        formData
      );

      alert("Resume Uploaded");

      console.log(res.data);
    } catch (error) {
      console.log(error);
      alert("Upload Failed");
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "50px",
      }}
    >
      <h1>Upload Resume</h1>

      <input
        type="file"
        onChange={(e) =>
          setFile(e.target.files[0])
        }
      />

      <br />
      <br />

      <button onClick={handleUpload}>
        Upload Resume
      </button>
    </div>
  );
};

export default ResumeUpload;