import {type IPersistedSettings} from './IPersistedSettings.ts';

export type ISettingsFile = {
  version: number;
  settings: IPersistedSettings;
};
