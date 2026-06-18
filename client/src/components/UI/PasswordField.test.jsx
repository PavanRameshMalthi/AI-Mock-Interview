import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PasswordField, {
  PasswordStrength,
} from "./PasswordField";
import { getPasswordStrength } from "../../utils/passwordUtils";

test("toggles password visibility", async () => {
  render(
    <PasswordField
      name="password"
      onChange={() => {}}
      placeholder="Password"
      value="Password123!"
    />
  );

  const input = screen.getByLabelText(/^password$/i);
  expect(input).toHaveAttribute("type", "password");

  await userEvent.click(screen.getByRole("button", { name: /show password/i }));
  expect(input).toHaveAttribute("type", "text");

  await userEvent.click(screen.getByRole("button", { name: /hide password/i }));
  expect(input).toHaveAttribute("type", "password");
});

test("reports password strength and mismatch", () => {
  expect(getPasswordStrength("short").label).toBe("Weak");
  expect(getPasswordStrength("Password123!").label).toBe("Very Strong");

  render(<PasswordStrength confirmPassword="Password123?" password="Password123!" />);
  expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
});
