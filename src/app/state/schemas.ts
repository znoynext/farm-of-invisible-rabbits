import { z } from "zod";

import {
  sensitivitySchema,
  signalDatasetSchema,
  signalWeightsSchema,
} from "../../domain";
import { STATE_SCHEMA_VERSION } from "./types";

export const modelSettingsSchema = z
  .object({
    sensitivity: sensitivitySchema,
    weights: signalWeightsSchema,
  })
  .strict();
export const persistedStateSchema = z
  .object({
    schemaVersion: z.literal(STATE_SCHEMA_VERSION),
    signals: signalDatasetSchema,
    modelSettings: modelSettingsSchema,
  })
  .strict();

export const uiPreferencesSchema = z
  .object({
    hasSeenIntro: z.boolean(),
  })
  .strict();
