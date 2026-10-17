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
  const grouping = Object.groupBy(
    [...answersWs, ...answersDev],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (answ: any) => answ[1],
  );
  const normalized = { ...grouping };

  return normalized;
}

export async function cliStatementBuilder(
  rawWsAnswersArr: AnswerArray[],
  rawDevAnswersArr: AnswerArray[] | [],
  pkgMng: PkgMng,
) {
  const stm = [];
  const normalObj = groupingConfigNormalized(rawWsAnswersArr, rawDevAnswersArr);

  if (!normalObj) {
    throw new DefaultError();
  }
  for (const [pkg, value] of Object.entries(normalObj)) {
    value?.map((val) => {
      val.pop();
    });

    // Take off the last value, the package it's slice from the values
    const wsValue =
      value?.at(-1).includes(true) && value.length > 1
        ? value.slice(0, -1).flat()
        : value?.flat();

    // The dev confirm is sliced (if have one)
    const devValue = value?.at(-1).includes(true);
    // TODO: The correct assembly with the multiples worksapces is:
    // npm : npm install <pkg> -w <ws1> -w <ws2>  {{MULTIPLE}}
    // pnpm : pnpm --filter <ws1> --filter <ws2> add <pkg> {{MULTIPLE}}
    // yarn: Yarn does not have a native single-line command for multi-filters. You must chain them or use foreach:
    //       yarn workspaces foreach -A --include {ws1,ws2} add <pk
    // for more help see: https://www.google.com/search?q=install+packages+in+multiples+workspaces+with+npm%2C+pnpm+and+yarn&sca_esv=243a825551845a46&sxsrf=APpeQnvz1ItFOhs_LaqmoBl1DhPdY8b1hg%3A1791174103056&udm=50&source=chrome.ob&fbs=ABfTbFVyMZGZf1hfvX9uKjN_-G8cxpBkeIeqYwoCbfNVc4vKE3i-m0kEwd4PkTjoNNgRW4WCBAQ57DDter0M81pMcdpqlzHihiCwtv2fui2kCSu95U5GwStMwtNSQKZrp6R0AauG4lDYwYv39w2yzDRMlLDld1r3Nklth4ACrfLqzUBjRZEng1vHq4Y4ViXz29BuUP6DZVFkIQ1CqKXtpgls4lFNQ-uLqQ&vsint=&aep=1&ntc=1&cs=1&sa=X&ved=2ahUKEwiAyZLBg6KXAxVTs5UCHc_bAikQ2J8OegQIERAD&biw=1242&bih=545&dpr=1.1&mstk=AUtExfDFTXTojbuysvtqx9m1GC3xZCtwPGR05yvkvqbNDhvNjv82g3PbrsOKkQlA3cCqvYkWdsLnSoDdjYQxjs0HUZ_gGtsOwjhXy7NSvK1IkKxrZnefee9fjC_E1XfbGOuW593wuPoOzR8_FI5t4_fNkHYTLY5VDMo56UHv0mFcoFkJLCRb9yrdrObCz2siJMIYYShT2OsCNqptWQXS8z-yuRJxWpwPqDR6VqiKVgJYmU7lS0C73JM3258K0JsR1szCXZOI83Y31scFVEl4yhn6vgcsPx2WBukeJWg6e5AzpDavNsbIpP9oRp4HD1QbYkPith-GuHg48kbtqA&csuir=1&mtid=2iXDaq-HOaCu1sQP57uu2Qg
    switch (pkgMng) {
      case "npm":
        stm.push(
          `npm install ${pkg.toString()} ${wsValue?.map((w) => `-w ${w}`).join(" ")}${devValue ? " --save-dev" : ""}`,
        );
        break;
      case "pnpm":
        stm.push(
          `pnpm add${devValue ? " -D" : ""} ${pkg.toString()} ${wsValue?.map((w) => `--filter ${w}`).join(" ")}`,
        );
        break;
      case "yarn":
        stm.push(
          `yarn ${wsValue && wsValue?.length > 1 ? `workspaces foreach -A --include {${wsValue?.join(",")}}` : `workspace ${wsValue}`} add${devValue ? " -D" : ""} ${pkg.toString()}`,
        );
        break;
    }
  }

  return stm.join(" & ");
}
