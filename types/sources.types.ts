import { ILanguage } from "./languages.types";
import { IImplementor, IImplementorCreate } from "~/types/implementors.types";

export interface ISource {
  id: number;
  isVerified: boolean;
  langCode: string;
  lang: ILanguage;
  name: string;
  raiting: number;
  srcYoutube: string;
  text: string;
  implementors: IImplementor[];
  updatedAt: string;
}

export interface ISourceSend extends Omit<ISource, "implementors"> {
  implementors: IImplementorCreate;
}

export interface IUpdateSource extends Partial<ISourceSend> {}

export interface ISearchSource {
  name?: string;
  langCode?: string;
  implementor?: string;
  isVerified?: boolean;
  offset?: number;
  limit?: number;
}
