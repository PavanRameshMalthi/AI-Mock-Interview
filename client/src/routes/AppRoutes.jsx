import React, { Suspense, lazy } from 'react';

const loadComponent = (importPath) => {
  if (process.env.NODE_ENV === 'test') {
    // Synchronous require for Jest environment to avoid Suspense timing issues
    // eslint-disable-next-line import/no-dynamic-require
    return require(importPath).default;
  }
  return lazy(() => import(importPath));
};
import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";

const Landing = loadComponent('../pages/Landing/Landing');
const Login = loadComponent('../pages/Login/Login');
const Register = loadComponent('../pages/Register/Register');
const ForgotPassword = loadComponent('../pages/ForgotPassword/ForgotPassword');
const ResetPassword = loadComponent('../pages/ResetPassword/ResetPassword');
const Dashboard = loadComponent('../pages/Dashboard/Dashboard');
const ResumeUpload = loadComponent('../pages/ResumeUpload/ResumeUpload');
const InterviewSetup = loadComponent('../pages/InterviewSetup/InterviewSetup');
const InterviewSession = loadComponent('../pages/InterviewSession/InterviewSession');
const Results = loadComponent('../pages/Results/Results');
const History = loadComponent('../pages/History/History');
const Admin = loadComponent('../pages/Admin/Admin');
const Profile = loadComponent('../pages/Profile/Profile');
const Certificate = loadComponent('../pages/Certificate/Certificate');

const AppRoutes = () => {
  const isTest = process.env.NODE_ENV === 'test';
  const content = (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/resume-upload"
        element={
          <ProtectedRoute>
            <ResumeUpload />
          </ProtectedRoute>
        }
      />

      <Route
        path="/interview-setup"
        element={
          <ProtectedRoute>
            <InterviewSetup />
          </ProtectedRoute>
        }
      />

      <Route
        path="/interview-session"
        element={
          <ProtectedRoute>
            <InterviewSession />
          </ProtectedRoute>
        }
      />

      <Route
        path="/results"
        element={
          <ProtectedRoute>
            <Results />
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/certificate"
        element={
          <ProtectedRoute>
            <Certificate />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
  return content;
};

export default AppRoutes;
