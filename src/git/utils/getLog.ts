import { getCmdResult } from '../../common/console';

export interface LogEntry {
  shortId: string;
  message: string;
  date: string;
}

export const getLog = async (
  workingDirectory: string,
  maxCommitsToInclude: number
): Promise<LogEntry[]> => {
  const result = await getCmdResult(
    'git',
    ['log', `-${maxCommitsToInclude}`, '--pretty=reference'],
    workingDirectory
  );

  /**
   * Sample output:
   * 099159c (Message of commit, 2024-06-04)
   * 9dae5b8 (Another commits message, 2024-06-03)
   */

  return result
    .split('\n')
    .map((line): LogEntry => {
      const [shortId, message, date] =
        line.match(/^([0-9a-f]+) \((.+), (.+)\)$/)?.slice(1) ?? [];

      return {
        shortId,
        message,
        date
      };
    })
    .filter((entry) => entry.shortId && entry.message && entry.date);
};
