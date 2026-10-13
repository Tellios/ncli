import { selectItem } from '../../common/index.ts';
import type { PackageJson } from '../types.ts';
import { getWorkspacePaths, type Workspace } from './get-workspace-paths.ts';

export const selectWorkspace = async (
  workingDirectory: string,
  packageJson: PackageJson,
  lastSelectedWorkspaceRelativePath: string | undefined
): Promise<Workspace> => {
  const workspaces = await getWorkspacePaths(workingDirectory, packageJson);

  if (workspaces.length === 0) {
    throw new Error('Workspaces are not configured for this project');
  }

  return workspaces[
    await selectItem(
      workspaces.map((p) => p.relativePath),
      'Select workspace',
      lastSelectedWorkspaceRelativePath
    )
  ];
};
