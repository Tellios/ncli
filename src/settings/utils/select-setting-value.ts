import { styleText } from 'node:util';
import {
  confirm,
  inputString,
  UnreachableCaseError,
  type SettingDescription
} from '../../common/index.ts';

export const selectSettingValue = async (
  settingKey: string,
  setting: SettingDescription<'boolean' | 'string'>
): Promise<boolean | string> => {
  const key = styleText('cyanBright', settingKey);

  switch (setting.type) {
    case 'boolean': {
      return confirm(`Should ${key} be enabled`);
    }

    case 'string': {
      return inputString('Set the value');
    }
  }
};
