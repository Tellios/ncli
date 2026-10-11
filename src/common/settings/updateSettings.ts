import {getSettings} from './getSettings.ts';
import {type IPersistedSetting} from './IPersistedSetting.ts';
import {type NcliCommand} from './NcliCommand.ts';
import {persistSettings} from './persistSettings.ts';

export const updateSetting = async (
  command: NcliCommand,
  setting: IPersistedSetting,
): Promise<void> => {
  const settings = await getSettings();
  const commandSettings = settings[command] ?? [];

  const index = commandSettings.findIndex(
    (cs) =>
      cs.key === setting.key &&
      cs.scope === setting.scope &&
      cs.workingDirectory === setting.workingDirectory,
  );

  if (index === -1) {
    commandSettings.push(setting);
  } else {
    commandSettings[index] = setting;
  }

  settings[command] = commandSettings;

  await persistSettings(settings);
};
