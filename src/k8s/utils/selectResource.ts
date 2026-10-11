import {selectItem} from '../../common/index.ts';
import {type IResource} from './IResource.ts';

export const selectResource = async (
  resources: IResource[],
): Promise<IResource> => {
  const index = await selectItem(resources.map((r) => r.name));
  return resources[index];
};
