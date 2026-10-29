import type { AnswerArray } from "#main-dev/types/index";

export const mockAnswersWs = [
  ["api", "nodemon"],
  ["client", "nodemon"],
  ["client", "react"],
] as AnswerArray[][];

export const mockAnswersOpts = [
  ["--save-dev", "nodemon"],
  ["--save-prod", "react"],
] as AnswerArray[][];

export const mockReturnGroupByWsPkg = {
  nodemon: [
    ["api", "nodemon"],
    ["client", "nodemon"],
  ],
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

export const mockPkgs = ["nodemon", "react"];

export const mockStmt =
  "npm install nodemon -w api -w client --save-dev & npm install react -w client --save-prod";
