import { selectItem, NcliCommand } from '../../common';
import { supportedNcliCommands } from './supportedNcliCommands';

export const selectCommandToConfigure = async (
  commandList: NcliCommand[] = supportedNcliCommands
): Promise<NcliCommand> => {
  const index = await selectItem(commandList, 'Select command to configure');
  return commandList[index];
};
