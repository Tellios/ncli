import { ConsoleInterface, selectItem, Type } from '../../common/index.ts';
import { getAvailableContexts, useContext } from '../utils/index.ts';

export async function contextCommand(): Promise<void> {
  const contexts = await getAvailableContexts();
  const contextNames = contexts.map((c) => c.name);

  if (contexts.length === 0) {
    ConsoleInterface.printLine(
      'No contexts available, add some contexts to the kubectl config to use this command',
      Type.warn
    );
    return;
  }

  const index = await selectItem(contextNames, 'Select context to use');
  const selectedContext = contexts[index];

  await useContext(selectedContext.name);
}
