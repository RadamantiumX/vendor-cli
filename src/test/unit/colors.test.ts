// eslint-disable
import { it, describe, expectTypeOf } from "vitest";
import { colorConsole } from "#main-dev/utils/colors";

describe("colorConsole", () => {
  it("should receive correct arguments", () => {
    expectTypeOf(colorConsole("test on console", "success")).toBeVoid();
  });

  // it('should throw error with wrong arguments', ()=>
  // expect(colorConsole('test on console', 'timer')).throw())
});
