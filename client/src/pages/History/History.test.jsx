import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import History from "./History";
import historyService from "../../services/historyService";

jest.mock("../../services/historyService", () => ({
  getHistory: jest.fn(),
  getInterview: jest.fn(),
  deleteInterview: jest.fn(),
  bulkDelete: jest.fn(),
  restoreInterview: jest.fn(),
}));

jest.mock("../../components/UI/Toast", () => ({
  showError: jest.fn(),
  showSuccess: jest.fn(),
}));

test("renders interview history rows", async () => {
  historyService.getHistory.mockResolvedValue({
    interviews: [
      {
        _id: "507f1f77bcf86cd799439011",
        role: "Frontend Developer",
        difficulty: "Beginner",
        score: 88,
        atsScore: { score: 76 },
        createdAt: "2026-06-17T00:00:00.000Z",
      },
    ],
  });

  render(
    <MemoryRouter>
      <History />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
  });
  expect(screen.getByText("88%")).toBeInTheDocument();
  expect(screen.getByText("76")).toBeInTheDocument();
});

test("deletes and restores an interview through undo", async () => {
  const interviewId = "507f1f77bcf86cd799439012";
  historyService.getHistory.mockResolvedValue({
    interviews: [
      {
        _id: interviewId,
        role: "Backend Developer",
        difficulty: "Advanced",
        score: 91,
        createdAt: "2026-06-17T00:00:00.000Z",
      },
    ],
  });
  historyService.deleteInterview.mockResolvedValue({ success: true });
  historyService.restoreInterview.mockResolvedValue({ success: true });

  render(
    <MemoryRouter>
      <History />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText("Backend Developer")).toBeInTheDocument();
  });

  await userEvent.click(screen.getByRole("button", { name: /^delete$/i }));
  await userEvent.click(screen.getByRole("button", { name: /confirm delete/i }));
  await waitFor(() => {
    expect(screen.queryByText("Backend Developer")).not.toBeInTheDocument();
  });

  await userEvent.click(screen.getByRole("button", { name: /undo delete/i }));
  expect(historyService.restoreInterview).toHaveBeenCalledWith(interviewId);
});
