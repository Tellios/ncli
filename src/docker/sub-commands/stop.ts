import { selectItems, ConsoleInterface, Type } from '../../common/index.ts';
import {
  getContainers,
  stopContainer,
  getDockerContainersStatusRows
} from '../utils/index.ts';

export const stopCommand = async (): Promise<void> => {
  const containers = await getContainers();
  const runningContainers = containers.filter(
    (process) =>
      process.properties.State.Running ||
      process.properties.State.Restarting ||
      process.properties.State.Paused
  );

  if (runningContainers.length === 0) {
    ConsoleInterface.printLine(
      'No containers with the states [Running], [Restarting] or [Paused] found',
      Type.warn
    );
    return;
  }

  const rows = getDockerContainersStatusRows(runningContainers);
  const selectedIndexes = await selectItems({
    items: rows,
    message: 'Select container to stop'
  });
  const processesToStop = selectedIndexes.map(
    (index) => runningContainers[index]
  );

  await Promise.all(
    processesToStop.map(async (process) => stopContainer(process.containerId))
  );
};
