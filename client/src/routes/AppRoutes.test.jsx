import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";

jest.mock("../services/authService", () => ({
  login: jest.fn(),
  register: jest.fn(),
}));

jest.mock("../services/dashboardService", () => ({
  getDashboardSummary: jest.fn(() =>
    Promise.resolve({ completed: 0, averageScore: 0, recent: [] })
  ),
}));

jest.mock("../services/resumeService", () => ({
  uploadResume: jest.fn(),
}));

jest.mock("../services/interviewService", () => ({
  generateQuestions: jest.fn(),
}));

jest.mock("../services/historyService", () => ({
  getHistory: jest.fn(() => Promise.resolve({ interviews: [] })),
}));

jest.mock("../services/api", () => ({
  post: jest.fn(),
}));

test("renders public landing route", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <AppRoutes />
    </MemoryRouter>
  );

  expect(screen.getByRole("heading", { name: /practice interviews/i })).toBeInTheDocument();
});

test("redirects protected routes to login", () => {
  localStorage.clear();

  render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <AppRoutes />
    </MemoryRouter>
  );

  expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument();
});
