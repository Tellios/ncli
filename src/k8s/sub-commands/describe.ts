import { ConsoleInterface, Type } from '../../common/index.ts';
import {
  selectResource,
  getResources,
  describeResource,
  resolveResourceType,
  type ResolveResourceTypeParameters
} from '../utils/index.ts';

export type DescribeScriptParameters = {
  type: ResolveResourceTypeParameters;
};

export async function describeCommand(
  parameters: DescribeScriptParameters
): Promise<void> {
  const type = await resolveResourceType(parameters.type);
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
