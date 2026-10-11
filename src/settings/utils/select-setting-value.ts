import {cyanBright} from 'chalk';
import {
  confirm,
  inputString,
  UnreachableCaseError,
  type SettingDescription,
} from '../../common/index.ts';

export const selectSettingValue = async (
  settingKey: string,
  setting: SettingDescription<'boolean' | 'string'>,
): Promise<boolean | string> => {
  const key = cyanBright(settingKey);

  switch (setting.type) {
    case 'boolean': {
      return confirm(`Should ${key} be enabled`);
    }

    case 'string': {
      return inputString('Set the value');
    }

    default: {
      throw new UnreachableCaseError(setting.type);
    }
  }
};
