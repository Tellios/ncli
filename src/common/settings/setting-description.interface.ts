import {type SettingType} from './setting-type.ts';

export type SettingDescription<TSettingType extends SettingType> = {
  description: string;
  type: TSettingType;
  hidden?: boolean;
};
