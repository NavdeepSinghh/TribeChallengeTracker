const path = require("path");
const { verifyRelease } = require("../../scripts/verify-release");

describe("release safety contracts", () => {
  it("keeps cross-platform feature docs, app links, and deep-link hooks in sync", () => {
    expect(
      verifyRelease({
        repoRoot: path.resolve(__dirname, "..", ".."),
      })
    ).toBe(true);
  });
});
