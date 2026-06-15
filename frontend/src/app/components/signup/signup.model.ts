export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface SignupModel {
  email: string;
  password: string;
  smsNotifications: boolean;
  phones: string[];
  address: Address;
}
