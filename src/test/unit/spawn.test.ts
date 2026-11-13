import { describe, it, vi, beforeEach, expect } from "vitest";
import { spawn } from "node:child_process";
import { asyncExeComand } from "#main-dev/spawn";
import { colorConsole } from "#main-dev/console/colors";
import EventEmitter from "node:events";

vi.mock("node:child_process", () => ({
  spawn: vi.fn(),
}));

vi.mock("#main-dev/console/colors", () => ({
  colorConsole: vi.fn((msg) => msg),
}));

describe("asyncExeComand", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("should emit the correct data", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockChild = new EventEmitter() as any;
    vi.mocked(spawn).mockReturnValue(mockChild);

    const promise = asyncExeComand(
      "npm install react --save-prod & npm install tsup --save-dev",
    );

    expect(spawn).toHaveBeenCalledWith(
      "npm install react --save-prod & npm install tsup --save-dev",
      {
        shell: true,
        cwd: process.cwd(),
        stdio: "inherit",
      },
    );

    mockChild.emit("close", 0);
    await expect(promise).resolves.toBe("Success on install dependencies");
    expect(colorConsole).toHaveBeenCalledWith(
      "Success on install dependencies",
      "success",
    );
  });
  it("should throw if the statement it's invalid", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockChild = new EventEmitter() as any;
    vi.mocked(spawn).mockReturnValue(mockChild);

    const promise = asyncExeComand("node -v");

    expect(spawn).toHaveBeenCalledWith("node -v", {
      shell: true,
      cwd: process.cwd(),
      stdio: "inherit",
    });

    mockChild.emit("close", 0);
    await expect(async () => {
      await promise;
    }).rejects.toThrow();
  });
});
