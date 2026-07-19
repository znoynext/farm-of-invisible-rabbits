export type LocationActivityLevel = "low" | "moderate" | "high";

export type OverallActivityLevel = "none" | "low" | "moderate" | "high";

export function classifyLocationActivity(totalImpact: number): LocationActivityLevel {
  if (totalImpact < 0.75) {
    return "low";
  }

  return totalImpact < 1.5 ? "moderate" : "high";
}
export function classifyOverallActivity(
  estimatedRabbits: number,
): OverallActivityLevel {
  if (estimatedRabbits <= 0) {
    return "none";
  }

  if (estimatedRabbits <= 2) {
    return "low";
  }

  return estimatedRabbits <= 6 ? "moderate" : "high";
}
