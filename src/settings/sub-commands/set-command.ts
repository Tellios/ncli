import { cwd } from 'node:process';
import { updateSetting } from '../../common/index.ts';
import {
  selectCommandToConfigure,
  selectScope,
  selectSetting,
  selectSettingValue
} from '../utils/index.ts';

export const setCommand = async (): Promise<void> => {
  const command = await selectCommandToConfigure();
  const [settingKey, settingDescription] = await selectSetting(command);
  const scope = await selectScope();
  const value = await selectSettingValue(settingKey, settingDescription);

  await updateSetting(command, {
    key: settingKey,
    scope,
    workingDirectory: scope === 'workingDirectory' ? cwd() : undefined,
    value
  });
};
