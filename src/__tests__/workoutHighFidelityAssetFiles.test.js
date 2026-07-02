const fs = require("fs");
const os = require("os");
const path = require("path");
const {
  checkAssetFile,
  isMp4,
  isWebm,
  isWebp,
  parseFrameRate,
  validateVideoMetadata,
  verifyAssetFiles,
} = require("../../scripts/verify-workout-high-fidelity-asset-files");
const {
  buildHighFidelityUploadManifest,
} = require("../../scripts/build-workout-high-fidelity-upload-manifest");

function writeFile(filePath, bytes) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, Buffer.from(bytes));
}

function mediaRecord(id = "goblet_squat") {
  return {
    id,
    mediaManifest: {
      videoPath: `workouts/exercises/v2/${id}/demo.mp4`,
      previewPath: `workouts/exercises/v2/${id}/demo.webm`,
      posterPath: `workouts/exercises/v2/${id}/poster.webp`,
    },
  };
}

describe("high-fidelity asset file verification", () => {
  it("recognizes MP4, WebM, and WebP headers", () => {
    expect(isMp4(Buffer.from([0, 0, 0, 18, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d]))).toBe(true);
    expect(isWebm(Buffer.from([0x1a, 0x45, 0xdf, 0xa3, 0, 0, 0, 0]))).toBe(true);
    expect(isWebp(Buffer.from("RIFFxxxxWEBPVP8 ", "ascii"))).toBe(true);
  });

  it("validates video metadata for duration, resolution, and frame rate", () => {
    expect(parseFrameRate("30000/1000")).toBe(30);
    expect(validateVideoMetadata({
      streams: [{ width: 1280, height: 720, r_frame_rate: "30/1" }],
      format: { duration: "3.41" },
    }, {
      durationMs: 3400,
      frameRate: 30,
    })).toMatchObject({
      ok: true,
      width: 1280,
      height: 720,
      durationMs: 3410,
      frameRate: 30,
    });

    expect(validateVideoMetadata({
      streams: [{ width: 320, height: 180, r_frame_rate: "24/1" }],
      format: { duration: "7.00" },
    }, {
      durationMs: 3400,
      frameRate: 30,
    })).toMatchObject({
      ok: false,
    });
  });

  it("accepts real-looking files under the size budgets", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "tribelog-media-"));
    const record = mediaRecord();

    writeFile(path.join(root, record.mediaManifest.videoPath), [0, 0, 0, 18, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d, 0, 0, 0, 0]);
    writeFile(path.join(root, record.mediaManifest.previewPath), [0x1a, 0x45, 0xdf, 0xa3, 0, 0, 0, 0]);
    writeFile(path.join(root, record.mediaManifest.posterPath), Buffer.from("RIFFxxxxWEBPVP8 ", "ascii"));

    const report = verifyAssetFiles([record], { mediaRoot: root, requireFiles: true });
    expect(report.ok).toBe(true);
    expect(report.failures).toEqual([]);
  });

  it("builds standard upload manifest entries after file verification passes", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "tribelog-media-"));
    const record = mediaRecord("lat_pulldown");

    writeFile(path.join(root, record.mediaManifest.videoPath), [0, 0, 0, 18, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d, 0, 0, 0, 0]);
    writeFile(path.join(root, record.mediaManifest.previewPath), [0x1a, 0x45, 0xdf, 0xa3, 0, 0, 0, 0]);
    writeFile(path.join(root, record.mediaManifest.posterPath), Buffer.from("RIFFxxxxWEBPVP8 ", "ascii"));

    const uploadManifest = buildHighFidelityUploadManifest([record], {
      mediaRoot: root,
      repoRoot: root,
    });

    expect(uploadManifest).toHaveLength(3);
    expect(uploadManifest.map((entry) => entry.contentType)).toEqual([
      "video/mp4",
      "video/webm",
      "image/webp",
    ]);
    uploadManifest.forEach((entry) => {
      expect(entry.exerciseId).toBe("lat_pulldown");
      expect(entry.storagePath).toMatch(/^workouts\/exercises\/v2\/lat_pulldown\//);
      expect(entry.localPath).toMatch(/^workouts\/exercises\/v2\/lat_pulldown\//);
      expect(entry.sha256).toHaveLength(64);
    });
  });

  it("rejects placeholders and missing files in release-gate mode", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "tribelog-media-"));
    const record = mediaRecord("push_up");
    writeFile(path.join(root, record.mediaManifest.videoPath), Buffer.from("placeholder video", "utf8"));

    expect(checkAssetFile(path.join(root, record.mediaManifest.videoPath), "mp4", 1024)).toMatchObject({
      ok: false,
      reason: "invalid mp4 header",
    });
    expect(() => verifyAssetFiles([record], { mediaRoot: root, requireFiles: true })).toThrow(/invalid mp4 header/);
    expect(() => verifyAssetFiles([record], { mediaRoot: root, requireFiles: true })).toThrow(/missing/);
  });
});
