import {getCmdResult} from '../../common/index.ts';

export type IGitStatus = {
  hasChanges: boolean;
  newFiles: string[];
  changedFiles: string[];
  deletedFiles: string[];
};

function getChanges(
  statuses: string[],
  filterFunc: (change: string) => boolean,
): string[] {
  return statuses
    .filter((status) => filterFunc(status.slice(0, 2)))
    .map((status) => status.slice(3));
}

function parseStatuses(statusData: string): IGitStatus {
  const statusLines = statusData.split('\n');

  return {
    hasChanges: statusLines.length > 0,
    newFiles: getChanges(
      statusLines,
      (modifiers) => modifiers.includes('?') || modifiers.includes('A'),
    ),
    changedFiles: getChanges(statusLines, (modifiers) =>
      modifiers.includes('M'),
    ),
    deletedFiles: getChanges(statusLines, (modifiers) =>
      modifiers.includes('D'),
    ),
  };
}

export async function getStatus(repositoryPath: string): Promise<IGitStatus> {
  return getCmdResult('git', ['status', '-s'], repositoryPath).then(
    parseStatuses,
  );
}
