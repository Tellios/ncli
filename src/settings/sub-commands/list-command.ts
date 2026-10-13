import {
  getSettings,
  ConsoleInterface,
  Type,
  type NcliCommand
} from '../../common/index.ts';
import {
  selectCommandToConfigure,
  getPrintableSettings
} from '../utils/index.ts';

export const listCommand = async (): Promise<void> => {
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

  const settingsList = getPrintableSettings(commandSettings);

  ConsoleInterface.printLines(settingsList);
};
