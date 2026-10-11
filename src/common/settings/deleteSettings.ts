import {differenceWith, isEqual} from 'lodash';
import {type NcliCommand} from './NcliCommand.ts';
import {type IPersistedSetting} from './IPersistedSetting.ts';
import {getSettings} from './getSettings.ts';
import {persistSettings} from './persistSettings.ts';

export const deleteSettings = async (
  command: NcliCommand,
  settingsToDelete: IPersistedSetting[],
): Promise<void> => {
  const settings = await getSettings();
  const commandSettings = settings[command] ?? [];
  const settingsToKeep = differenceWith(
    commandSettings,
    settingsToDelete,
    isEqual,
  );

  // Make sure to remove the command from settings entirely if no
  // settings have been made for the command
  settings[command] = settingsToKeep.length > 0 ? settingsToKeep : undefined;

  await persistSettings(settings);
};
