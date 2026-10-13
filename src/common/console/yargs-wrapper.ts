import process from 'node:process';
import yargs, { type Argv } from 'yargs';
import { hideBin } from 'yargs/helpers';

export const yargsWrapper = (
  useStrict = true
  // Yargs builder types won't work properly unless we use {}
): Argv => {
  const wrapper = yargs(hideBin(process.argv)).help();

  return useStrict ? wrapper.strict() : wrapper;
};
