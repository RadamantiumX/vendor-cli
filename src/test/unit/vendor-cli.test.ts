/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  vendorCli,
  listingProcedure,
  installerProcedure,
} from "#main-dev/vendor-cli"; // Adjust path to your source file
import { input, checkbox, select } from "@inquirer/prompts";
import customConfirm from "#main-dev/prompts/custom-inquirer";
import { asyncExeComand, turboCliProcess } from "#main-dev/spawn";
import { colorConsole } from "#main-dev/console/colors";
import { handleStreamChunks } from "#main-dev/stream-chunks";
import { cliStatementBuilder } from "#main-dev/stmt-resolver";
import { signature } from "#main-dev/console/ansii-art";
import {
  combineArrayChoices,
  filterOptionsChoices,
} from "#main-dev/prompts/inq-config";
import { SubProcessError } from "#main-dev/utils/errors";

// TODO: Fix all this mess
// Mock all external dependencies
vi.mock("@inquirer/prompts", () => ({
  input: vi.fn(),
  checkbox: vi.fn(),
  select: vi.fn(),
}));

vi.mock("#main-dev/prompts/custom-inquirer", () => ({
  default: vi.fn(),
}));

vi.mock("#main-dev/spawn", () => ({
  turboCliProcess: vi.fn(() => ({
    cliProcess: { on: vi.fn() },
    chunksStreamArr: [],
  })),
  asyncExeComand: vi.fn(),
}));

vi.mock("#main-dev/console/colors", () => ({
  colorConsole: vi.fn((msg) => msg),
}));

vi.mock("#main-dev/stream-chunks", () => ({
  handleStreamChunks: vi.fn(),
}));

vi.mock("#main-dev/stmt-resolver", () => ({
  cliStatementBuilder: vi.fn(),
}));

vi.mock("#main-dev/console/ansii-art", () => ({
  signature: vi.fn(),
}));

vi.mock("#main-dev/prompts/inq-config", () => ({
  isValidAmountOfChoices: vi.fn(() => true),
  combineArrayChoices: vi.fn((_input, ws) => ws),
  initialChoices: [{ name: "Install", value: "install" }],
  filterOptionsChoices: vi.fn(() => []),
}));

describe("CLI Procedures & Vendor CLI Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("listingProcedure", () => {
    it("should log the listing message", () => {
      listingProcedure();
      expect(colorConsole).toHaveBeenCalledWith(
        "Here is the listing...",
        "default",
      );
    });
  });

  describe("installerProcedure", () => {
    // it("should successfully complete the installation workflow when confirmed", async () => {
    //   vi.mocked(input).mockResolvedValue("package-a");
    //   vi.mocked(checkbox)
    //     .mockResolvedValueOnce(["ws-1"]) // workspaceQuiz
    //     .mockResolvedValueOnce(["opt-1"]); // optsQuiz
    //   vi.mocked(customConfirm).mockResolvedValue(true as never);
    //   vi.mocked(cliStatementBuilder).mockResolvedValue("turbo run build");
    //   vi.mocked(asyncExeComand).mockResolvedValue(undefined as never);

    //   await installerProcedure([{ name: "ws-1", value: ["ws-1"] }], "npm");

    //   expect(input).toHaveBeenCalled();
    //   expect(combineArrayChoices).toHaveBeenCalled();
    //   expect(checkbox).toHaveBeenCalledTimes(2);
    //   expect(customConfirm).toHaveBeenCalled();
    //   expect(cliStatementBuilder).toHaveBeenCalledWith(
    //     [["ws-1"]],
    //     [["opt-1"]],
    //     "npm"
    //   );
    //   expect(asyncExeComand).toHaveBeenCalledWith("turbo run build");
    //   expect(colorConsole).toHaveBeenCalledWith("Press ENTER to exit", "success");
    // });

    it("should abort and log cancellation when confirmQuiz is false", async () => {
      vi.mocked(input).mockResolvedValue("package-a");
      vi.mocked(checkbox).mockResolvedValue(["ws-1"]);
      vi.mocked(customConfirm).mockResolvedValue(false as never);

      await installerProcedure([], "npm");

      expect(customConfirm).toHaveBeenCalled();
      expect(colorConsole).toHaveBeenCalledWith(
        "Installation canceled",
        "exit",
      );
      expect(asyncExeComand).not.toHaveBeenCalled();
    });
  });

  describe("vendorCli", () => {
    it("should throw SubProcessError and log error when stream code is not 0", async () => {
      await vendorCli(1);
      expect(colorConsole).toHaveBeenCalledWith(
        "SubProcessError: Unexpected fail!",
        "error",
      );
    });

    it("should trigger installation workflow when select choice is 'install'", async () => {
      vi.mocked(handleStreamChunks).mockResolvedValue({
        wsAvailable: [],
        packageManager: "npm",
      });
      vi.mocked(select).mockResolvedValue("install");
      vi.mocked(input).mockResolvedValue("pkg");
      vi.mocked(checkbox).mockResolvedValue([]);
      vi.mocked(customConfirm).mockResolvedValue(false as never);

      await vendorCli(0);

      expect(signature).toHaveBeenCalled();
      expect(handleStreamChunks).toHaveBeenCalled();
      expect(select).toHaveBeenCalled();
      expect(colorConsole).toHaveBeenCalledWith(
        "Installation canceled",
        "exit",
      );
    });

    it("should trigger listing workflow when select choice is 'list'", async () => {
      vi.mocked(handleStreamChunks).mockResolvedValue({
        wsAvailable: [],
        packageManager: "npm",
      });
      vi.mocked(select).mockResolvedValue("list");

      await vendorCli(0);

      expect(signature).toHaveBeenCalled();
      expect(colorConsole).toHaveBeenCalledWith(
        "Here is the listing...",
        "default",
      );
    });

    it("should handle exit correctly when select choice is unknown", async () => {
      vi.mocked(handleStreamChunks).mockResolvedValue({
        wsAvailable: [],
        packageManager: "npm",
      });
      vi.mocked(select).mockResolvedValue("unknown");

      await vendorCli(0);

      expect(colorConsole).toHaveBeenCalledWith(
        "Exit from the assistant... Bye bye👋",
        "exit",
      );
    });
  });
});
