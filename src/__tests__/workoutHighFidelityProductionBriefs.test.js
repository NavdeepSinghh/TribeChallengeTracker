const path = require("path");
const {
  buildAssetBriefs,
  renderMarkdown,
} = require("../../scripts/render-workout-high-fidelity-production-briefs");
const { loadMediaManifest } = require("../../scripts/validate-workout-high-fidelity-media");

const repoRoot = path.resolve(__dirname, "../..");
const manifestPath = path.join(repoRoot, "scripts/workout-high-fidelity-media-poc.json");

describe("high-fidelity production asset briefs", () => {
  it("generates one production brief for each approved POC exercise", () => {
    const records = loadMediaManifest(manifestPath);
    const briefs = buildAssetBriefs(records);

    expect(briefs.map((brief) => brief.id)).toEqual([
      "goblet_squat",
      "push_up",
      "lat_pulldown",
      "romanian_deadlift",
      "bulgarian_split_squat",
    ]);
    briefs.forEach((brief) => {
      expect(brief.storage.mp4).toBe(`workouts/exercises/v2/${brief.id}/demo.mp4`);
      expect(brief.storage.webm).toBe(`workouts/exercises/v2/${brief.id}/demo.webm`);
      expect(brief.storage.poster).toBe(`workouts/exercises/v2/${brief.id}/poster.webp`);
      expect(brief.media.expectedSizeBudget.mp4MaxMb).toBeLessThanOrEqual(3);
      expect(brief.media.expectedSizeBudget.webmMaxMb).toBeLessThanOrEqual(2);
      expect(brief.media.expectedSizeBudget.posterMaxKb).toBeLessThanOrEqual(250);
    });
  });

  it("keeps cue text in the app layer instead of baked into media", () => {
    const briefs = buildAssetBriefs(loadMediaManifest(manifestPath));

    briefs.forEach((brief) => {
      expect(brief.videoPrompt).toMatch(/Do not bake text/i);
      expect(brief.posterPrompt).toMatch(/No text/i);
      expect(brief.qaChecklist.join(" ")).toMatch(/Cue text remains in TribeLog Coach Mode UI/i);
    });
  });

  it("renders a review markdown pack without competitor UI or unsupported claim language", () => {
    const briefs = buildAssetBriefs(loadMediaManifest(manifestPath));
    const markdown = renderMarkdown(briefs);

    expect(markdown).toContain("TribeLog High-Fidelity Production Asset Briefs");
    expect(markdown).toContain("Global style");
    expect(markdown).not.toMatch(/\b(Instagram|Reels|TikTok|myfitcoach|Facebook)\b/i);
    expect(markdown).not.toMatch(/\b(cure|diagnose|heal|therapy|pain[- ]?free|guarantee|doctor|clinical)\b/i);
  });
});
