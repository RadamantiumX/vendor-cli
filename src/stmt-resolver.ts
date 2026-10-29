import type { PkgMng } from "./types/index";
import { DefaultError } from "./utils/errors";
import type { AnswerArray, AnswKey, ObjNormalized } from "./types/index";
/**
 * Statements structures Guidance:
 *  --> npm install <package-name> --workspace=<workspace-name> <if is dev-dep "-D" or "--save-dev">
 *  --> pnpm add <if is dev-dep "-D"> <package-name> <flag: filter workspace>
 *  --> yarn workspace <workspace-name> add <if is dev-dep "-D"> <package-name>
 */

const groupingKeys = (answObj: AnswerArray[][]) => {
  const grpObj = Object.groupBy(
    [...answObj],
    (answ: AnswKey<string[]>) => answ[1] as string,
  );
  return grpObj;
};

/**
 * Group the INQUIRER PROMPTS array answers by the package to be used in the statement
 * @param answersWs Workspaces selected for each package/s
 * @param answersOpts Flag options selected for each package/s
 * @returns the normalized object and the splited package/s array
 */
export const groupingConfigNormalized = (
  answersWs: AnswerArray[][],
  answersOpts: AnswerArray[][] | [],
) => {
  const slicedPkgArr: string[] = [];
  const groupingByWs = groupingKeys(answersWs);
  const groupingByOpts = groupingKeys(answersOpts);

  const normalized: ObjNormalized<string[]> = {
    ws: { ...groupingByWs },
    opts: { ...groupingByOpts },
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [key, value] of Object.entries(normalized)) {
    for (const [keyNested, valueNested] of Object.entries(value)) {
      if (!slicedPkgArr.includes(keyNested)) {
        slicedPkgArr.push(keyNested);
      }
      valueNested?.map((item) => {
        item.pop();
      });
    }
  }

  return { normalized, slicedPkgArr };
};

type AssembledStm<T> = T;
/**
 * Assembled cli statement to be used in spawn node child process. It's conditional by the package manager.
 * @param rawWsAnswersArr Checkbox returned answers from Workspaces
 * @param rawOptsAnswersArr Checkbox returned answers from Options flags
 * @param pkgMng Current package manager
 * @returns the full statement converted to string and joined.
 */
export async function cliStatementBuilder(
  rawWsAnswersArr: AnswerArray[][],
  rawOptsAnswersArr: AnswerArray[][] | [],
  pkgMng: PkgMng,
) {
  const stm: AssembledStm<string[]> = [];
  const { normalized, slicedPkgArr } = groupingConfigNormalized(
    rawWsAnswersArr,
    rawOptsAnswersArr,
  );

  if (!normalized || !slicedPkgArr) {
    throw new DefaultError("Failed on cli statement");
  }
  slicedPkgArr.map((pkg) => {
    switch (pkgMng) {
      case "npm":
        stm.push(
          `npm install ${pkg.toString()} ${normalized?.ws[pkg]
            ?.flat()
            .map((w) => `-w ${w}`)
            .join(
              " ",
            )} ${normalized.opts[pkg] ? normalized.opts[pkg].flat().join(" ") : ""}`,
        );
        break;
      case "pnpm":
        stm.push(
          `pnpm add${normalized.opts[pkg] ? normalized.opts[pkg].flat().join(" ") : ""} ${pkg.toString()} ${normalized?.ws[
            pkg
          ]
            ?.flat()
            .map((w) => `--filter ${w}`)
            .join(" ")}`,
        );
        break;
      case "yarn":
        stm.push(
          `yarn ${normalized?.ws[pkg] && normalized?.ws[pkg]?.flat().length > 1 ? `workspaces foreach -A --include {${normalized?.ws[pkg]?.flat().join(",")}}` : `workspace ${normalized?.ws[pkg]?.flat()}`} add${normalized.opts[pkg] ? normalized.opts[pkg].flat().join(" ") : ""} ${pkg.toString()}`,
        );
        break;
    }
  });

  return stm.join(" & ") as AssembledStm<string>;
}
