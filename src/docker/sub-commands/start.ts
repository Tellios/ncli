import { selectItems, ConsoleInterface, Type } from '../../common/index.ts';
import {
  getContainers,
  startContainer,
  getDockerContainersStatusRows
} from '../utils/index.ts';

export const startCommand = async (): Promise<void> => {
  const containers = await getContainers();
  const stoppedContainers = containers.filter(
    (process) =>
      !(
        process.properties.State.Running ||
        process.properties.State.Restarting ||
        process.properties.State.Paused
      )
  );

  if (stoppedContainers.length === 0) {
    ConsoleInterface.printLine('No stopped containers found', Type.warn);
    return;
  }

  const rows = getDockerContainersStatusRows(stoppedContainers);
  const selectedIndexes = await selectItems({
    items: rows,
    message: 'Select container to start'
  });

  const containersToStart = selectedIndexes.map(
    (index) => stoppedContainers[index]
  );

  await Promise.all(
    containersToStart.map(async (process) =>
      startContainer(process.containerId)
    )
  );
};
