export class RegisterUserDto {
  userName!: string;
  email!: string;
  password!: string;
  phoneNumber?: string;
  address?: string;
}

export class LoginUserDto {
  email!: string;
  password!: string;
}

export class UserResponseDto {
  _id!: string;
  userName!: string;
  email!: string;
  role!: string;
  phoneNumber?: string;
  address?: string;
}