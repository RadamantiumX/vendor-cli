import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  vendorCli,
  installerProcedure,
  type StreamExitCode,
} from "#main-dev/vendor-cli";
import { select } from "@inquirer/prompts";
import * as ansiiArt from "#main-dev/console/ansii-art";
import { handleStreamChunks } from "#main-dev/stream-chunks";
//  import { colorConsole } from '#main-dev/console/colors';
//  import { SubProcessError } from '#main-dev/utils/errors';
//  import { ZodError } from 'zod';

const wsMockedReturn = [
  {
    name: "api | loader\\api",
    value: ["api"],
  },
  {
    name: "client | loader\\client",
    value: ["client"],
  },
];
vi.mock("@inquirer/prompts", () => ({
  select: vi.fn(),
}));
//   vi.mock('#main-dev/console/ansii-art',async (importOriginal)=>{
//     const actual = await importOriginal<typeof import('#main-dev/console/ansii-art')>()
//     return {
//         ...actual,
//         defualt:vi.fn(),
//         signature: vi.fn()
//     }
//   })
// Todo: the proble is coming from "signature" defualt export, fix it!
vi.mock("#main-dev/stream-chunks", () => ({
  handleStreamChunks: vi.fn().mockReturnValue({
    wsAvailable: [
      {
        name: "api | loader\\api",
        value: ["api"],
      },
      {
        name: "client | loader\\client",
        value: ["client"],
      },
    ],
    packageManager: "npm",
  }),
}));

vi.mock("#main-dev/vendor-cli", () => ({
  installerProcedure: vi.fn(),
}));

vi.mock("#main-dev/vendor-cli", () => ({
  vendorCli: vi.fn(),
}));

describe("vendor-cli", async () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("should run installer procedure when is selected", async () => {
    vi.mocked(select).mockRejectedValueOnce("install");
    const spy = vi.spyOn(ansiiArt, "default");
    await vendorCli(0 as StreamExitCode<number>);

    expect(spy).toHaveBeenCalled();
    expect(handleStreamChunks).toHaveBeenCalled();
    expect(select).toHaveBeenCalled();
    expect(installerProcedure).toHaveBeenCalledWith(wsMockedReturn, "npm");
  });
});
