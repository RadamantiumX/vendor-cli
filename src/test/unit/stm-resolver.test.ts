import { it, describe, expect, expectTypeOf } from "vitest";
import {
  groupingConfigNormalized,
  cliStatementBuilder,
  groupingObjectKeys,
  loopingNormalizedObject,
} from "../../stmt-resolver";
import type { AnswerArray, ObjNormalized } from "#main-dev/types/index";

import {
  mockAnswersWs,
  mockAnswersOpts,
  mockStmt,
} from "./mock/mocking-values";

const isolated = {
  answerWs: [
    ["api", "nodemon"],
    ["client", "nodemon"],
    ["client", "react"],
  ] as AnswerArray[][],
  returnAnswerWs: {
    nodemon: [
      ["api", "nodemon"],
      ["client", "nodemon"],
    ],
    react: [["client", "react"]],
  },
  returnGroupByWsPkg: {
    nodemon: [
      ["api", "nodemon"],
      ["client", "nodemon"],
    ],
    react: [["client", "react"]],
  },
  returnGroupByOptsPkg: {
    nodemon: [["--save-dev", "nodemon"]],
    react: [["--save-prod", "react"]],
  },
  pkgs: ["nodemon", "react"],
  returnPopedWsOpts: {
    nodemon: [["--save-dev"]],
    react: [["--save-prod"]],
  },
  normalized: {
    ws: {
      nodemon: [["api"], ["client"]],
      react: [["client"]],
    },
    opts: {
      nodemon: [["--save-dev"]],
      react: [["--save-prod"]],
    },
  },
};

describe("groupingConfigNormalized", () => {
  it("should be defined", () => {
    const mustBeDefined = groupingConfigNormalized(
      mockAnswersWs,
      mockAnswersOpts,
    );
    expect(mustBeDefined).toBeDefined();
  });

  it("should be group by pkg name", () => {
    expect(groupingObjectKeys(isolated.answerWs)).toEqual(
      isolated.returnGroupByWsPkg,
    );
  });
  it("should return fixed group object and pkg array", () => {
    expect(
      loopingNormalizedObject(
        isolated.returnGroupByWsPkg,
        isolated.returnGroupByOptsPkg,
      ),
    ).toEqual({ normalized: isolated.normalized, slicedArr: isolated.pkgs });
  });
  it("should be the correct type", () => {
    const { normalized, slicedArr } = groupingConfigNormalized(
      mockAnswersWs,
      mockAnswersOpts,
    );
    expectTypeOf(normalized).toEqualTypeOf<ObjNormalized<string[]>>();
    expectTypeOf(slicedArr).toEqualTypeOf<string[]>();
  });
});

describe("cliStatementBuilder", async () => {
  const cliExeTest = await cliStatementBuilder(
    mockAnswersWs,
    mockAnswersOpts,
    "npm",
  );
  it("should be defined", () => {
    expect(cliExeTest).toBeDefined();
  });
  // todo: manke a loop to test for: npm, pnpm and yarn
  it("should build a correct statement (with npm)", () => {
    expect(cliExeTest).toMatch(mockStmt);
  });
});
