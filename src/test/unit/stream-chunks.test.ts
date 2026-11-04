import { it, describe, expect } from "vitest";
import { handleStreamChunks, decodingBuffer } from "#main-dev/stream-chunks";

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
const mockedBuffer: Uint8Array<ArrayBufferLike>[] = [
  new TextEncoder().encode(JSON.stringify(toMockedObject)),
];

describe("handleStreamChunks", () => {
  it("should be defined", () => {
    expect(handleStreamChunks).toBeDefined();
  });
  it("should decode the binary data", () => {
    const dec = decodingBuffer(mockedBuffer);
    expect(dec).toBe(JSON.stringify(toMockedObject));
  });
});
