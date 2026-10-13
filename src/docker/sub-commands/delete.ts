import { selectItems, ConsoleInterface, Type } from '../../common/index.ts';
import {
  getContainers,
  deleteContainer,
  getDockerContainersStatusRows
} from '../utils/index.ts';

export type DeleteCommandParameters = {
  onlyShowRunning: boolean;
  forcefullyDelete: boolean;
};

export const deleteCommand = async ({
  onlyShowRunning,
  forcefullyDelete
}: DeleteCommandParameters): Promise<void> => {
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

  const processesToRemove = selectedIndexes.map((index) => containers[index]);

  await Promise.all(
    processesToRemove.map(async (process) =>
      deleteContainer(forcefullyDelete, process.containerId)
    )
  );
};
