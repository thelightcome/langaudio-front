import { ICountry } from "./countries.types";

export interface IImplementorCreate {
  name: string;
  countries: string[];
}

export interface IImplementor {
  id: number;
  name: string;
  countries: ICountry[];
  isVerified: boolean;
  raiting: number;
}

export interface ISearchImplementor {
  name?: string;
  countries?: string[];
  isVerified?: boolean;
  offset?: number;
  limit?: number;
}
