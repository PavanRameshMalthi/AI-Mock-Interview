import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Register from "./Register";
import authService from "../../services/authService";
import { showError } from "../../components/UI/Toast";

jest.mock("../../services/authService", () => ({
  register: jest.fn(),
}));

jest.mock("../../components/UI/Toast", () => ({
  showSuccess: jest.fn(),
  showError: jest.fn(),
}));

test("validates password length before registration", async () => {
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );

  await userEvent.type(screen.getByLabelText(/full name/i), "Test User");
  await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
  await userEvent.type(screen.getByLabelText(/password/i), "short");
  await userEvent.click(screen.getByRole("button", { name: /create account/i }));

  expect(showError).toHaveBeenCalledWith("Password must be at least 8 characters");
  expect(authService.register).not.toHaveBeenCalled();
});

test("submits valid registration", async () => {
  authService.register.mockResolvedValue({ success: true });

  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );

  await userEvent.type(screen.getByLabelText(/full name/i), "Test User");
  await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
  await userEvent.type(screen.getByLabelText(/password/i), "Password123");
  await userEvent.click(screen.getByRole("button", { name: /create account/i }));

  expect(authService.register).toHaveBeenCalledWith({
    name: "Test User",
    email: "test@example.com",
    password: "Password123",
  });
});
