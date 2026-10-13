const remoteText = 'remotes/';

export const localizeBranchName = (branchName: string): string =>
  branchName.startsWith(remoteText)
    ? // So we can checkout the remote branches and list them properly
      // we remove the "remotes/origin/" part from the name.
      branchName.split('/').slice(2).join('/')
    : branchName;
