import { selectItems, ConsoleInterface, Type } from '../../common';
import {
  getContainers,
  startContainer,
  getDockerContainersStatusRows
} from '../utils';

export const startCommand = async (): Promise<void> => {
  const containers = await getContainers();
  const stoppedContainers = containers.filter(
    process =>
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
    index => stoppedContainers[index]
  );

  for (const process of containersToStart) {
    await startContainer(process.containerId);
  }
};
