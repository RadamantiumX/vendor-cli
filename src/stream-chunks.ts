import { SubProcessError } from "./utils/errors";
import type { Choices, PkgMng } from "./types/index";

// The binary data provided must be concatenated and decoded
// Then, can be parsed.
export const decodingBuffer = (
  streamChunksArr: Uint8Array<ArrayBufferLike>[],
) => {
  const fullBufferMerged = Buffer.concat(streamChunksArr);
  const decodedBuffer = new TextDecoder("utf-8").decode(fullBufferMerged);
  return decodedBuffer;
};

/**
 * The streams chunks must be handle (concatenated and decoded) to be able for parsing and fill the inquirer/prompt ARRAY CHOICES
 * @param streamChunksArr
 * @returns handle & splited the ARRAY CHOICES & package manager from the raw streams chunks
 */
export async function handleStreamChunks(
  streamChunksArr: Uint8Array<ArrayBufferLike>[],
) {
  const wsAvailable = [] as Choices[]; // Input/prompts array choices

  // Chunks treatment
  const decodedBufferFromStream = decodingBuffer(streamChunksArr);

  if (!decodedBufferFromStream) {
    throw new SubProcessError("Error on decoded data");
  }

  // After parse we are able to create the format of input/prompt choices
  const parsedObj = JSON.parse(decodedBufferFromStream);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parsedObj.packages.items.map((item: any) => {
    wsAvailable.push({
      name: `${item.name} | ${item.path}`,
      value: [item.name],
    });
  });

  // The default output is "pnpm9", can be transformed to "pnpm". Just this value, the other are OK
  const packageManager: PkgMng = parsedObj.packageManager.includes("pnpm9")
    ? "pnpm"
    : parsedObj.packageManager;

  return { wsAvailable, packageManager };
}
