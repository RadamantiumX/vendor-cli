import { it, describe, expect } from "vitest";
import {
  handleStreamChunks,
  bufferDecodingToObjectParsed,
} from "#main-dev/stream-chunks";

// Original object to test
const toMockedObject = {
  packageManager: "pnpm9",
  packages: {
    count: 2,
    items: [
      { name: "api", path: "loader\\api" },
      { name: "client", path: "loader\\client" },
    ],
  },
};

const toMockedObjectThrow = {
  packageManager: "bun",
  packages: {
    count: 2,
    items: [
      { name: "api", path: "loader\\api" },
      { name: "client", path: "loader\\client" },
    ],
  },
};

// Converter to ARRAY BUFFER
const mockedChunkBuffer: Uint8Array<ArrayBufferLike>[] = [
  new TextEncoder().encode(JSON.stringify(toMockedObject)),
];

const mockedChunkBufferThrow: Uint8Array<ArrayBufferLike>[] = [
  new TextEncoder().encode(JSON.stringify(toMockedObjectThrow)),
];

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

describe("handleStreamChunks", () => {
  it("should be defined", () => {
    expect(handleStreamChunks).toBeDefined();
  });
  it("should decoded and parsed the data provied", () => {
    const dec = bufferDecodingToObjectParsed(mockedChunkBuffer);
    expect(dec).toStrictEqual(toMockedObject);
  });
  it("should return the correct package manager name", async () => {
    const { packageManager } = await handleStreamChunks(mockedChunkBuffer);
    expect(packageManager).toBe("pnpm");
  });
  it("should return a refactores object with WS", async () => {
    const { wsAvailable } = await handleStreamChunks(mockedChunkBuffer);
    expect(wsAvailable).toEqual(wsMockedReturn);
  });
  it("should throw for validations", async () => {
    await expect(
      async () => await handleStreamChunks(mockedChunkBufferThrow),
    ).rejects.toThrow();
  });
});
