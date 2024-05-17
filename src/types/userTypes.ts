export interface IUser {
  _id: string;
  email: string;
  name: string;
  password: string;
  passwordConfirm: string | undefined;
  addressLine1: string;
  city: string;
  country: string;
  correctPassword: (
    candidatePassword: string,
    userPassword: string
  ) => Promise<boolean>;
}
