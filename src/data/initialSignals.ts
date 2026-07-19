import type { SignalEvent } from "../domain/types";

export const initialSignals = [
  {
    id: "evt_001",
    event: "missing_carrot",
    location: "Огород",
    count: 5,
    intensity: 4,
    time: "08:30",
  },
  {
    id: "evt_002",
    event: "new_hole",
    location: "У забора",
    count: 2,
    intensity: 7,
    time: "09:10",
  },
  {
    id: "evt_003",
    event: "motion_sensor",
    location: "Сарай",
    count: 1,
    intensity: 8,
    time: "10:05",
  },
] satisfies readonly SignalEvent[];
