import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { UiSelectionProvider, useUiSelection } from "../../app/selection";
import {
  AppStateProvider,
  createDefaultPersistedState,
  PERSISTED_STATE_KEY,
  type StorageAdapter,
  UI_PREFERENCES_KEY,
  useAppState,
} from "../../app/state";
import { DEFAULT_SIGNAL_WEIGHTS } from "../../domain";
import { ModelSettingsSection } from "./ModelSettingsSection";

class MemoryStorage implements StorageAdapter {
  private readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

function renderModel(storage = new MemoryStorage(), withProbe = false) {
  return {
    storage,
    ...render(
      <AppStateProvider storage={storage}>
        <UiSelectionProvider>
          {withProbe ? <ModelStateProbe /> : null}
          <ModelSettingsSection />
        </UiSelectionProvider>
      </AppStateProvider>,
    ),
  };
}

function changeSlider(name: string, value: number) {
  fireEvent.change(screen.getByRole("slider", { name }), {
    target: { value: String(value) },
  });
}

function readPersistedState(storage: MemoryStorage) {
  return JSON.parse(storage.getItem(PERSISTED_STATE_KEY) ?? "null") as ReturnType<
    typeof createDefaultPersistedState
  >;
}

describe("ModelSettingsSection", () => {
  it("показывает прозрачные defaults и обязательные объяснения", () => {
    renderModel();

    expect(
      screen.getByRole("heading", { level: 1, name: "Модель оценки" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Настройте, как система интерпретирует наблюдения с фермы."),
    ).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "Чувствительность модели" })).toHaveValue("1");
    expect(screen.getByRole("slider", { name: "Вес: Пропавшая морковь" })).toHaveValue("0.7");
    expect(screen.getByRole("slider", { name: "Вес: Новые ямки" })).toHaveValue("1.4");
    expect(screen.getByRole("slider", { name: "Вес: Движение" })).toHaveValue("2");
    expect(screen.getByRole("slider", { name: "Вес: Шорох" })).toHaveValue("1.1");
    expect(
      screen.getByRole("button", { name: "Вернуть стандартные настройки" }),
    ).toBeDisabled();
    expect(
      screen.getByText(/Уверенность отражает качество и разнообразие/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Она не является статистически обученной/),
    ).toBeInTheDocument();
  });

  it.each([
    [0.5, 2],
    [1, 5],
    [1.5, 7],
  ])(
    "для sensitivity %s показывает estimate %s и сохраняет confidence",
    (sensitivity, expectedEstimate) => {
      renderModel();
      const liveResult = screen.getByRole("region", {
        name: "Текущий результат модели",
      });

      changeSlider("Чувствительность модели", sensitivity);

      expect(within(liveResult).getByText(String(expectedEstimate))).toBeInTheDocument();
      expect(within(liveResult).getByText(/73%/)).toBeInTheDocument();
    },
  );

  it("принимает веса 0 и 3, показывает влияние текстом и меняет evidence", () => {
    renderModel();

    changeSlider("Вес: Движение", 0);
    expect(screen.getByRole("slider", { name: "Вес: Движение" })).toHaveValue("0");
    expect(screen.getByText("Не учитывается")).toBeInTheDocument();

    changeSlider("Вес: Пропавшая морковь", 3);
    expect(screen.getByRole("slider", { name: "Вес: Пропавшая морковь" })).toHaveValue("3");
    expect(screen.getByText("Очень сильное влияние")).toBeInTheDocument();
    expect(
      within(screen.getByRole("region", { name: "Текущий результат модели" }))
        .getByText("Пропавшая морковь"),
    ).toBeInTheDocument();
    expect(screen.getByText(/73%/)).toBeInTheDocument();
  });

  it("сохраняет настройки, восстанавливает их после reload и сбрасывает без потери данных", async () => {
    const user = userEvent.setup();
    const storage = new MemoryStorage();
    storage.setItem(UI_PREFERENCES_KEY, JSON.stringify({ hasSeenIntro: true }));
    const firstRender = renderModel(storage);

    changeSlider("Чувствительность модели", 1.5);
    changeSlider("Вес: Движение", 0);

    await waitFor(() => {
      expect(readPersistedState(storage).modelSettings).toEqual({
        sensitivity: 1.5,
        weights: { ...DEFAULT_SIGNAL_WEIGHTS, motion_sensor: 0 },
      });
    });

    firstRender.unmount();
    renderModel(storage);

    expect(screen.getByRole("slider", { name: "Чувствительность модели" })).toHaveValue("1.5");
    expect(screen.getByRole("slider", { name: "Вес: Движение" })).toHaveValue("0");

    await user.click(
      screen.getByRole("button", { name: "Вернуть стандартные настройки" }),
    );

    expect(screen.getByText("Стандартные настройки восстановлены")).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "Чувствительность модели" })).toHaveValue("1");
    expect(screen.getByRole("slider", { name: "Вес: Движение" })).toHaveValue("2");
    await waitFor(() => {
      expect(readPersistedState(storage)).toEqual(createDefaultPersistedState());
      expect(JSON.parse(storage.getItem(UI_PREFERENCES_KEY) ?? "null")).toEqual({
        hasSeenIntro: true,
      });
    });
  });

  it("сбрасывает active scenario до model mutation и не создаёт selection side effect", async () => {
    const user = userEvent.setup();
    renderModel(new MemoryStorage(), true);

    await user.click(screen.getByRole("button", { name: "Создать preview" }));
    await user.click(screen.getByRole("button", { name: "Выбрать зону" }));
    expect(screen.getByTestId("scenario-state")).toHaveTextContent("active");
    expect(screen.getByTestId("selection-state")).toHaveTextContent(
      "У забора|new_hole",
    );

    changeSlider("Чувствительность модели", 1.5);

    expect(screen.getByTestId("scenario-state")).toHaveTextContent("none");
    expect(screen.getByTestId("selection-state")).toHaveTextContent(
      "У забора|new_hole",
    );
    expect(screen.getByTestId("signals-count")).toHaveTextContent("3");
  });
});

function ModelStateProbe() {
  const { dispatch, state } = useAppState();
  const {
    selectedLocation,
    selectedSignalType,
    setSelectedLocation,
    setSelectedSignalType,
  } = useUiSelection();

  return (
    <div>
      <button
        onClick={() =>
          dispatch({
            type: "scenario/updateObservations",
            payload: {
              signals: state.signals.map((signal, index) =>
                index === 1 ? { ...signal, intensity: 10 } : signal,
              ),
            },
          })
        }
        type="button"
      >
        Создать preview
      </button>
      <button
        onClick={() => {
          setSelectedLocation("У забора");
          setSelectedSignalType("new_hole");
        }}
        type="button"
      >
        Выбрать зону
      </button>
      <output data-testid="scenario-state">
        {state.scenarioPreview ? "active" : "none"}
      </output>
      <output data-testid="selection-state">
        {selectedLocation ?? "none"}|{selectedSignalType ?? "none"}
      </output>
      <output data-testid="signals-count">{state.signals.length}</output>
    </div>
  );
}
