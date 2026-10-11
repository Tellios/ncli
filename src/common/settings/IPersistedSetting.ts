import {type SettingScope} from './SettingScope.ts';
import {type SettingValue} from './SettingValue.ts';

export type IPersistedSetting = {
  key: string;
  scope: SettingScope;
  workingDirectory?: string;
  value: SettingValue;
};
