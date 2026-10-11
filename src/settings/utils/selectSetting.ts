import {
  selectItem,
  type NcliCommand,
  type ISettingDescription,
  availableSettings,
  type SettingType,
} from '../../common/index.ts';

export const selectSetting = async (
  command: NcliCommand,
): Promise<[string, ISettingDescription<SettingType>]> => {
  const commandSettings = availableSettings[command];
  const settingEntries =
    Object.entries<ISettingDescription<SettingType>>(commandSettings);

  const index = await selectItem(
    settingEntries.map(
      ([key, {type, description}]) => `${key} (${type}): ${description}`,
    ),
  );

  return settingEntries[index];
};
