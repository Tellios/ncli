import { selectItem } from '../../common/index.ts';
import { type ResourceType } from './resource-type.ts';

export type ResolveResourceTypeParameters = Record<
  ResourceType,
  boolean | undefined
>;

const autoResolveableTypes: Record<ResourceType, boolean> = {
  deployment: true,
  pod: true,
  service: true,
  ingress: true
};

const selectableTypes = Object.entries(autoResolveableTypes)
  .filter(([_, value]) => value)
  .map(([key]) => key) as ResourceType[];

const getTypeToUse = (
  parameters: ResolveResourceTypeParameters
): ResourceType | undefined =>
  Object.entries(parameters)
    .filter(([_, value]) => value === true)
    .map(([key]) => key)[0] as ResourceType | undefined;

export async function resolveResourceType(
  parameters: ResolveResourceTypeParameters
): Promise<ResourceType> {
  const type = getTypeToUse(parameters);

  if (type === undefined) {
    const index = await selectItem(selectableTypes, 'Select resource type');
    return selectableTypes[index];
  }

  return type;
}
