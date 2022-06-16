import { selectItem } from '../../common';
import { getWorkspacePaths, Workspace } from './getWorkspacePaths';

export const selectWorkspace = async (
  workingDirectory: string,
  packageJson: NcliNode.IPackageJson,
  lastSelectedWorkspaceRelativePath: string | undefined
): Promise<Workspace> => {
  if (packageJson.workspaces && packageJson.workspaces.length > 0) {
    const workspaces = await getWorkspacePaths(workingDirectory, packageJson);

    const workspace =
      workspaces[
        await selectItem(
          workspaces.map((p) => p.relativePath),
          'Select workspace',
          lastSelectedWorkspaceRelativePath
        )
      ];

    return workspace;
  } else {
    throw new Error('Workspaces are not configured for this project');
  }
};
