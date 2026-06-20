import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Landing from "./Landing";

test("renders landing page calls to action", () => {
  render(
    <MemoryRouter>
      <Landing />
    </MemoryRouter>
  );

  expect(screen.getByRole("heading", { name: /master tech interview/i })).toBeInTheDocument();
  expect(screen.getAllByRole("link", { name: /get started free/i })[0]).toHaveAttribute(
    "href",
    "/register"
  );
  expect(screen.getByRole("heading", { name: /resume ats analysis/i })).toBeInTheDocument();
});
