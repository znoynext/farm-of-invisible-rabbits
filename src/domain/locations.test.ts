import { initialSignals } from "../data/initialSignals";
import { aggregateLocationActivity } from "./locations";

describe("location aggregation", () => {
  it("агрегирует события одной локации по raw impact", () => {
    const signals = [
      initialSignals[0]!,
      { ...initialSignals[1]!, location: "Огород" },
      initialSignals[2]!,
    ];
    const locations = aggregateLocationActivity(signals);
    const garden = locations.find((location) => location.location === "Огород");

    expect(garden).toMatchObject({
      eventCount: 2,
      observedCount: 7,
    });
    expect(garden?.totalImpact).toBeCloseTo(3.36, 10);
    expect(locations.reduce((total, item) => total + item.contribution, 0)).toBeCloseTo(100, 10);
  });

  it("сортирует локации по активности и обрабатывает пустые данные", () => {
    const canonicalLocations = aggregateLocationActivity(initialSignals);

    expect(canonicalLocations.map(({ location }) => location)).toEqual([
      "У забора",
      "Сарай",
      "Огород",
    ]);
    const garden = canonicalLocations.find(({ location }) => location === "Огород");
    const fence = canonicalLocations.find(({ location }) => location === "У забора");
    const barn = canonicalLocations.find(({ location }) => location === "Сарай");

    expect(garden?.totalImpact).toBeCloseTo(1.4, 10);
    expect(garden?.activityLevel).toBe("moderate");
    expect(fence?.totalImpact).toBeCloseTo(1.96, 10);
    expect(fence?.activityLevel).toBe("high");
    expect(barn?.totalImpact).toBeCloseTo(1.6, 10);
    expect(barn?.activityLevel).toBe("high");
    expect(aggregateLocationActivity([])).toEqual([]);
  });
});
