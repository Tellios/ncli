import {
  selectItem,
  type NcliCommand,
  type SettingDescription,
  availableSettings,
  type SettingType,
} from '../../common/index.ts';

export const selectSetting = async (
  command: NcliCommand,
): Promise<[string, SettingDescription<SettingType>]> => {
  const commandSettings = availableSettings[command];
  const settingEntries =
    Object.entries<SettingDescription<SettingType>>(commandSettings);

  const index = await selectItem(
    settingEntries.map(
      ([key, {type, description}]) => `${key} (${type}): ${description}`,
    ),
  );

  return settingEntries[index];
};
