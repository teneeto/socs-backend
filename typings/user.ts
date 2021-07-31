export const enum Gender {
  MALE = 'male',
  FEMALE = 'female'
}

export const enum Role {
  ADMIN = 'admin',
  AGENT = 'agent',
  CUSTOMER = 'customer',
  SUPER_ADMIN = 'super_admin'
}

export const enum UserStatus {
  AWAY = 'away',
  ONLINE = 'online',
  OFFLINE = 'offline'
}

export const enum Availability {
  PICK_UP = 'pick_up',
  DELIVERY = 'delivery'
}

export interface AddressInterface {
  city?: string;
  state?: string;
  country?: string;
  address?: string;
  postal_code?: string;
}

export interface UserInterface {
  id: string;
  role: Role;
  email: string;
  phone: string;
  image?: string;
  gender: Gender;
  created_at: Date;
  updated_at: Date;
  password: string;
  last_name: string;
  status: UserStatus;
  first_name: string;
  is_delete: boolean;
  is_verified: boolean;
  availability?: Availability;
  address?: AddressInterface;
}

export interface UserTokenType {
  role: Role;
  id: string;
  sub: string;
  iat: number;
}
