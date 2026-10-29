import { vi, expect, it, describe } from "vitest";
import {
  mockAnswersWs,
  mockAnswersOpts,
  mockReturnGroupByWsPkg,
  mockReturnGroupByOptsPkg,
  mockNormalized,
} from "./mocking-values";
import type { AnswKey, ObjNormalized } from "#main-dev/types/index";

const mockReturnGroup = vi.fn((mockArgs) => {
  const groupingArgs = Object.groupBy(
    [...mockArgs],
    (answ: AnswKey<string[]>) => answ[1] as string,
  );
  return groupingArgs;
});

const mockNormalizedAnswers = vi.fn((mockArgWs, mockArgsOpts) => {
  const mockedNmz: ObjNormalized<string[]> = {
    ws: { ...mockArgWs },
    opts: { ...mockArgsOpts },
  };

  return mockedNmz;
});

describe("mockingGroupingKeys", () => {
  it("must mock a group Ws by function", () => {
    mockReturnGroup(mockAnswersWs);
    expect(mockReturnGroup).toHaveBeenCalled();
    expect(mockReturnGroup).toHaveResolvedWith(mockReturnGroupByWsPkg);
  });

  it("must mock a group Opts by function", () => {
    mockReturnGroup(mockAnswersOpts);
    expect(mockReturnGroup).toHaveBeenCalled();
    expect(mockReturnGroup).toHaveResolvedWith(mockReturnGroupByOptsPkg);
  });

  it("must normalized raw objects", () => {
    const fkWsAnsw = mockReturnGroup(mockAnswersWs);
    const fkOptsAnsw = mockReturnGroup(mockAnswersOpts);
    mockNormalizedAnswers(fkWsAnsw, fkOptsAnsw);

    expect(mockNormalizedAnswers).toHaveBeenCalled();
    expect(mockNormalizedAnswers).toHaveResolvedWith(mockNormalized);
  });
});
