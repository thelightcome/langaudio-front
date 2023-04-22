export interface IImplementorCreate {
  name: string;
  countryName: string;
}

export interface IImplementor extends IImplementorCreate {
  id: number;
  isVerified: boolean;
  raiting: number;
}

export interface ISearchImplementor {
  name?: string;
  countryName?: string;
  isVerified?: boolean;
  offset?: number;
  limit?: number;
}
