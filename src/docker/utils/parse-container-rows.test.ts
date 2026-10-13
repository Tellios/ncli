import { parseContainerRows } from './parse-container-rows.ts';

describe('parse docker containers', () => {
  const processes = [
    'CONTAINER ID        IMAGE                 COMMAND                  CREATED             STATUS                      PORTS               NAMES',
    '15902284efe8        nginx:1.13.1-alpine   "nginx -g \'daemon ..."   33 minutes ago      Up 33 minutes               80/tcp              agitated_leakey',
    'f661f948bb0f        nginx:1.13.1-alpine   "nginx -g \'daemon ..."   33 minutes ago      Up 33 minutes               80/tcp              silly_hypatia',
    '4240de87919a        nginx:1.13.1-alpine   "nginx -g \'daemon ..."   36 minutes ago      Exited (0) 33 minutes ago                       sleepy_hugle',
    ''
  ];

  const onlyColumns = [
    'CONTAINER ID        IMAGE                 COMMAND                  CREATED             STATUS                      PORTS               NAMES'
  ];

  const onlyColumnsAndEmptyRow = [
    'CONTAINER ID        IMAGE                 COMMAND                  CREATED             STATUS                      PORTS               NAMES',
    ''
  ];

  it('can parse container rows', () => {
    const result = parseContainerRows(processes);

    const firstItem = result[0];
    expect(firstItem.containerId).toBe('15902284efe8');
    expect(firstItem.image).toBe('nginx:1.13.1-alpine');
    expect(firstItem.command).toBe('"nginx -g \'daemon ..."');
    expect(firstItem.created).toBe('33 minutes ago');
    expect(firstItem.status).toBe('Up 33 minutes');
    expect(firstItem.ports).toBe('80/tcp');
    expect(firstItem.names).toBe('agitated_leakey');

    const lastItem = result[2];
    expect(lastItem.containerId).toBe('4240de87919a');
    expect(lastItem.image).toBe('nginx:1.13.1-alpine');
    expect(lastItem.command).toBe('"nginx -g \'daemon ..."');
    expect(lastItem.created).toBe('36 minutes ago');
    expect(lastItem.status).toBe('Exited (0) 33 minutes ago');
    expect(lastItem.ports).toBeUndefined();
    expect(lastItem.names).toBe('sleepy_hugle');
  });

  it('can handle empty container list with columns', () => {
    const result = parseContainerRows(onlyColumns);
    expect(result.length).toBe(0);
  });

  it('can handle empty container list with empty row', () => {
    const result = parseContainerRows(onlyColumnsAndEmptyRow);
    expect(result.length).toBe(0);
  });

  it('can handle empty container list', () => {
    const result = parseContainerRows([]);
    expect(result.length).toBe(0);
  });
});
