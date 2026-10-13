import { ConsoleInterface } from '../../common/index.ts';
import {
  getResources,
  resolveResourceType,
  type ResolveResourceTypeParameters
} from '../utils/index.ts';

export type ListScriptParameters = {
  type: ResolveResourceTypeParameters;
};

export async function listCommand(
  parameters: ListScriptParameters
): Promise<void> {
  const type = await resolveResourceType(parameters.type);
  const resources = await getResources(type);

  if (resources.length === 0) {
    ConsoleInterface.printLine(
      `No ${type} resources available in current context`
    );
    return;
  }

  const columns = Object.keys(resources[0]);
  const rows = resources.map((r) => Object.values(r).map((value) => value));

  ConsoleInterface.printTable(columns, rows);
}
