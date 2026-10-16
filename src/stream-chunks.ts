import { SubProcessError } from "./utils/errors";
import type { Choices } from "./types/index";

/**
 * The streams chunks must be handle (concatenated and decoded) to be able for parsing and fill the inquirer/prompt ARRAY CHOICES
 * @param streamChunksArr
 * @returns handle & splited the ARRAY CHOICES & package manager from the raw streams chunks
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handleStreamChunks(streamChunksArr: any[]) {
  const wsAvailable = [] as Choices[]; // Input/prompts array choices

  // Chunks treatment
  const fullBufferMerged = Buffer.concat(streamChunksArr);
  const decodedBuffer = new TextDecoder("utf-8").decode(fullBufferMerged);
  if (!decodedBuffer) {
    throw new SubProcessError();
  }

  // After parse we are able to create the format of input/prompt choices
  const parsedObj = JSON.parse(decodedBuffer);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parsedObj.packages.items.map((item: any) => {
    wsAvailable.push({
      name: `${item.name} | ${item.path}`,
      value: [item.name],
    });
  });

  type PkgMng = "npm" | "pnpm" | "yarn"; // TODO: fix this reusing

  // The default output is "pnpm9", can be transformed to "pnpm". Just this value, the other are OK
  const packageManager: PkgMng = parsedObj.packageManager.includes("pnpm9")
    ? "pnpm"
    : parsedObj.packageManager;

  return { wsAvailable, packageManager };
}
