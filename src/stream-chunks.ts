import { ZodErrorIssue } from "./utils/errors";
import { turboCliWsSchema } from "./utils/validations";
import type { Choices, PkgMng, ParsedCliTurboMetaData } from "./types/index";

// The binary data provided must be concatenated and decoded
// Then, can be parsed.
export const bufferDecodingToObjectParsed = (
  streamChunksArr: Uint8Array<ArrayBufferLike>[],
): ParsedCliTurboMetaData<string> => {
  const fullBufferMerged = Buffer.concat(streamChunksArr);
  const decodedBuffer = new TextDecoder("utf-8").decode(fullBufferMerged);
  const parsedObj = JSON.parse(decodedBuffer);
  return parsedObj;
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
  const decodedParsed = bufferDecodingToObjectParsed(streamChunksArr);
  const isValidDecoded = turboCliWsSchema.safeParse(decodedParsed);

  if (!isValidDecoded.success) {
    throw new ZodErrorIssue("Invalid format");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  decodedParsed.packages.items.map((item: any) => {
    wsAvailable.push({
      name: `${item.name} | ${item.path}`,
      value: [item.name],
    });
  });

  // The default output is "pnpm9", can be transformed to "pnpm". Just this value, the other are OK
  const packageManager: PkgMng = decodedParsed.packageManager.includes("pnpm9")
    ? "pnpm"
    : decodedParsed.packageManager.includes("npm")
      ? "npm"
      : "yarn";

  return { wsAvailable, packageManager };
}
