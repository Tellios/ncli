import { camelCase } from 'lodash';

const delimiterRegex = /\s{2,100}/g;
const splitDelimiter = '[________]';

function getRowColumns(row: string): string[] {
  return row.replace(delimiterRegex, splitDelimiter).split(splitDelimiter);
}

export const parseCliTable = <T>(processRows: string[]): T[] => {
  if (
    !Array.isArray(processRows) ||
    processRows.length <= 1 ||
    processRows[1].length === 0
  ) {
    return [];
  }

  const columnRow = processRows[0];
  const dataRows = processRows.slice(1);

  const columnNames = getRowColumns(columnRow).map(camelCase);

  const parsedRows: T[] = [];

  dataRows.forEach((row) => {
    if (row.length === 0) {
      return;
    }

    const dataColumns = getRowColumns(row);

    const parsedRow: Record<string, string | undefined> = columnNames.reduce(
      (
        process: Record<string, string | undefined>,
        columnName: string,
        columnIndex: number
      ) => {
        if (dataColumns.length < columnIndex) {
          process[columnName] = undefined;
          return process;
        }

        const columnData = dataColumns[columnIndex];
        process[columnName] = columnData;

        return process;
      },
      {}
    );

    parsedRows.push(parsedRow as unknown as T);
  });

  return parsedRows;
};
