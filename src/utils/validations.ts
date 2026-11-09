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
