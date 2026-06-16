import { Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing/Landing";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import ResumeUpload from "../pages/ResumeUpload/ResumeUpload";
import InterviewSetup from "../pages/InterviewSetup/InterviewSetup";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route
        path="/resume-upload"
        element={<ResumeUpload />}
      />
      <Route
        path="/interview-setup"
        element={<InterviewSetup />}
      />
    </Routes>
  );
};

export default AppRoutes;