import "dotenv/config";
import { turboCliProcess, asyncExeComand } from "./spawn";
import { colorConsole } from "./utils/colors";
import { handleStreamChunks } from "./stream-chunks";
import { cliStatementBuilder } from "./stmt-resolver";
import signature from "./utils/ansii-art";
import { checkbox, input, select, Separator } from "@inquirer/prompts";
import customConfirm from "./lib/custom-inquirer";
import {
  isValidAmountOfChoices,
  combineArrayChoices,
  initialChoices,
  filterOptionsChoices,
} from "./inq-config";
import { PromptError, DefaultError, SubProcessError } from "./utils/errors";
import { PROMPT_MESSAGES } from "./utils/constants";

import type {
  AnswerArray,
  CheckBoxAnswer,
  PkgMng,
  Choices,
} from "./types/index";

export type UnknowError<T> = T | unknown;
// Using the main child event process
const { cliProcess, chunksStreamArr } = turboCliProcess();

// The listerner only takes the values returned from the cli turbo ls
cliProcess?.on("close", vendorCli);

const installerProcedure = async (ws: Choices[], packageManager: PkgMng) => {
  const inputPkg = await input({
    message: PROMPT_MESSAGES.INPUT_PKG,
  });
  const pkgChoices = await combineArrayChoices(inputPkg.split(" "), ws);
  const devChoices = await combineArrayChoices(
    inputPkg.split(" "),
    filterOptionsChoices(packageManager),
  );

  if (!pkgChoices || !devChoices) {
    throw new PromptError();
  }

  const workspaceQuiz = await checkbox({
    message: PROMPT_MESSAGES.WORKSPACE_QUIZ,
    choices: pkgChoices as (string | Separator)[],
    loop: false,
    validate: (answers) =>
      isValidAmountOfChoices(answers as CheckBoxAnswer[], inputPkg.split(" ")),
    theme: {
      style: {
        renderSelectedChoices: () => {
          return "Done";
        },
      },
    },
  });
  // TODO: if you don't pick any choice... the array is empty []
  const optsQuiz = await checkbox({
    message: PROMPT_MESSAGES.OPTS_QUIZ,
    choices: devChoices as (string | Separator)[],
    loop: false,
  });

  const confirmQuiz = await customConfirm({
    message: PROMPT_MESSAGES.CONFIRM_QUIZ,
  });

  if (!confirmQuiz) {
    colorConsole("Installation canceled", "exit");
    return;
  }

  const stmtBuild = await cliStatementBuilder(
    workspaceQuiz as AnswerArray[][],
    optsQuiz as AnswerArray[][],
    packageManager,
  );

  // The command must be ready and assembled
  if (!stmtBuild) {
    throw new DefaultError("The current statement is malformed.");
  }

  // Runs the command without blocks the main process
  await asyncExeComand(stmtBuild)
    .then(() => {
      colorConsole(`Press ENTER to exit`, "success");
    })
    .catch((e: UnknowError<string>) => {
      colorConsole(`Failed on ${e}`, "error");
    });

  // Taken any error on Spawn process
  process.on("uncaughtException", (err) => {
    console.error("Uncaught async error:", err);
    process.exit(1);
  });

  return;
};

// TODO: Only test

/**
 * TODO: listing dependencies on workspaces
 * npm: npm ls --workspaces --> All workspaces ||  npm ls --workspace=<name of workspace> --> Single workspace
 * pnpm: pnpm list -r --> All workspace || pnpm --filter <nombre-del-paquete> list --> Single
 * yarn: yarn workspaces list --> All Workspaces || yarn workspaces list --verbose --json --> Crossing || yarn info <nombre-del-paquete> --> Single package
 */
const listingProcedure = () => {
  colorConsole("Here is the listing...", "default");
  return;
};

type StreamExitCode<T> = T | unknown;

/**
 * This callback will run when the listener receive the "data" event, another child event is triggered
 * @param {StreamExitCode<number>} code Comming from the "stdout" of the main process to adding on choices
 * @returns {Promise<void>}
 */
export async function vendorCli(code: StreamExitCode<number>): Promise<void> {
  try {
    if (code !== 0) {
      throw new SubProcessError();
    }
    await signature();

    const { wsAvailable, packageManager } =
      await handleStreamChunks(chunksStreamArr);
    if (!wsAvailable || !packageManager) {
      throw new DefaultError();
    }
    const initialSelect = await select({
      message: PROMPT_MESSAGES.INITIAL_SELECT,
      choices: initialChoices,
    });

    if (initialSelect === "install") {
      await installerProcedure(wsAvailable, packageManager);
    } else if (initialSelect === "list") {
      listingProcedure();
    } else {
      colorConsole("Exit from the assistant... Bye bye👋", "exit");
      return;
    }
  } catch (error: UnknowError<string>) {
    if (
      error?.toString().includes("ExitPromptError") ||
      error?.toString().includes("AbortError")
    ) {
      colorConsole("Bye bye 👋", "exit");
      return;
    }
    colorConsole(`${error}`, "error");
    return;
  }
}
