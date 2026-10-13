import { runCmdInConsole } from '../../common/index.ts';
import { type ResourceType } from './resource-type.ts';

const resourceTypeCommands: Record<ResourceType, string[]> = {
  deployment: ['delete', 'deployment'],
  pod: ['delete', 'pod'],
  service: ['delete', 'service'],
  ingress: ['delete', 'ingress']
};

export const deleteResource = async (
  type: ResourceType,
  resourceName: string
): Promise<void> => {
  await runCmdInConsole('kubectl', [
    ...resourceTypeCommands[type],
    resourceName
  ]);
};
