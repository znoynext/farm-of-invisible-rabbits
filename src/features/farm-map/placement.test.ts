import { resolveFarmMapPlacement } from "./placement";

describe("farm map placement", () => {
  it("возвращает канонические точки для основных зон", () => {
    expect(resolveFarmMapPlacement("Огород")).toMatchObject({
      id: "garden",
      kind: "canonical",
      x: 27,
      y: 37,
    });
    expect(resolveFarmMapPlacement(" У забора ")).toMatchObject({
      id: "fence",
      kind: "canonical",
    });
    expect(resolveFarmMapPlacement("Сарай")).toMatchObject({
      id: "barn",
      kind: "canonical",
    });
  });

  it("детерминированно размещает неизвестную локацию вне канонической области", () => {
    const first = resolveFarmMapPlacement("Теплица");
    const repeated = resolveFarmMapPlacement("  теплица  ");

    expect(first).toEqual(repeated);
    expect(first.kind).toBe("other");
    expect(first.id).toMatch(/^other-/);
    expect(first.x).toBeGreaterThanOrEqual(18);
    expect(first.x).toBeLessThanOrEqual(82);
    expect(first.y).toBeGreaterThanOrEqual(82);
    expect(first.y).toBeLessThanOrEqual(89);
  });
});
