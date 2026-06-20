import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "./Dashboard";
import dashboardService from "../../services/dashboardService";

jest.mock("../../services/dashboardService", () => ({
  getDashboardSummary: jest.fn(),
  getAnalytics: jest.fn(),
}));

jest.mock("../../services/authService", () => ({
  logout: jest.fn(() => Promise.resolve({ success: true })),
}));

test("renders dashboard summary and actions", async () => {
  localStorage.setItem(
    "user",
    JSON.stringify({ name: "Test User", email: "test@example.com" })
  );
  dashboardService.getDashboardSummary.mockResolvedValue({
    completed: 2,
    averageScore: 82,
    recent: [{ _id: "1", role: "Frontend Developer", score: 84 }],
  });
  dashboardService.getAnalytics.mockResolvedValue({
    summary: { improvementPercentage: 10 },
    trends: { interviewScores: [], atsScores: [] },
    strongSkillAreas: [],
    weakSkillAreas: [],
  });

  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText("82%")).toBeInTheDocument();
  });

  expect(screen.getByRole("link", { name: /start interview/i })).toHaveAttribute(
    "href",
    "/interview-setup"
  );
});
