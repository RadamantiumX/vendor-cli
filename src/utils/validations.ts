import z from "zod";

export const turboCliWsSchema = z.object({
  packageManager: z.enum(["npm", "pnpm9", "yarn"], {
    error: (issue) => {
      if (issue.code === "invalid_value") {
        return { message: "Invalid value" };
      }
    },
  }),
  packages: z.strictObject({
    count: z.number({ message: "count key is missing" }),
    items: z
      .array(z.strictObject({ name: z.string(), path: z.string() }))
      .nonempty({ message: "Should have any workspace at least" }),
  }),
});

export const packageSchema = z
  .array(
    z
      .string({ message: "Invalid entry" })
      .min(1, { message: "The name of the package is no valid" })
      .max(214, { message: "The name of the package is no valid" }),
  )
  .nonempty({ message: "The contain is empty" });

/**
 * Normalized:
 * 
 *
 const normalized: {
  ws: {
    [x: string]: string[][] | undefined;
       };
  opts: {
    [x: string]: string[][] | undefined;
       };
}
 * 
 */
