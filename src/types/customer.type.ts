export interface AddressDto {
  id: string; // Guid → string
  userId: string; // Guid → string
  userFullName: string;
  phoneNumber: string;
  displayAddress: string;
}

export interface UpdateAddress {
  userId?: string;
  userFullName: string;
  phoneNumber: string;
  displayAddress: string;
}
