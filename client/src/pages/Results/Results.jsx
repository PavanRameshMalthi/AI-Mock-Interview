import { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";

const Results = () => {
  const [result, setResult] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    evaluateInterview();
  }, []);

  const evaluateInterview =
    async () => {
      try {
        const questions =
          JSON.parse(
            localStorage.getItem(
              "questions"
            )
          ) || [];

        const answers =
          JSON.parse(
            localStorage.getItem(
              "answers"
            )
          ) || [];

        const config =
          JSON.parse(
            localStorage.getItem(
              "interviewConfig"
            )
          ) || {};

        const response =
          await axios.post(
            "http://localhost:5000/api/evaluation/evaluate",
            {
              role: config.role,
              questions,
              answers,
            }
          );

        setResult(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text(
      "AI Mock Interview Report",
      20,
      20
    );

    doc.setFontSize(12);

    doc.text(
      `Overall Score: ${result.overall}`,
      20,
      40
    );

    doc.text(
      `Technical: ${result.technical}`,
      20,
      55
    );

    doc.text(
      `Communication: ${result.communication}`,
      20,
      70
    );

    doc.text(
      `Problem Solving: ${result.problemSolving}`,
      20,
      85
    );

    doc.text(
      "Feedback:",
      20,
      105
    );

    doc.text(
      result.feedback,
      20,
      120,
      {
        maxWidth: 160,
      }
    );

    doc.save(
      "Interview_Report.pdf"
    );
  };

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "100px",
        }}
      >
        <h2>
          Evaluating Interview...
        </h2>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "50px auto",
        padding: "20px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
        }}
      >
        Interview Results
      </h1>

      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow:
            "0 4px 10px rgba(0,0,0,0.1)",
          marginTop: "20px",
        }}
      >
        <h2>
          Overall Score:
          {result?.overall}/100
        </h2>

        <hr />

        <h3>
          Technical Knowledge:
          {result?.technical}/100
        </h3>

        <h3>
          Communication:
          {result?.communication}/100
        </h3>

        <h3>
          Problem Solving:
          {result?.problemSolving}/100
        </h3>

        <hr />

        <h2>Feedback</h2>

        <p>
          {result?.feedback}
        </p>

        <button
          onClick={downloadPDF}
          style={{
            padding: "12px 20px",
            background:
              "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Download PDF Report
        </button>
      </div>
    </div>
  );
};

export default Results;