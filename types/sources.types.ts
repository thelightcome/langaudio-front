import { ILanguage } from "./languages.types";
import { IImplementor, IImplementorCreate } from "~/types/implementors.types";

export interface ISourceCreate {
  name: string;
  text: string;
  srcYoutube: string;
  langs: number[];
  implementors: IImplementorCreate[];
}

export interface ISource {
  id: number;
  isVerified: boolean;
  langs: ILanguage[];
  name: string;
  raiting: number;
  srcYoutube: string;
  text: string;
  implementors: IImplementor[];
  updatedAt: string;
}

export interface IUpdateSource extends Partial<ISourceCreate> {}

export interface ISearchSource {
  id?: number;
  name?: string;
  langs?: number[];
  implementor?: string;
  isVerified?: boolean;
  offset?: number;
  limit?: number;
  fields?: string[];
}
