import z from "zod";
import type { ParsedCliTurboMetaData } from "../types";

/**
 * const toMockedObject = {
  packageManager: "pnpm9",
  packages: {
    count: 2,
    items: [
      { name: "api", path: "loader\\api" },
      { name: "client", path: "loader\\client" },
    ],
  },
};
 */
const schemasObjs = {
  turboCliWs: {
    packageManager: z.enum(["npm", "pnpm9", "yarn"], {
      message: "Only can be work with: NPM, PNPM or YARN",
    }),
    packages: z.strictObject({
      count: z.number({ message: "count key is missing" }),
      items: z
        .array(z.strictObject({ name: z.string(), path: z.string() }))
        .nonempty({ message: "Should have any workspace at least" }),
    }),
  },
};

export function isValidObjectProperties(
  parsedObj: ParsedCliTurboMetaData<string>,
) {
  const strictValidationObj = z.strictObject(schemasObjs.turboCliWs);
  const safeParsing = strictValidationObj.parse(parsedObj);
  return safeParsing;
}
