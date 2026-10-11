import yargs from 'yargs';

export const yargsWrapper = (
  useStrict = true,
  // Yargs builder types won't work properly unless we use {}
  // eslint-disable-next-line @typescript-eslint/ban-types
): yargs.Argv => {
  let wrapper = yargs.help();

  if (useStrict) {
    wrapper = yargs.strict();
  }

  return wrapper;
};
