export function getNumberWithPrecision(
  value: number,
  precision: number
): number {
  return Number(getNumberWithPrecisionAsString(value, precision));
}

export function getNumberWithPrecisionAsString(
  value: number,
  precision: number = 2
): string {
  return value.toFixed(precision);
}
