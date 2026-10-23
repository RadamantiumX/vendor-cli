// eslint-disable
import { it, describe, expectTypeOf } from "vitest";
import { colorConsole } from "#main-dev/utils/colors";

describe("colorConsole", () => {
  it("should receive correct arguments", () => {
    expectTypeOf(colorConsole("test on console", "success")).toBeVoid();
  });
});
