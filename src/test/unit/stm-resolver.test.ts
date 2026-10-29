import { it, describe, expect, expectTypeOf } from "vitest";
import {
  groupingConfigNormalized,
  cliStatementBuilder,
} from "../../stmt-resolver";
import type { ObjNormalized } from "#main-dev/types/index";
import {
  mockAnswersWs,
  mockAnswersOpts,
  mockStmt,
} from "./mock/mocking-values";

describe("groupingConfigNormalized", () => {
  it("should be defined", () => {
    const mustBeDefined = groupingConfigNormalized(
      mockAnswersWs,
      mockAnswersOpts,
    );
    expect(mustBeDefined).toBeDefined();
  });

  it("should be the correct type", () => {
    const { normalized, slicedPkgArr } = groupingConfigNormalized(
      mockAnswersWs,
      mockAnswersOpts,
    );
    expectTypeOf(normalized).toEqualTypeOf<ObjNormalized<string[]>>();
    expectTypeOf(slicedPkgArr).toEqualTypeOf<string[]>();
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
