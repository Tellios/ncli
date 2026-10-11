import {parseCliTable} from './parseCliTable.ts';

describe('parseCliTable', () => {
  it('should use columns as property names', () => {
    const rows = ['SOME      HEADERS   LASTHEADER', 'foo       bar       test'];

    const result = parseCliTable(rows);

    expect(result).toEqual([
      {
        some: 'foo',
        headers: 'bar',
        lastheader: 'test',
      },
    ]);
  });

  it('should handle multi word columns', () => {
    const rows = [
      'SPACES IN HEADER      DASH-HEADER',
      'foo                   bar',
    ];

    const result = parseCliTable(rows);

    expect(result).toEqual([
      {
        spacesInHeader: 'foo',
        dashHeader: 'bar',
      },
    ]);
  });

  it('should return empty array if no data rows are available', () => {
    const rows = ['one  two'];

    const result = parseCliTable(rows);

    expect(result).toEqual([]);
  });

  it('should return empty array if no rows are available', () => {
    const rows: string[] = [];

    const result = parseCliTable(rows);

    expect(result).toEqual([]);
  });

  it('should handle multiple rows', () => {
    const rows = [
      'one     two',
      'foo     bar',
      '2020    0225',
      '0777    index.js',
    ];

    const result = parseCliTable(rows);

    expect(result).toEqual([
      {
        one: 'foo',
        two: 'bar',
      },
      {
        one: '2020',
        two: '0225',
      },
      {
        one: '0777',
        two: 'index.js',
      },
    ]);
  });

  it('should assign undefined to columns with no values', () => {
    const rows = [
      'headOne  headTwo  headThree  headFour',
      '1        2',
      '1        2        3',
      '1        2        3          4',
    ];

    const result = parseCliTable(rows);

    expect(result).toEqual([
      {
        headOne: '1',
        headTwo: '2',
        headThree: undefined,
        headFour: undefined,
      },
      {
        headOne: '1',
        headTwo: '2',
        headThree: '3',
        headFour: undefined,
      },
      {
        headOne: '1',
        headTwo: '2',
        headThree: '3',
        headFour: '4',
      },
    ]);
  });
});
