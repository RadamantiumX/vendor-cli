export type CheckBoxAnswer = {
  value: string[];
  name: string;
  short: string;
  checkedName: string;
  disabled: boolean;
  checked: boolean;
};

export type AnswerArray = string[] | boolean[];

export type PkgMng = "npm" | "pnpm" | "yarn";

export type Choices = {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: string[] | boolean[] | any[];
};
