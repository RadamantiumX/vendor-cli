/* eslint-disable @typescript-eslint/no-explicit-any */
import { it, describe, expect, expectTypeOf } from "vitest";
import { groupingConfigNormalized } from "../../stmt-resolver";
import type { AnswerArray } from "#main-dev/types/index";

const mockAnswersWs = [
  ["api", "nodemon"],
  ["client", "react"],
] as AnswerArray[][];
const mockAnswersOpts = [
  ["--save-dev", "nodemon"],
  ["--save-prod", "react"],
] as AnswerArray[][];

describe("groupingConfigNormalized", () => {
  it("should be defined", () => {
    const mustBeDefined = groupingConfigNormalized(
      mockAnswersWs,
      mockAnswersOpts,
    );
    expect(mustBeDefined).toBeDefined();
  });

  it("should return the same type", () => {
    const { normalized } = groupingConfigNormalized(
      mockAnswersWs,
      mockAnswersOpts,
    );
    expectTypeOf(normalized).toEqualTypeOf<{
      ws: { [x: string]: any[] | undefined };
      opts: { [x: string]: any[] | undefined };
    }>();
  });
});
