import ansiColors from "ansi-colors";
import { Separator } from "@inquirer/prompts";
import { PromptError } from "./utils/errors";
import { FLAG_OPTIONS } from "./utils/constants";
import type { Choices, CheckBoxAnswer, PkgMng } from "./types/index";

/**
 * Static Choices for the main menu
 */
export const initialChoices = [
  {
    name: "Install dependencies",
    value: "install",
  },
  {
    name: "Listing of dependencies",
    value: "list",
  },
  {
    name: "Exit",
    value: "exit",
  },
];

/**
 * Dinamic choices for options checkbox.
 * Push the values of inquirer config choices filtering the current package manager options
 * @param pkgMng pnpm // npm // yarn
 * @returns the choices array without the separator
 */
export const filterOptionsChoices = (pkgMng: PkgMng): Choices[] => {
  const choiceArr = [];
  for (const [key, value] of Object.entries(
    FLAG_OPTIONS[pkgMng.toUpperCase() as keyof typeof FLAG_OPTIONS],
  )) {
    choiceArr.push({ name: key, value: [value], description: value });
  }

  return choiceArr;
};

/**
 * Optional on inquirer/prompts checkbox config
 * Used for validations of selected choices, must be, at least, one for package input in checkbox.
 * The Callback in Checkbox config, it's only allowed handle the full "answers", but this fn only need the "value" key,
 * for this reason, the validation take the slice inside the callback.
 * @param answers All the answers retreived
 * @param arrayPkg All the current packages input
 * @returns A boolean value to validate the checkbox
 */
export async function isValidAmountOfChoices(
  answers: CheckBoxAnswer[],
  arrayPkg: string[],
) {
  const checkedItems = [] as string[];

  answers.map((answer) => {
    checkedItems.push(answer.value[1] as string);
  });

  const notFoundedValues = arrayPkg.find((value) => {
    const verify = checkedItems.includes(value);
    return !verify;
  });

  if (notFoundedValues) {
    return `You miss select any choice on ${ansiColors.blackBright(notFoundedValues.toUpperCase())}`;
  }
  return true;
}

/**
 * Package input (like Separator) and Workspaces (like choices) merged
 * @param packageArr The input packages
 * @param objChoiceArr Workspaces available retrieved from the CLI
 * @returns The merged choices for input/prompts checkbox
 */
export async function combineArrayChoices(
  packageArr: string[],
  objChoiceArr: Choices[],
) {
  const assembledChoices = packageArr.reduce((acc, item) => {
    const mixed = objChoiceArr.map((obj) => {
      obj = { name: obj.name, value: [obj.value, item].flat() };
      return obj;
    });
    acc?.push(new Separator(ansiColors.bgBlue(item.toUpperCase())), ...mixed);
    return acc as unknown[];
  }, [] as unknown[]);

  if (!assembledChoices) {
    throw new PromptError();
  }
  return assembledChoices;
}
