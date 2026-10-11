import {
  deleteSettings,
  getSettings,
  ConsoleInterface,
  Type,
  selectItems,
  type NcliCommand,
} from '../../common/index.ts';
import {
  selectCommandToConfigure,
  getPrintableSettings,
} from '../utils/index.ts';

export const deleteCommand = async (): Promise<void> => {
  const settings = await getSettings();
  const commandsWithSettings = Object.keys(settings) as NcliCommand[];

  if (commandsWithSettings.length === 0) {
    ConsoleInterface.printLine('Settings file is empty', Type.warn);
    return;
  }

  const command = await selectCommandToConfigure(commandsWithSettings);
  const commandSettings = settings[command];

  if (commandSettings === undefined) {
    ConsoleInterface.printLine('No settings made for command');
    return;
  }

  const selectables = getPrintableSettings(commandSettings);
  const indexes = await selectItems({
    items: selectables,
    message: 'Select items to delete',
  });
  const selectedSettings = indexes.map((index) => commandSettings[index]);

  await deleteSettings(command, selectedSettings);
};
