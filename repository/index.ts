import { $Fetch } from "ohmyfetch";

import AuthModule from "./modules/auth";
import CountryModule from "./modules/countries";
import ImplementorModule from "./modules/implementors";
import LangsModule from "./modules/langs";
import PlaylistModule from "./modules/playlists";
import SourceModule from "./modules/source";
import TranslateModule from "./modules/translates";
import RolesModule from "./modules/roles";
import UsersModule from "./modules/users";

export interface IApiInstance {
  auth: AuthModule;
  country: CountryModule;
  implementor: ImplementorModule;
  langs: LangsModule;
  playlist: PlaylistModule;
  source: SourceModule;
  translate: TranslateModule;
  roles: RolesModule;
  users: UsersModule;
}

export type IApiKeys = keyof IApiInstance;

export default function (apiFetcher: $Fetch): IApiInstance {
  return {
    auth: new AuthModule(apiFetcher),
    country: new CountryModule(apiFetcher),
    implementor: new ImplementorModule(apiFetcher),
    langs: new LangsModule(apiFetcher),
    playlist: new PlaylistModule(apiFetcher),
    source: new SourceModule(apiFetcher),
    translate: new TranslateModule(apiFetcher),
    roles: new RolesModule(apiFetcher),
    users: new UsersModule(apiFetcher),
  };
}
