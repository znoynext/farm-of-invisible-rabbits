import {
  classifyLocationActivity,
  classifyOverallActivity,
} from "./activity";

describe("activity classification", () => {
  it.each([
    [0.74, "low"],
    [0.75, "moderate"],
    [1.49, "moderate"],
    [1.5, "high"],
  ] as const)("classifies location impact %s as %s", (impact, expected) => {
    expect(classifyLocationActivity(impact)).toBe(expected);
  });

  it.each([
    [0, "none"],
    [1, "low"],
    [2, "low"],
    [3, "moderate"],
    [6, "moderate"],
    [7, "high"],
  ] as const)("classifies overall estimate %s as %s", (estimate, expected) => {
    expect(classifyOverallActivity(estimate)).toBe(expected);
  });
});
