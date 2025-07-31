export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterResponse {
  user: {
    id: number;
    username: string;
  };
}

export type User = {
  id: number;
  name: string;
  role: string;
  email: string;
  avatarUrl: string;
};
