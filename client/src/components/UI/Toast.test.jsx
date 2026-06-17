import toast from "react-hot-toast";
import {
  dismissToast,
  showError,
  showLoading,
  showSuccess,
} from "./Toast";

jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
  loading: jest.fn(() => "toast-id"),
  dismiss: jest.fn(),
}));

test("delegates toast helpers to react-hot-toast", () => {
  showSuccess("Saved");
  showError("Failed");
  const id = showLoading("Loading");
  dismissToast(id);

  expect(toast.success).toHaveBeenCalledWith("Saved");
  expect(toast.error).toHaveBeenCalledWith("Failed");
  expect(toast.loading).toHaveBeenCalledWith("Loading");
  expect(toast.dismiss).toHaveBeenCalledWith("toast-id");
});
