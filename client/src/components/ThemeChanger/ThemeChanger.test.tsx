import { render, screen, fireEvent, waitForElementToBeRemoved } from "@testing-library/react";
import { ThemeChanger } from "./ThemeChanger";
import { vi,it,expect,beforeEach,describe } from "vitest";

// Mocks
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@/hooks/Theme.hook", () => ({
  useTheming: () => ({ changeTheme: vi.fn() }),
}));

vi.mock("@/utils/browserStorage", () => ({
  localStorageAccessor: () => [() => "default"],
}));

describe("ThemeChanger Component", () => {
  it("closes the drawer when close icon is clicked", async () => {
    render(<ThemeChanger />);

    // Open drawer
    const themeButton = screen.getByTestId("ThemeButton");
    fireEvent.click(themeButton);

    // Wait for drawer to show
    const drawerHeading = await screen.findByText("theme_settings");
    expect(drawerHeading).toBeInTheDocument();

    // Click close icon
    const closeIcon = screen.getByRole("img"); // CloseCircleOutlined
    fireEvent.click(closeIcon);

    // Wait for drawer heading to be removed
    await waitForElementToBeRemoved(() => screen.queryByText("theme_settings"));
  });
});
