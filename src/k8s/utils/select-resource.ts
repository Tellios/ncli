import { selectItem } from '../../common/index.ts';
import { type Resource } from './resource.interface.ts';

export const selectResource = async (
  resources: Resource[]
): Promise<Resource> => {
  const index = await selectItem(resources.map((r) => r.name));
  return resources[index];
};
