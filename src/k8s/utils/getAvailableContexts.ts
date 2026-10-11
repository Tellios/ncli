import jsYaml from 'js-yaml';
import {getCmdResult} from '../../common/index.ts';
import {type IContext} from './IContext.ts';

export const getAvailableContexts = async (): Promise<IContext[]> => {
  const yaml = await getCmdResult('kubectl', ['config', 'view']);
  const config: any = jsYaml.safeLoad(yaml);

  return config.contexts ?? [];
};
