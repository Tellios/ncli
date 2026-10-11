import { selectItem } from '../../common';
import { getWorkspacePaths, Workspace } from './getWorkspacePaths';

export const selectWorkspace = async (
  workingDirectory: string,
  packageJson: NcliNode.IPackageJson,
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
