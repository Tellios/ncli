import { getSettings } from './get-settings.ts';
import { type PersistedSetting } from './persisted-setting.interface.ts';
import { type NcliCommand } from './ncli-command.ts';
import { persistSettings } from './persist-settings.ts';

export const updateSetting = async (
  command: NcliCommand,
  setting: PersistedSetting
): Promise<void> => {
  const settings = await getSettings();
  const commandSettings = settings[command] ?? [];

  const index = commandSettings.findIndex(
    (cs) =>
      cs.key === setting.key &&
      cs.scope === setting.scope &&
      cs.workingDirectory === setting.workingDirectory
  );

  if (index === -1) {
    commandSettings.push(setting);
  } else {
    commandSettings[index] = setting;
  }

  settings[command] = commandSettings;

  await persistSettings(settings);
};
