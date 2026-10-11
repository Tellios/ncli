import {EOL} from 'node:os';
import {getCmdResult, parseCliTable} from '../../common/index.ts';
import {type ResourceType} from './ResourceType.ts';
import {type IResource} from './IResource.ts';

const resourceTypeCommands: Record<ResourceType, string[]> = {
  deployment: ['get', 'deployments'],
  pod: ['get', 'pods'],
  service: ['get', 'services'],
  ingress: ['get', 'ingresses'],
};

export const getResources = async <T = IResource>(
  type: ResourceType,
): Promise<T[]> => {
  const res = await getCmdResult('kubectl', resourceTypeCommands[type]);
  const rows = res.split(EOL);

  return parseCliTable<T>(rows);
};
