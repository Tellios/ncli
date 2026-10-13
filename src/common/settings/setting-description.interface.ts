import { type SettingType } from './setting-type.ts';

export type SettingDescription<Type extends SettingType> = {
  description: string;
  type: Type;
  hidden?: boolean;
};
