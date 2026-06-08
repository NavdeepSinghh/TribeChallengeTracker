jest.mock("../profile/profileMedia", () => ({
  makeWinCardBlob: jest.fn(() => Promise.resolve(new Blob(["profile-card"], { type: "image/png" }))),
}));

const { shareProfileCard } = require("../profile/profileShareCards");
const { makeWinCardBlob } = require("../profile/profileMedia");

describe("profile share card sharing helpers", () => {
  beforeAll(() => {
    Object.defineProperty(global, "File", {
      configurable: true,
      value: class TestFile {
        constructor(chunks, name, options) {
          this.chunks = chunks;
          this.name = name;
          this.type = options?.type;
        }
      },
    });
  });

  beforeEach(() => {
    makeWinCardBlob.mockResolvedValue(new Blob(["profile-card"], { type: "image/png" }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    delete navigator.share;
    delete navigator.canShare;
    delete navigator.clipboard;
  });

  it("prefers native file sharing when profile card files are supported", async () => {
    const setMessage = jest.fn();
    const share = jest.fn(() => Promise.resolve());
    Object.defineProperty(navigator, "share", { configurable: true, value: share });
    Object.defineProperty(navigator, "canShare", { configurable: true, value: jest.fn(() => true) });

    await shareProfileCard({
      blobInput: { displayName: "Weekly Recap", totalPoints: 310 },
      downloadName: "weekly.png",
      fallbackMessage: "fallback",
      setMessage,
      shareReadyMessage: "ready",
      text: "share text",
      title: "Weekly",
    });

    expect(makeWinCardBlob).toHaveBeenCalledWith({ displayName: "Weekly Recap", totalPoints: 310 });
    expect(share).toHaveBeenCalledWith(expect.objectContaining({
      files: [expect.any(File)],
      text: "share text",
      title: "Weekly",
    }));
    expect(setMessage).toHaveBeenLastCalledWith("ready");
  });

  it("falls back to clipboard and download when native file sharing is unavailable", async () => {
    const setMessage = jest.fn();
    const writeText = jest.fn(() => Promise.resolve());
    const revokeObjectURL = jest.fn();
    const click = jest.fn();
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    Object.defineProperty(navigator, "canShare", { configurable: true, value: jest.fn(() => false) });
    Object.defineProperty(URL, "createObjectURL", { configurable: true, value: jest.fn(() => "blob:profile-card") });
    Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: revokeObjectURL });
    jest.spyOn(document, "createElement").mockReturnValue({ click });

    await shareProfileCard({
      blobInput: { displayName: "Monthly Recap", totalPoints: 1440 },
      downloadName: "monthly.png",
      fallbackMessage: "downloaded",
      setMessage,
      shareReadyMessage: "ready",
      text: "monthly text",
      title: "Monthly",
    });

    expect(writeText).toHaveBeenCalledWith("monthly text");
    expect(click).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:profile-card");
    expect(setMessage).toHaveBeenLastCalledWith("downloaded");
  });

  it("uses the caller-specific error message when card generation fails", async () => {
    const setMessage = jest.fn();
    makeWinCardBlob.mockRejectedValueOnce(new Error());

    await shareProfileCard({
      blobInput: { displayName: "Win Card" },
      downloadName: "win.png",
      errorMessage: "Could not create win card.",
      fallbackMessage: "fallback",
      setMessage,
      shareReadyMessage: "ready",
      text: "win text",
      title: "Win",
    });

    expect(setMessage).toHaveBeenLastCalledWith("Could not create win card.");
  });
});
