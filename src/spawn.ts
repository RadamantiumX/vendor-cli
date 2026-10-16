import "dotenv/config";
import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { SubProcessError } from "./utils/errors";
import { colorConsole } from "./utils/colors";
import { TURBO_LIST } from "./utils/constants";

/**
 * Return a Stream Promise for run npm installation process. This avoid any error on execution,
 * and desn't need blocks the main process.
 * @param {string} command the full command to install any package with the current package manager
 * @returns {Promise<unknown>} Buffer of installation progress
 */
export function asyncExeComand(command: string): Promise<unknown> {
  console.log(command);
  return new Promise((resolve, reject) => {
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

    cmd.on("error", (err) => {
      reject(colorConsole(`The processis fail on: ${err}`, "error"));
    });
  });
}

interface CliChildStreamAndChunks {
  cliProcess: ChildProcessWithoutNullStreams;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chunksStreamArr: any[];
}

/**
 * Turbo Cli trigger --> LIST all exists WS and paths
 * @returns {CliChildStreamAndChunks} The Stream child process & array of chunks stream from the output
 */
export function turboCliProcess(): CliChildStreamAndChunks {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chunksStreamArr: any[] = [];

    const cliProcess = spawn(TURBO_LIST, {
      stdio: ["overlapped", "pipe", "pipe"],
      shell: true,
    });
    cliProcess.stdout.on("data", (chunks) => {
      chunksStreamArr.push(chunks);
    });

    cliProcess.stderr.on("error", (error) => {
      colorConsole(`This error appear on process: ${error}`, "error");
    });

    return { cliProcess, chunksStreamArr };
  } catch (error) {
    throw new SubProcessError(`Error on child process: ${error}`);
  }
}
