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

// TODO: try to use beforeAll to start the mocking

const mockAnswersWsIsolated = [
  ["api", "nodemon"],
  ["client", "nodemon"],
  ["client", "react"],
] as AnswerArray[][];

const mockReturnGroupByWsPkgIsolated = {
  nodemon: [
    ["api", "nodemon"],
    ["client", "nodemon"],
  ],
  react: [["client", "react"]],
};
const mockReturnGroupByOptsPkgIsolated = {
  nodemon: [["--save-dev", "nodemon"]],
  react: [["--save-prod", "react"]],
};

const pkgsIsolated = ["nodemon", "react"];
const mockReturnPopedWsIsolated = {
  nodemon: [["api"], ["client"]],
  react: [["client"]],
};

const mockReturnPopedOptsIsolated = {
  nodemon: [["--save-dev"]],
  react: [["--save-prod"]],
};

export const mockNormalizedIsolated = {
  ws: mockReturnPopedWsIsolated,
  opts: mockReturnPopedOptsIsolated,
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
    expect(groupingObjectKeys(mockAnswersWsIsolated)).toEqual(
      mockReturnGroupByWsPkgIsolated,
    );
  });
  it("should return fixed group object and pkg array", () => {
    expect(
      loopingNormalizedObject(
        mockReturnGroupByWsPkgIsolated,
        mockReturnGroupByOptsPkgIsolated,
      ),
    ).toEqual({ normalized: mockNormalizedIsolated, slicedArr: pkgsIsolated });
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
