import { z } from "zod";

import { SUPPORTED_SIGNAL_TYPES } from "./constants";

export const signalTypeSchema = z.enum(SUPPORTED_SIGNAL_TYPES);

export const signalEventSchema = z
  .object({
    id: z.string().trim().min(1),
    event: signalTypeSchema,
    location: z.string().trim().min(1),
    count: z.number().finite().int().positive(),
    intensity: z.number().finite().min(1).max(10),
    time: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
  })
  .strict();

export const signalDatasetSchema = z.array(signalEventSchema).superRefine((signals, context) => {
  const knownIds = new Set<string>();

  signals.forEach((signal, index) => {
    if (knownIds.has(signal.id)) {
      context.addIssue({
        code: "custom",
        message: "Идентификаторы событий должны быть уникальными.",
        path: [index, "id"],
      });
    }

    knownIds.add(signal.id);
  });
});

export const signalWeightsSchema = z
  .object({
    missing_carrot: z.number().finite().min(0).max(3),
    new_hole: z.number().finite().min(0).max(3),
    motion_sensor: z.number().finite().min(0).max(3),
    barn_rustling: z.number().finite().min(0).max(3),
  })
  .strict();

export const sensitivitySchema = z.number().finite().min(0.5).max(1.5);

export function parseSignalDataset(input: unknown) {
  return signalDatasetSchema.parse(input);
}

export function parseSignalWeights(input: unknown) {
  return signalWeightsSchema.parse(input);
}

export function parseSensitivity(input: unknown) {
  return sensitivitySchema.parse(input);
}
