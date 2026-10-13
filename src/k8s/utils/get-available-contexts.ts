import { load } from 'js-yaml';
import { getCmdResult } from '../../common/index.ts';
import { type Context } from './context.interface.ts';

export const getAvailableContexts = async (): Promise<Context[]> => {
  const yaml = await getCmdResult('kubectl', ['config', 'view']);
  const config: any = load(yaml);

  return config.contexts ?? [];
};
