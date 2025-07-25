export interface RegisterInput {
  email: string;
  password: string;
  username: string;
}

export interface AuthToken {
  token: string;
}

export interface CheckUserName {
  username: string;
}
