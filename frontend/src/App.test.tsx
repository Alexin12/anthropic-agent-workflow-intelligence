import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";

import App from "./App";


afterEach(() => {
  vi.restoreAllMocks();
});

test("user sees service health and saves a Source URL", async () => {
  const sourceUrl = "https://example.com/anthropic-guide";
  const fetchMock = vi
    .spyOn(globalThis, "fetch")
    .mockResolvedValueOnce(
      new Response(JSON.stringify({ status: "ok", database: "connected" }))
    )
    .mockResolvedValueOnce(new Response(JSON.stringify([])))
    .mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          id: 1,
          url: sourceUrl,
          created_at: "2026-09-09T12:00:00Z",
        }),
        { status: 201 }
      )
    );

  render(<App />);

  expect(await screen.findByText("Services connected")).toBeInTheDocument();

  await userEvent.type(screen.getByLabelText("Source URL"), sourceUrl);
  await userEvent.click(screen.getByRole("button", { name: "Save Source" }));

  expect(await screen.findByRole("link", { name: sourceUrl })).toHaveAttribute(
    "href",
    sourceUrl
  );
  expect(fetchMock).toHaveBeenLastCalledWith(
    "/api/sources",
    expect.objectContaining({ method: "POST" })
  );
});
