// ThemeManager.test.tsx
import React, { useContext } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ThemeManager, { ThemeContext } from "./ThemeManager";

// Mocks
vi.mock("@/hooks/Language.hook", () => ({
  useLang: () => ({ antdLangProvider: {} }),
}));
const mockGet = vi.fn();
const mockSet = vi.fn();
vi.mock("@/utils/browserStorage", () => ({
  localStorageAccessor: () => [mockGet, mockSet],
}));

// Dummy child component to read context
const ReadContext = () => {
  const { selectedTheme, setSelectedTheme, themeAlgorithm } = useContext(ThemeContext);
  return (
    <div>
      <span data-testid="theme">{selectedTheme}</span>
      <span data-testid="algo">{themeAlgorithm}</span>
      <button onClick={() => setSelectedTheme("dark")}>to-dark</button>
    </div>
  );
};

describe("<ThemeManager />", () => {
  beforeEach(() => {
    mockGet.mockReturnValue("default");
    mockSet.mockClear();
  });

  it("renders children and provides default theme", () => {
    render(
      <ThemeManager>
        <ReadContext />
      </ThemeManager>
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("default");
    expect(screen.getByTestId("algo")).toBeDefined();
    expect(mockSet).toHaveBeenCalledWith("default");
  });

  it("updates theme and calls localStorage set", () => {
    render(
      <ThemeManager>
        <ReadContext />
      </ThemeManager>
    );

    fireEvent.click(screen.getByText("to-dark"));

    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    // Ensure theme stored
    expect(mockSet).toHaveBeenCalledWith("dark");
  });
});
