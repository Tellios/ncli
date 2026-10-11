import {getCmdResult} from '../../common/index.ts';
import {type ResourceType} from './resource-type.ts';

export const getResourceInfo = async (
  type: ResourceType,
  resourceName: string,
): Promise<any> => {
  const data = await getCmdResult('kubectl', [
    'get',
    type,
    '-o',
    'json',
    resourceName,
  ]);

  return JSON.parse(data);
};
