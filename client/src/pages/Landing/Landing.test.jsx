import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Landing from "./Landing";

test("renders landing page calls to action", () => {
  render(
    <MemoryRouter>
      <Landing />
    </MemoryRouter>
  );

  expect(screen.getByRole("heading", { name: /practice interviews/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /start practicing/i })).toHaveAttribute(
    "href",
    "/register"
  );
});
