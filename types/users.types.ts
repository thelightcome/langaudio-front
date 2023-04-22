export interface IRole {
  id: number;
  value: string;
}

export interface IUsers {
  id: string;
  email: string;
  roles: IRole[];
}

export interface ISearchUsers {
  email?: string;
  role?: string;
  offset?: number;
  limit?: number;
}
