export type CheckBoxAnswer = {
  value: string[];
  name: string;
  short: string;
  checkedName: string;
  disabled: boolean;
  checked: boolean;
};

export type AnswerArray = string;

export type PkgMng = "npm" | "pnpm" | "yarn";

export type Choices = {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: string[] | boolean[] | any[];
};

export type UnknowError<T> = T | unknown;
export type AnswKey<K> = K;

export type ObjNormalized<T> = {
  ws: {
    [x: string]: T[] | undefined;
  };
  opts: {
    [x: string]: T[] | undefined;
  };
};
