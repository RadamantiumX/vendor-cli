import type { PkgMng } from "./types/index";
import { DefaultError } from "./utils/errors";
import type { AnswerArray } from "./types/index";
/**
 * Statements structures Guidance:
 *  --> npm install <package-name> --workspace=<workspace-name> <if is dev-dep "-D" or "--save-dev">
 *  --> pnpm add <if is dev-dep "-D"> <package-name> <flag: filter workspace>
 *  --> yarn workspace <workspace-name> add <if is dev-dep "-D"> <package-name>
 */

function groupingConfigNormalized(
  answersWs: AnswerArray[],
  answersDev: AnswerArray[] | [],
) {
  const slicedPkgArr: string[] = [];
  const groupingByWs = Object.groupBy(
    [...answersWs],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (answ: any) => answ[1],
  );
  const groupingByOpts = Object.groupBy(
    [...answersDev],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (answ: any) => answ[1],
  );
  const normalized = { ws: { ...groupingByWs }, opts: { ...groupingByOpts } };

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
}

export async function cliStatementBuilder(
  rawWsAnswersArr: AnswerArray[],
  rawDevAnswersArr: AnswerArray[] | [],
  pkgMng: PkgMng,
) {
  const stm: string[] = [];
  const { normalized, slicedPkgArr } = groupingConfigNormalized(
    rawWsAnswersArr,
    rawDevAnswersArr,
  );

  if (!normalized || !slicedPkgArr) {
    throw new DefaultError();
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
            )}${normalized.opts[pkg] ? normalized.opts[pkg].flat().join(" ") : ""}`,
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

  return stm.join(" & ");
}
