import { ILanguage } from "./languages.types";
import { ISource } from "./sources.types";

export interface ITranslate {
  id?: number;
  name: string;
  text: string;
  langCode: string;
  sourceId: number;
  lang?: ILanguage;
  source?: ISource;
}

export interface ISearchTranslate {
  langCode?: string;
  sourceId?: number;
  sourceName?: string;
  sourceImplementor?: string;
  offset: number;
  limit: number;
  include?: string[];
}
