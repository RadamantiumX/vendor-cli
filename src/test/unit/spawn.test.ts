/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, vi, beforeEach, expect } from "vitest";
import { spawn } from "node:child_process";
import { asyncExeComand, turboCliProcess } from "#main-dev/spawn";
import { colorConsole } from "#main-dev/console/colors";
import { TURBO_LIST } from "../../utils/constants";
import { EventEmitter } from "node:events";

vi.mock("node:child_process", () => ({
  spawn: vi.fn(),
}));

vi.mock("#main-dev/console/colors", () => ({
  colorConsole: vi.fn((msg) => msg),
}));

const mockedTurboCliOutput = {
  packageManager: "pnpm9",
  packages: {
    count: 2,
    items: [
      { name: "api", path: "loader\\api" },
      { name: "client", path: "loader\\client" },
    ],
  },
};

describe("asyncExeComand", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("should emit the correct data", async () => {
    const mockChild = new EventEmitter() as any;
    vi.mocked(spawn).mockReturnValue(mockChild);

    const promise = asyncExeComand(
      "npm install react --save-prod & npm install tsup --save-dev & npm i cors --save-exact",
    );

    expect(spawn).toHaveBeenCalledWith(
      "npm install react --save-prod & npm install tsup --save-dev & npm i cors --save-exact",
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

describe("turboCliProcess", () => {
  let mockStdout: EventEmitter;
  let mockStderr: EventEmitter;
  let mockChildProcess: any;
  beforeEach(() => {
    vi.clearAllMocks();
    mockStdout = new EventEmitter();
    mockStderr = new EventEmitter();
    mockChildProcess = {
      stdout: mockStdout,
      stderr: mockStderr,
      kill: vi.fn(),
    } as any;

    (spawn as any).mockReturnValue(mockChildProcess);
  });

  it("Should execute the Turbo CLI and return the string to collect into chunks", () => {
    const turboCliTest = turboCliProcess();

    expect(spawn).toHaveBeenCalledWith(TURBO_LIST, {
      stdio: ["overlapped", "pipe", "pipe"],
      shell: true,
    });

    const outputExpected = JSON.stringify(mockedTurboCliOutput);

    const chunkOutput = new TextEncoder().encode(outputExpected);

    mockStdout.emit("data", chunkOutput);
    expect(turboCliTest.chunksStreamArr).toHaveLength(1);
    expect(turboCliTest.chunksStreamArr[0]).toEqual(chunkOutput);
    expect(turboCliTest.cliProcess).toBe(mockChildProcess);
  });
  it("should throw error on spawn process", () => {
    const turboCliTest = turboCliProcess();

    const mockedErrorTest = new Error("Testing error on execution");
    mockStderr.emit("error", mockedErrorTest);
    expect(turboCliTest.cliProcess).toBe(mockChildProcess);
  });
});
