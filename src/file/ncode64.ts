import { createReadStream, createWriteStream } from 'fs-extra';
import { yargsWrapper, commandBase } from '../common';

// https://github.com/nodejs/node/blob/master/lib/buffer.js
const supportedEncodings: BufferEncoding[] = [
  'utf8',
  'utf-8',
  'base64',
  'ucs2',
  'ucs-2',
  'hex',
  'ascii',
  'latin1',
  'base64',
  'utf16le'
];

const yargs = yargsWrapper()
  .option('from', {
    desc: 'Encoding input is stored in',
    choices: supportedEncodings,
    default: 'utf8'
  })
  .option('to', {
    desc: 'Encoding used for output',
    choices: supportedEncodings,
    demandOption: true
  })
  .option('input', {
    desc: 'File to read data to encode from',
    demandOption: true,
    string: true
  })
  .option('inputContainer', {
    desc: 'If the encoding of the input file is different from the data you can define the file encoding here',
    choices: supportedEncodings
  })
  .option('output', {
    desc: 'File to output data to',
    demandOption: true,
    string: true
  })
  .option('outputContainer', {
    desc: 'If the encoding of the output file should be different from the data you can define the file encoding here',
    choices: supportedEncodings
  });

const args = yargs.argv;

commandBase(async (): Promise<void> => {
  const readStream = createReadStream(args.input, {
    encoding: args.inputContainer ?? (args.from as BufferEncoding)
  });
  const chunks: string[] = [];

  for await (const chunk of readStream) {
    chunks.push(chunk);
  }

  const buffer = Buffer.from(
    chunks.join(''),
    args.inputContainer ? (args.from as BufferEncoding) : undefined
  );

  const writeStream = args.outputContainer
    ? createWriteStream(args.output, { encoding: args.outputContainer })
    : createWriteStream(args.output, { encoding: args.to });
  writeStream.write(
    buffer.toString(args.outputContainer ? args.to : undefined)
  );
});
