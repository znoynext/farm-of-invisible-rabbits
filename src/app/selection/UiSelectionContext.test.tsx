import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { UiSelectionProvider, useUiSelection } from ".";

function SelectionProbe() {
  const { selectedLocation, setSelectedLocation } = useUiSelection();

  return (
    <>
      <output aria-label="Выбранная локация">{selectedLocation ?? "Нет"}</output>
      <button onClick={() => setSelectedLocation("Огород")} type="button">
        Выбрать огород
      </button>
    </>
  );
}

describe("UiSelectionProvider", () => {
  it("хранит временный выбор отдельно от persisted state", async () => {
    const user = userEvent.setup();

    render(
      <UiSelectionProvider>
        <SelectionProbe />
      </UiSelectionProvider>,
    );

    expect(screen.getByLabelText("Выбранная локация")).toHaveTextContent("Нет");
    await user.click(screen.getByRole("button", { name: "Выбрать огород" }));
    expect(screen.getByLabelText("Выбранная локация")).toHaveTextContent("Огород");
  });
});
