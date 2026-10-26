import type { AnswerArray } from "#main-dev/types/index";

export const mockAnswersWs = [
  ["api", "nodemon"],
  ["client", "react"],
] as AnswerArray[][];

export const mockAnswersOpts = [
  ["--save-dev", "nodemon"],
  ["--save-prod", "react"],
] as AnswerArray[][];

export const mockReturnGroupByWsPkg = {
  nodemon: [["api", "nodemon"]],
  react: [["client", "react"]],
};

export const mockReturnGroupByOptsPkg = {
  nodemon: [["--save-dev", "nodemon"]],
  react: [["--save-prod", "react"]],
};

export const mockNormalized = {
  ws: mockReturnGroupByWsPkg,
  opts: mockReturnGroupByOptsPkg,
};
