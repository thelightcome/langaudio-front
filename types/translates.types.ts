import { ILanguage } from "./languages.types";
import { ISource } from "./sources.types";

export interface ITranslateCreate {
  name: string;
  text: string;
  langId: number;
  sourceId: number;
}

export interface ITranslate {
  id?: number;
  name: string;
  text: string;
  langId: number;
  sourceId: number;
  lang?: ILanguage;
  source?: ISource;
}

export interface ISearchTranslate {
  langId?: number;
  sourceId?: number;
  offset: number;
  limit: number;
  include?: string[];
}

export interface ITranslateData {
  id: number;
  name: string;
  text: string;
  authorId: string;
  langId: string;
  sourceId: number;
  raiting: number;
  createdAt: string;
  updatedAt: string;
}
