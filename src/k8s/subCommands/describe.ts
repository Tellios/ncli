import { ConsoleInterface, Type } from '../../common';
import {
  selectResource,
  getResources,
  describeResource,
  resolveResourceType,
  IResolveResourceTypeParams
} from '../utils';

export interface IDescribeScriptParams {
  type: IResolveResourceTypeParams;
}

export async function describeCommand(
  params: IDescribeScriptParams
): Promise<void> {
  const type = await resolveResourceType(params.type);
  const resources = await getResources(type);

  if (resources.length === 0) {
    ConsoleInterface.printLine(
      `No resources of type ${type} was found using current context`,
      Type.warn
    );
    return;
  }

  const resource = await selectResource(resources);
  await describeResource(type, resource.name);
}
