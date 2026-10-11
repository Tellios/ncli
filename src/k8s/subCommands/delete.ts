import {ConsoleInterface, Type} from '../../common/index.ts';
import {
  selectResource,
  getResources,
  deleteResource,
  resolveResourceType,
  type IResolveResourceTypeParams,
} from '../utils/index.ts';

export type IDeleteScriptParams = {
  type: IResolveResourceTypeParams;
};

export async function deleteCommand(
  parameters: IDeleteScriptParams,
): Promise<void> {
  const type = await resolveResourceType(parameters.type);
  const resources = await getResources(type);

  if (resources.length === 0) {
    ConsoleInterface.printLine(
      `No resources of type ${type} was found using current context`,
      Type.warn,
    );
    return;
  }

  const resource = await selectResource(resources);
  await deleteResource(type, resource.name);
}
