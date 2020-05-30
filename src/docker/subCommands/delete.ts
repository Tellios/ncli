import { selectItems, ConsoleInterface, Type } from '../../common';
import {
  getContainers,
  deleteContainer,
  getDockerContainersStatusRows
} from '../utils';

export interface IDeleteCommandParams {
  onlyShowRunning: boolean;
  forcefullyDelete: boolean;
}

export const deleteCommand = async ({
  onlyShowRunning,
  forcefullyDelete
}: IDeleteCommandParams): Promise<void> => {
  const containers = await getContainers(onlyShowRunning);

  if (containers.length === 0) {
    ConsoleInterface.printLine('No containers found', Type.warn);
    return;
  }

  const rows = getDockerContainersStatusRows(containers);
  const selectedIndexes = await selectItems({
    items: rows,
    message: 'Select containers to remove'
  });

  const processesToRemove = selectedIndexes.map(index => containers[index]);

  for (const process of processesToRemove) {
    await deleteContainer(forcefullyDelete, process.containerId);
  }
};
