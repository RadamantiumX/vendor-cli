import { it, describe, expect, expectTypeOf } from "vitest";
import {
  groupingConfigNormalized,
  type ObjNormalized,
} from "../../stmt-resolver";
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

  it("should be the correct type", () => {
    const { normalized } = groupingConfigNormalized(
      mockAnswersWs,
      mockAnswersOpts,
    );
    expectTypeOf(normalized).toEqualTypeOf<ObjNormalized<string[]>>();
  });
});

// describe("cliStatementBuilder", ()=>{
//    it("",()=>{

//    })
// })
