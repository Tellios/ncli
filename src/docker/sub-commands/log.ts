import {selectItem} from '../../common/index.ts';
import {
  getContainers,
  getDockerContainersStatusRows,
  logContainer,
} from '../utils/index.ts';

export type LogCommandParams = {
  onlyShowRunning: boolean;
  follow: boolean;
};

export const logCommand = async ({
  onlyShowRunning,
  follow,
}: LogCommandParams): Promise<void> => {
  const containers = await getContainers(onlyShowRunning);
  const rows: string[] = getDockerContainersStatusRows(containers);

  const selectedIndex = await selectItem(rows, 'Select container to start');
  const selectedContainer = containers[selectedIndex];

  await logContainer(selectedContainer.containerId, follow);
};
