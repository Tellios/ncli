import { camelCase } from 'es-toolkit';

const delimiterRegex = /\s{2,100}/gv;
const splitDelimiter = '[________]';

function getRowColumns(row: string): string[] {
  // eslint-disable-next-line unicorn/no-unsafe-string-replacement
  return row.replaceAll(delimiterRegex, splitDelimiter).split(splitDelimiter);
}

function hasPortColumn(dataColumns: string[]): boolean {
  return dataColumns.length === 7;
}

export type ContainerRow = {
  containerId: string;
  names: string;
  image: string;
  command: string;
  created: string;
  status: string;
  ports: string | undefined;
};

export const parseContainerRows = (processRows: string[]): ContainerRow[] => {
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
    camelCase(column)
  );

  const processes: ContainerRow[] = [];

  for (const row of dataRows) {
    if (row.length === 0) {
      continue;
    }

    const dataColumns = getRowColumns(row);
    let currentDataColumn = 0;

    const process = columnNames.reduce(
      (process: Record<string, string | undefined>, columnName: string) => {
        if (columnName === 'ports' && !hasPortColumn(dataColumns)) {
          process[columnName] = undefined;
          return process;
        }

        const columnData = dataColumns[currentDataColumn];

        process[columnName] = columnData;
        currentDataColumn++;

        return process;
      },
      {}
    );

    processes.push(process as unknown as ContainerRow);
  }

  return processes;
};
