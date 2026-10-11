import Table from 'cli-table3';
import chalk from 'chalk';

export const Type = {
  log: 1,
  warn: 2,
  error: 3,
};

export class ConsoleInterface {
  public static printLine(line: string, type = Type.log): void {
    switch (type) {
      case Type.log: {
        console.log(line);
        break;
      }

      case Type.warn: {
        console.warn(line);
        break;
      }

      case Type.error: {
        console.error(line);
        break;
      }

      default: {
        throw new Error(`Invalid log type: ${type}`);
      }
    }
  }

  public static printLines(lines: string[], type = Type.log): void {
    for (const line of lines) {
      this.printLine(line, type);
    }
  }

  public static printTable(columns: string[], rows: string[][]): void {
    columns = columns.map((column) => chalk.cyan(column));

    const table = new Table({
      head: columns,
    });

    (table as any).push(...rows);

    console.log(table.toString());
  }

  public static printVerticalTable(rows: Array<Record<string, any>>): void {
    const table = new Table();

    for (const row of rows) {
      (table as any).push(row);
    }

    console.log(table.toString());
  }
}
