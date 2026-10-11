import _ from 'lodash';

const delimiterRegex = /\s{2,100}/g;
const splitDelimiter = '[________]';

function getRowColumns(row: string): string[] {
  return row.replaceAll(delimiterRegex, splitDelimiter).split(splitDelimiter);
}

function hasPortColumn(dataColumns: string[]): boolean {
  return dataColumns.length === 7;
}

export type IContainerRow = {
  containerId: string;
  names: string;
  image: string;
  command: string;
  created: string;
  status: string;
  ports: string | undefined;
};

export const parseContainerRows = (processRows: string[]): IContainerRow[] => {
  if (
    !Array.isArray(processRows) ||
    processRows.length <= 1 ||
    processRows[1].length === 0
  ) {
    return [];
  }

  const columnRow = processRows[0];
  const dataRows = processRows.slice(1);

  const columnNames = getRowColumns(columnRow).map((column) =>
    _.camelCase(column),
  );

  const processes: IContainerRow[] = [];

  for (const row of dataRows) {
    if (row.length === 0) {
      continue;
    }

    const dataColumns = getRowColumns(row);
    let currentDataColumn = 0;

    const process = columnNames.reduce(
      (process: Record<string, string | undefined>, columnName: string) => {
        if (columnName === 'ports' && !hasPortColumn(dataColumns)) {
          process[columnName] = null;
          return process;
        }

        const columnData = dataColumns[currentDataColumn];

        process[columnName] = columnData;
        currentDataColumn++;

        return process;
      },
      {},
    );

    processes.push(process as unknown as IContainerRow);
  }

  return processes;
};
