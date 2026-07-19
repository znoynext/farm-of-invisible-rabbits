import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { UiSelectionProvider, useUiSelection } from ".";

function SelectionProbe() {
  const {
    selectedLocation,
    selectedSignalType,
    setSelectedLocation,
    setSelectedSignalType,
  } = useUiSelection();

  return (
    <>
      <output aria-label="Выбранная локация">{selectedLocation ?? "Нет"}</output>
      <output aria-label="Выбранный тип сигнала">
        {selectedSignalType ?? "Нет"}
      </output>
      <button onClick={() => setSelectedLocation("Огород")} type="button">
        Выбрать огород
      </button>
      <button onClick={() => setSelectedSignalType("missing_carrot")} type="button">
        Выбрать пропавшую морковь
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
    await user.click(
      screen.getByRole("button", { name: "Выбрать пропавшую морковь" }),
    );
    expect(screen.getByLabelText("Выбранный тип сигнала")).toHaveTextContent(
      "missing_carrot",
    );
  });
});
