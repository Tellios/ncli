import { ConsoleInterface, Type, selectItem } from '../../common';
import {
  getResources,
  selectResource,
  showResourceLogs,
  getResourceInfo
} from '../utils';

export interface ILogScriptParams {
  follow: boolean;
}

export async function logCommand(params: ILogScriptParams): Promise<void> {
  const resources = await getResources('pod');

  if (resources.length === 0) {
    ConsoleInterface.printLine(`No pods available`, Type.warn);
    return;
  }

  const resource = await selectResource(resources);

  const info = await getResourceInfo('pod', resource.name);
  const containerNames = info.spec.containers.map((c: any) => c.name);
  const containerName = await getContainerName(containerNames);

  await showResourceLogs(params.follow, resource.name, containerName);
}

async function getContainerName(containerNames: string[]): Promise<string> {
  if (containerNames.length === 1) {
    return containerNames[0];
  }

  const index = await selectItem(
    containerNames,
    'Select container to view logs for'
  );
  return containerNames[index];
}
