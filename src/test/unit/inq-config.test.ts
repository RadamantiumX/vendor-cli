/* eslint-disable @typescript-eslint/no-explicit-any */
import { it, describe, expect } from "vitest";
import {
  isValidAmountOfChoices,
  combineArrayChoices,
  filterOptionsChoices,
} from "../../prompts/inq-config";
import type { PkgMng } from "../../types/index";

const mockPkgs = ["nodemon", "react"];

const mockPkgsThrowEmpty = [] as any[];
const mockPkgsThrowWrongElement = [""] as any[];

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

const mockChoicesWs = [
  {
    name: "API",
    value: ["api"],
  },
  {
    name: "API",
    value: ["api"],
  },
];

const mockingPkgManager: PkgMng[] = ["npm", "pnpm", "yarn"];

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
  it("should be defined", async () => {
    const mustBeChoices = await combineArrayChoices(mockPkgs, mockChoicesWs);
    expect(mustBeChoices).toBeDefined();
  });

  it("should be throw if the array is empty", async () => {
    await expect(async () => {
      await combineArrayChoices(mockPkgsThrowEmpty, mockChoicesWs);
    }).rejects.toThrow();
  });

  it("should be throw if the array content wrong element", async () => {
    await expect(async () => {
      await combineArrayChoices(mockPkgsThrowWrongElement, mockChoicesWs);
    }).rejects.toThrow();
  });
});

describe("filterOptionsChoices", () => {
  it("should be defined", () => {
    const mustBeChoices = filterOptionsChoices(
      mockingPkgManager[
        Math.floor(Math.random() * mockingPkgManager.length)
      ] as PkgMng,
    );
    expect(mustBeChoices).toBeDefined();
  });
  it("should have the currents properties", () => {
    const mustBeChoices = filterOptionsChoices(
      mockingPkgManager[
        Math.floor(Math.random() * mockingPkgManager.length)
      ] as PkgMng,
    );
    mustBeChoices.map((item) => {
      expect(item).toHaveProperty("name");
      expect(item).toHaveProperty("value");
      expect(item).toHaveProperty("description");
    });
  });
});
