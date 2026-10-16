import { it, describe, expect } from "vitest";
import {
  isValidAmountOfChoices,
  combineArrayChoices,
} from "#main-dev/inq-config";

const mockPkgs = ["nodemon", "react"];
const mockAnswersTrue = [
  {
    value: ["api", "nodemon"],
    name: "API",
    short: "API",
    checkedName: "API",
    disabled: false,
    checked: true,
  },
  {
    value: ["api", "react"],
    name: "API",
    short: "API",
    checkedName: "API",
    disabled: false,
    checked: true,
  },
];

const mockChoices = [
  {
    name: "API",
    value: ["api"],
  },
  {
    name: "API",
    value: ["api"],
  },
];

describe("isValidAmountOfChoices", () => {
  it("Should be defined", async () => {
    const mustBeDefined = await isValidAmountOfChoices(
      mockAnswersTrue,
      mockPkgs,
    );
    expect(mustBeDefined).toBeDefined();
  });
  it("Should return boolean", async () => {
    const mustBeTrue = await isValidAmountOfChoices(mockAnswersTrue, mockPkgs);
    expect(mustBeTrue).toBeTruthy();
  });
  it("Should return string", async () => {
    const mustBeString = await isValidAmountOfChoices(
      mockAnswersTrue.slice(0, 1),
      mockPkgs,
    );
    expect(mustBeString).toBeTypeOf("string");
  });
});

describe("combineArrayChoices", () => {
  it("should return a choice array", async () => {
    const mustBeChoices = await combineArrayChoices(mockPkgs, mockChoices);
    expect(mustBeChoices).toBeDefined();
  });
});
