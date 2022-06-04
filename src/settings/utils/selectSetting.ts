import {
  selectItem,
  NcliCommand,
  ISettingDescription,
  availableSettings,
  SettingType
} from '../../common';

export const selectSetting = async (
  command: NcliCommand
): Promise<[string, ISettingDescription<SettingType>]> => {
  const commandSettings = availableSettings[command];
  const settingEntries =
    Object.entries<ISettingDescription<SettingType>>(commandSettings);

  const index = await selectItem(
    settingEntries.map(
      ([key, { type, description }]) => `${key} (${type}): ${description}`
    )
  );

  return settingEntries[index];
};
