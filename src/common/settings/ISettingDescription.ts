import {type SettingType} from './SettingType.ts';

export type ISettingDescription<TSettingType extends SettingType> = {
  description: string;
  type: TSettingType;
  hidden?: boolean;
};
