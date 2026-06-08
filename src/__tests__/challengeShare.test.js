jest.mock("../challenges/challengeLaunchCard", () => ({
  makeChallengeLaunchCardBlob: jest.fn(() => Promise.resolve(new Blob(["launch-card"], { type: "image/png" }))),
}));

const {
  buildChallengeShareLink,
  campaignShareText,
  launchCardFileName,
  shareChallengeLaunchCard,
} = require("../challenges/challengeShare");
const { makeChallengeLaunchCardBlob } = require("../challenges/challengeLaunchCard");

describe("challenge share helpers", () => {
  const challenge = {
    campaignCta: "Bring your training partner.",
    campaignHashtag: "#TribeLaunch",
    inviteCode: "ABCD12",
    name: "Summer Shred 21!",
  };

  afterEach(() => {
    jest.clearAllMocks();
    delete navigator.share;
    delete navigator.canShare;
    delete navigator.clipboard;
  });

  it("builds stable referral invite links and campaign copy", () => {
    const shareLink = buildChallengeShareLink({
      inviteCode: challenge.inviteCode,
      origin: "https://app.risewiththetribe.com",
      refUid: "user-123",
    });

    expect(shareLink).toBe("https://app.risewiththetribe.com?join=ABCD12&ref=user-123");
    expect(campaignShareText(challenge, shareLink)).toBe(
      "Join my Summer Shred 21! challenge on Rise With The Tribe.\nBring your training partner.\n#TribeLaunch https://app.risewiththetribe.com?join=ABCD12&ref=user-123"
    );
  });

  it("uses the launch-card filename convention for generated cards", () => {
    expect(launchCardFileName(challenge)).toBe("summer-shred-21--launch-card.png");
  });

  it("prefers native file sharing when launch-card files are supported", async () => {
    const share = jest.fn(() => Promise.resolve());
    navigator.share = share;
    navigator.canShare = jest.fn(() => true);

    const outcome = await shareChallengeLaunchCard({
      challenge,
      shareLink: "https://example.test?join=ABCD12&ref=user-123",
      text: "campaign text",
    });

    expect(outcome).toBe("launch-card-shared");
    expect(makeChallengeLaunchCardBlob).toHaveBeenCalledWith({
      challenge,
      shareLink: "https://example.test?join=ABCD12&ref=user-123",
    });
    expect(share).toHaveBeenCalledWith(expect.objectContaining({
      files: [expect.any(File)],
      text: "campaign text",
      title: "Summer Shred 21! challenge",
    }));
  });

  it("falls back to native text sharing when file sharing is unavailable", async () => {
    const share = jest.fn(() => Promise.resolve());
    navigator.share = share;
    navigator.canShare = jest.fn(() => false);

    const outcome = await shareChallengeLaunchCard({
      challenge,
      shareLink: "https://example.test?join=ABCD12&ref=user-123",
      text: "campaign text",
    });

    expect(outcome).toBe("invite-shared");
    expect(share).toHaveBeenCalledWith({
      text: "campaign text",
      title: "Summer Shred 21! challenge",
    });
  });

  it("falls back to copying campaign text when native sharing is unavailable", async () => {
    const writeText = jest.fn(() => Promise.resolve());
    navigator.clipboard = { writeText };

    const outcome = await shareChallengeLaunchCard({
      challenge,
      shareLink: "https://example.test?join=ABCD12&ref=user-123",
      text: "campaign text",
    });

    expect(outcome).toBe("campaign-copy-copied");
    expect(writeText).toHaveBeenCalledWith("campaign text");
  });
});
