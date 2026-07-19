import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { createDefaultAppState, deriveAnalytics } from "../../app/state";
import { initialSignals } from "../../data/initialSignals";
import { FarmMap } from "./FarmMap";

function canonicalLocations() {
  return deriveAnalytics(createDefaultAppState()).locationActivity;
}

describe("FarmMap", () => {
  it("показывает канонические зоны и их domain activity levels", () => {
    render(
      <FarmMap
        locations={canonicalLocations()}
        onSelectedLocationChange={() => undefined}
        selectedLocation={null}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Огород: Умеренная активность, 1 наблюдение",
      }),
    ).toHaveAttribute("data-activity", "moderate");
    expect(
      screen.getByRole("button", {
        name: "У забора: Высокая активность, 1 наблюдение",
      }),
    ).toHaveAttribute("data-activity", "high");
    expect(
      screen.getByRole("button", {
        name: "Сарай: Высокая активность, 1 наблюдение",
      }),
    ).toHaveAttribute("data-activity", "high");
    expect(screen.getByRole("heading", { level: 3, name: "У забора" })).toBeInTheDocument();
    expect(screen.getByText("1,96")).toBeInTheDocument();
  });

  it("показывает зону при hover/focus и закрепляет выбор по click", async () => {
    const user = userEvent.setup();
    let selectedLocation: string | null = null;
    const onSelectedLocationChange = (location: string | null) => {
      selectedLocation = location;
    };
    const { rerender } = render(
      <FarmMap
        locations={canonicalLocations()}
        onSelectedLocationChange={onSelectedLocationChange}
        selectedLocation={selectedLocation}
      />,
    );
    const garden = screen.getByRole("button", {
      name: "Огород: Умеренная активность, 1 наблюдение",
    });

    await user.hover(garden);
    expect(screen.getByRole("heading", { level: 3, name: "Огород" })).toBeInTheDocument();

    await user.click(garden);
    rerender(
      <FarmMap
        locations={canonicalLocations()}
        onSelectedLocationChange={onSelectedLocationChange}
        selectedLocation={selectedLocation}
      />,
    );

    expect(garden).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Закреплённая зона")).toBeInTheDocument();
  });

  it("поддерживает выбор зоны с клавиатуры", async () => {
    const user = userEvent.setup();
    const onSelectedLocationChange = vi.fn();

    render(
      <FarmMap
        locations={canonicalLocations()}
        onSelectedLocationChange={onSelectedLocationChange}
        selectedLocation={null}
      />,
    );

    const barn = screen.getByRole("button", {
      name: "Сарай: Высокая активность, 1 наблюдение",
    });
    barn.focus();
    await user.keyboard("{Enter}");

    expect(onSelectedLocationChange).toHaveBeenCalledWith("Сарай");
  });

  it("показывает тихое empty state без ложной активности", () => {
    render(
      <FarmMap
        locations={[]}
        onSelectedLocationChange={() => undefined}
        selectedLocation={null}
      />,
    );

    expect(screen.getByText("Пока нет наблюдений для карты")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Карта ждёт первого сигнала" })).toBeInTheDocument();
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("принимает analytics любого сценария через props", () => {
    const state = createDefaultAppState();
    const previewLocations = deriveAnalytics({
      modelSettings: state.modelSettings,
      signals: [{ ...initialSignals[0]!, location: "Теплица" }],
    }).locationActivity;
    const { rerender } = render(
      <FarmMap
        locations={canonicalLocations()}
        onSelectedLocationChange={() => undefined}
        selectedLocation={null}
      />,
    );

    rerender(
      <FarmMap
        locations={previewLocations}
        onSelectedLocationChange={() => undefined}
        selectedLocation={null}
      />,
    );

    const unknownZone = screen.getByRole("button", {
      name: "Теплица: Умеренная активность, 1 наблюдение",
    });
    expect(unknownZone).toHaveAttribute("data-placement", "other");
    expect(screen.getByRole("heading", { level: 3, name: "Теплица" })).toBeInTheDocument();
  });
});
