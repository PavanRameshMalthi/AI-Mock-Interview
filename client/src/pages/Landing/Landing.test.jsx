import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Landing from "./Landing";

test("renders landing page calls to action", () => {
  render(
    <MemoryRouter>
      <Landing />
    </MemoryRouter>
  );

  expect(screen.getByRole("heading", { name: /master every interview/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /start interview/i })).toHaveAttribute(
    "href",
    "/interview-setup"
  );
  expect(screen.getByRole("heading", { name: /resume ats analysis/i })).toBeInTheDocument();
});
