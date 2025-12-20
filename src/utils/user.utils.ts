export function validatePhoneNumber(
  phoneNumber: string,
  isOptional = false
): boolean {
  const trimmed = phoneNumber.trim();
  if (isOptional && !trimmed) {
    return true;
  }

  const phoneRegex = /^(\+359|0)8|9[0-9]\d{7}$/;
  return phoneRegex.test(trimmed);
}
