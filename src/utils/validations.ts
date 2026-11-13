import z from "zod";

// Espacios horizontales (incluye continuaciones de línea con \)
const hSpace = /(?:[ \t]|\\\r?\n)+/.source;
const optHSpace = /(?:[ \t]|\\\r?\n)*/.source;

// 1. Gestor y subcomando
const managerCmd = `(?:npm${hSpace}(?:i|install)|pnpm${hSpace}(?:add|i|install)|yarn${hSpace}add)`;

// 2. Flags (-D, --save-dev, --filter=web)
const flagToken = /(?:-[a-zA-Z]+|--[a-zA-Z0-9-]+(?:=[^\s&\\]+)?)/.source;

// 3. Paquetes (@scope/nombre@version)
const pkgToken =
  /(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*(?:@[^\s&\\]+)?/
    .source;

// 4. Un comando individual válido (exige al menos un paquete antes de && o salto de línea)
const singleInstall = `${managerCmd}(?=[^&\\r\\n]*?(?:[ \\t]|\\\\\\r?\\n)+${pkgToken}(?:[ \\t]|\\\\\\r?\\n|&&|\\r?\\n|$))(?:${hSpace}(?:${flagToken}|${pkgToken}))+`;

// 5. Separador entre comandos: '&&' (con saltos de línea opcionales) o uno/varios saltos de línea
const separator = `(?:${optHSpace}&(?:[ \\t]|\\r?\\n)*|(?:${optHSpace}\\r?\\n)+${optHSpace})`;

// 6. Expresión final completa
const flexibleInstallRegex = new RegExp(
  `^${singleInstall}(?:${separator}${singleInstall})*$`,
);

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

// TODO: define custom validation here
export const spawnExeSchema = z
  .string()
  .trim()
  .regex(flexibleInstallRegex, {
    message: "The current format is not invalid",
  });
