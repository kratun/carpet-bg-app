export const CLEANING_TYPES = {
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
  other: { type: "other", price: 0, displayName: "Други" },
};

export const CLEANING_TYPE_DISPLAY_NAMES = {
  [CLEANING_TYPES.machineCleaning]: "Машинно пране",
  [CLEANING_TYPES.handmadeCleaning]: "Ръчно пране",
  [CLEANING_TYPES.other]: "Други",
};

export function getCleaningTypeDisplayName(type) {
  return CLEANING_TYPE_DISPLAY_NAMES[type] || "Други";
}

export function getCleaningTypes() {
  return Object.values(CLEANING_TYPES);
}

export function getCleaningTypePrice(type) {
  const cleaningType = CLEANING_TYPES[type];
  return cleaningType.price ?? 0;
}
