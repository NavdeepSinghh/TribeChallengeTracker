const fs = require("fs");
const os = require("os");
const path = require("path");
const {
  buildReviewBoardModel,
  bytesLabel,
  renderAssetReviewBoard,
} = require("../../scripts/render-workout-high-fidelity-asset-review-board");

function writeFile(filePath, bytes) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, Buffer.from(bytes));
}

function mediaRecord(id = "goblet_squat") {
  return {
    id,
    mediaManifest: {
      preferredMotion: "video",
      videoPath: `workouts/exercises/v2/${id}/demo.mp4`,
      previewPath: `workouts/exercises/v2/${id}/demo.webm`,
      posterPath: `workouts/exercises/v2/${id}/poster.webp`,
      styleVersion: "tribelog-3d-v1",
      durationMs: 3400,
      frameRate: 30,
    },
    renderBrief: {
      phaseTimeline: [
        { cueId: "setup", startPercent: 0, endPercent: 20 },
        { cueId: "work", startPercent: 20, endPercent: 80 },
      ],
    },
  };
}

describe("high-fidelity real asset review board", () => {
  it("shows missing files as pending without faking readiness", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "tribelog-real-media-"));
    const model = buildReviewBoardModel([mediaRecord()], { mediaRoot: root, output: path.join(root, "board.html") });
    const html = renderAssetReviewBoard([mediaRecord()], { mediaRoot: root, output: path.join(root, "board.html") });

    expect(model.readyCount).toBe(0);
    expect(model.report.ok).toBe(false);
    expect(model.report.failures.join(" ")).toMatch(/missing/);
    expect(html).toContain("Real media pending");
    expect(html).toContain("0/1 exercises ready");
    expect(html).not.toContain("<video");
  });

  it("renders playable video markup when assets pass the file gate", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "tribelog-real-media-"));
    const record = mediaRecord("lat_pulldown");

    writeFile(path.join(root, record.mediaManifest.videoPath), [0, 0, 0, 18, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d, 0, 0, 0, 0]);
    writeFile(path.join(root, record.mediaManifest.previewPath), [0x1a, 0x45, 0xdf, 0xa3, 0, 0, 0, 0]);
    writeFile(path.join(root, record.mediaManifest.posterPath), Buffer.from("RIFFxxxxWEBPVP8 ", "ascii"));

    const output = path.join(root, "review", "board.html");
    const model = buildReviewBoardModel([record], { mediaRoot: root, output });
    const html = renderAssetReviewBoard([record], { mediaRoot: root, output });

    expect(model.readyCount).toBe(1);
    expect(model.report.ok).toBe(true);
    expect(html).toContain("<video");
    expect(html).toContain('type="video/webm"');
    expect(html).toContain('type="video/mp4"');
    expect(html).toContain("1/1 exercises ready");
    expect(html).toContain("setup: 0-20%");
  });

  it("formats byte sizes for Claude-readable review labels", () => {
    expect(bytesLabel(0)).toBe("0 B");
    expect(bytesLabel(1536)).toBe("2 KB");
    expect(bytesLabel(2.5 * 1024 * 1024)).toBe("2.50 MB");
  });
});
