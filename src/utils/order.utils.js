export function getNumberWithPrecision(value, precision = 2) {
  return Number(getNumberWithPrecisionAsString(value, precision));
}

export function getNumberWithPrecisionAsString(value, precision = 2) {
  return value.toFixed(precision);
}
