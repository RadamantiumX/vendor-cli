import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { SubProcessError } from "./utils/errors";
import { colorConsole } from "./console/colors";
import { TURBO_LIST } from "./utils/constants";
import { spawnExeSchema } from "./utils/validations";

// TODO: take off the console log error and use only the throw.
/**
 * Return a Stream Promise for run npm installation process. This avoid any error on execution,
 * and desn't need blocks the main process.
 * @param {string} command the full command to install any package with the current package manager
 * @returns {Promise<unknown>} Buffer of installation progress
 */
export function asyncExeComand(command: string): Promise<unknown> {
  const isValidStmt = spawnExeSchema.safeParse(command);

  return new Promise((resolve, reject) => {
    if (!isValidStmt.success) {
      reject(new SubProcessError("invalid statement"));
    }
    const cmd = spawn(command, {
      shell: true,
      cwd: process.cwd(),
      stdio: "inherit",
    });
    cmd.on("close", (code) => {
      if (code !== 0) {
        reject(new SubProcessError(`The process exit on code ${code}`));
      } else {
        resolve(colorConsole("Success on install dependencies", "success"));
      }
    });

    cmd.on("error", (error) => {
      reject(new SubProcessError(`Error on child process: ${error}`));
    });
  });
}

type CliChildStreamAndChunks<T> = {
  cliProcess: ChildProcessWithoutNullStreams;
  chunksStreamArr: T[];
};

/**
 * Turbo Cli trigger --> LIST all exists WS and paths
 * @returns {CliChildStreamAndChunks} The Stream child process & array of chunks stream from the output
 */
export function turboCliProcess(): CliChildStreamAndChunks<
  Uint8Array<ArrayBufferLike>
> {
  const chunksStreamArr: Uint8Array<ArrayBufferLike>[] = [];

  const cliProcess = spawn(TURBO_LIST, {
    stdio: ["overlapped", "pipe", "pipe"],
    shell: true,
  });
  cliProcess.stdout.on("data", (chunks) => {
    chunksStreamArr.push(chunks);
  });

  cliProcess.stderr.on("error", (error) => {
    new SubProcessError(`Error on child process: ${error}`);
  });

  return { cliProcess, chunksStreamArr };
}
