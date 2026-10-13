import { type PersistedSettings } from './persisted-settings.interface.ts';

export type SettingsFile = {
  version: number;
  settings: PersistedSettings;
};
