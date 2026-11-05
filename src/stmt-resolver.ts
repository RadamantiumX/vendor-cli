import type { PkgMng } from "./types/index";
import { DefaultError } from "./utils/errors";
import type { AnswerArray, AnswKey } from "./types/index";

export type ObjectPartial = Partial<Record<string, string[][]>>;
export type AssembledStm<T> = T;

// Grouping the Answers by the index #1, and used it for key in each object
// This must be the package input at the inquirer questions
export const groupingObjectKeys = (answObj: AnswerArray[][]) => {
  const grpObj = Object.groupBy(
    [...answObj], // Spread the grouped object
    (answ: AnswKey<string[]>) => answ[1] as string, // answ[1] => object key
  );
  return grpObj;
};

// Applying normalization the objects to spread them into "ws" (workspace) and "opts" (flag options) keys
// Iterating this object to get the key and pushed in the array,
// popping the last key of this object (package name)
export const loopingNormalizedObject = (
  groupingByWs: ObjectPartial,
  groupingByOpts: ObjectPartial,
) => {
  const slicedArr: string[] = [];

  const normalized = {
    ws: { ...groupingByWs },
    opts: { ...groupingByOpts },
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [key, value] of Object.entries(normalized)) {
    for (const [keyNested, valueNested] of Object.entries(value)) {
      if (!slicedArr.includes(keyNested)) {
        slicedArr.push(keyNested);
      }
      valueNested?.map((item: string[]) => {
        item.pop();
      });
    }
  }
  return { normalized, slicedArr };
};

/**
 * Group the INQUIRER PROMPTS array answers by the package to be used in the statement
 * @param answersWs Workspaces selected for each package/s
 * @param answersOpts Flag options selected for each package/s
 * @returns the normalized object and the splited package/s array
 */
export function groupingConfigNormalized(
  answersWs: AnswerArray[][],
  answersOpts: AnswerArray[][] | [],
) {
  const groupingByWs = groupingObjectKeys(answersWs);
  const groupingByOpts = groupingObjectKeys(answersOpts);

  return loopingNormalizedObject(groupingByWs, groupingByOpts);
}

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

  // todo: adding zod validation here
  const { normalized, slicedArr } = groupingConfigNormalized(
    rawWsAnswersArr,
    rawOptsAnswersArr,
  );

  if (!normalized || !slicedArr) {
    throw new DefaultError("Failed on cli statement");
  }
  slicedArr.map((pkg) => {
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
