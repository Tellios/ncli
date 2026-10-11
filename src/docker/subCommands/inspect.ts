import {selectItem} from '../../common/index.ts';
import {
  getContainers,
  getDockerContainersStatusRows,
  inspectResource,
} from '../utils/index.ts';

export type IInspectCommandParams = {
  onlyShowRunning: boolean;
};

export const inspectCommand = async ({
  onlyShowRunning,
}: IInspectCommandParams): Promise<void> => {
  const containers = await getContainers(onlyShowRunning);
  const rows: string[] = getDockerContainersStatusRows(containers);

  const selectedIndex = await selectItem(rows, 'Select container to inspect');
  const selectedContainer = containers[selectedIndex];

  await inspectResource(selectedContainer.containerId);
};
