// utils.ts

export type CleaningTypeKey = "machineCleaning" | "handmadeCleaning" | "other";

export interface CleaningType {
  type: CleaningTypeKey;
  price: number;
  displayName: string;
}

export const CLEANING_TYPES: Record<CleaningTypeKey, CleaningType> = {
  machineCleaning: {
    type: "machineCleaning",
    price: 7.9,
    displayName: "Машинно пране",
  },
  handmadeCleaning: {
    type: "handmadeCleaning",
    price: 12.0,
    displayName: "Ръчно пране",
  },
  other: {
    type: "other",
    price: 0,
    displayName: "Други",
  },
};

export const CLEANING_TYPE_DISPLAY_NAMES: Record<CleaningTypeKey, string> = {
  machineCleaning: "Машинно пране",
  handmadeCleaning: "Ръчно пране",
  other: "Други",
};

export function getCleaningTypeDisplayName(type: CleaningTypeKey): string {
  return CLEANING_TYPE_DISPLAY_NAMES[type];
}

export function getCleaningTypes(): CleaningType[] {
  return Object.values(CLEANING_TYPES);
}

export function getCleaningTypePrice(type: CleaningTypeKey): number {
  return CLEANING_TYPES[type]?.price ?? 0;
}
