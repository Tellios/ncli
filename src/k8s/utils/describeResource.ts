import {runCmdInConsole} from '../../common/index.ts';
import {type ResourceType} from './ResourceType.ts';

const resourceTypeCommands: Record<ResourceType, string[]> = {
  deployment: ['describe', 'deployment'],
  pod: ['describe', 'pod'],
  service: ['describe', 'service'],
  ingress: ['describe', 'ingress'],
};

export const describeResource = async (
  type: ResourceType,
  resourceName: string,
): Promise<void> => {
  await runCmdInConsole('kubectl', [
    ...resourceTypeCommands[type],
    resourceName,
  ]);
};
