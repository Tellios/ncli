import {selectItem, type NcliCommand} from '../../common/index.ts';
import {supportedNcliCommands} from './supportedNcliCommands.ts';

export const selectCommandToConfigure = async (
  commandList: NcliCommand[] = supportedNcliCommands,
): Promise<NcliCommand> => {
  const index = await selectItem(commandList, 'Select command to configure');
  return commandList[index];
};
