const fs = require("fs");
const os = require("os");
const path = require("path");
const {
  buildReadinessReport,
} = require("../../scripts/write-workout-high-fidelity-readiness-report");

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

describe("high-fidelity readiness report", () => {
  it("reports missing assets without marking the exercise ready", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "tribelog-readiness-"));
    const report = buildReadinessReport([mediaRecord()], { mediaRoot: root });

    expect(report.ok).toBe(false);
    expect(report.readyExercises).toBe(0);
    expect(report.totalExercises).toBe(1);
    expect(report.exercises[0].ready).toBe(false);
    expect(report.exercises[0].files).toHaveLength(3);
    expect(report.exercises[0].files.every((file) => file.reason === "missing")).toBe(true);
  });

  it("reports exercises ready when MP4, WebM, and poster pass file checks", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "tribelog-readiness-"));
    const record = mediaRecord("push_up");

    writeFile(path.join(root, record.mediaManifest.videoPath), [0, 0, 0, 18, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d, 0, 0, 0, 0]);
    writeFile(path.join(root, record.mediaManifest.previewPath), [0x1a, 0x45, 0xdf, 0xa3, 0, 0, 0, 0]);
    writeFile(path.join(root, record.mediaManifest.posterPath), Buffer.from("RIFFxxxxWEBPVP8 ", "ascii"));

    const report = buildReadinessReport([record], { mediaRoot: root });

    expect(report.ok).toBe(true);
    expect(report.readyExercises).toBe(1);
    expect(report.exercises[0]).toMatchObject({
      id: "push_up",
      ready: true,
    });
    expect(report.exercises[0].files.map((file) => file.kind)).toEqual(["mp4", "webm", "poster"]);
    expect(report.exercises[0].files.every((file) => file.ready)).toBe(true);
  });
});
