import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const renderProtectedRoute = () =>
  render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <h1>Dashboard</h1>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<h1>Login</h1>} />
      </Routes>
    </MemoryRouter>
  );

beforeEach(() => {
  localStorage.clear();
});

test("redirects anonymous users to login", () => {
  renderProtectedRoute();
  expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
});

test("renders protected content for authenticated users", () => {
  localStorage.setItem("token", "token");
  renderProtectedRoute();
  expect(screen.getByRole("heading", { name: /dashboard/i })).toBeInTheDocument();
});
