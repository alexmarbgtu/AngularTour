export interface IUser {
  login: string,
  password: string,
  email?: string,
}
export interface IUserRegister {
  login: string,
  password: string,
  email: string,
}

export const userToken: string = 'user-token';
