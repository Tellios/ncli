import {type SettingScope} from './setting-scope.ts';
import {type SettingValue} from './setting-value.ts';

export type PersistedSetting = {
  key: string;
  scope: SettingScope;
  workingDirectory?: string;
  value: SettingValue;
};
