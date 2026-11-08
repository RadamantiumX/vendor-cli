import colors from "ansi-colors";
import { ConsoleError } from "../utils/errors";

/**
 * Console Printer in fancy colors, depending of each case
 * @param {string} message Incoming from the parent, short and descriptive
 * @param {State} state Constrain only for 3 options
 * @returns {void}
 */
export type State = "success" | "loading" | "exit" | "error" | "default";
export function colorConsole(message: string, state: State): void {
  try {
    switch (state) {
      case "success":
        console.log(colors.bgGreen(message));
        break;
      case "loading":
        console.log(colors.bgYellow(message));
        break;
      case "exit":
        console.clear();
        console.log(colors.bgBlue(message));
        break;
      case "error":
        console.log(colors.bgRed(message));
        break;
      default:
        console.log(colors.yellowBright(message));
    }
    return;
  } catch (error) {
    throw new ConsoleError(`Unexpected error on console: ${error}`);
  }
}
