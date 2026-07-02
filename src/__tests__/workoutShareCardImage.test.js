import {
  buildWorkoutShareCardSvg,
  svgToDataUrl,
} from "../workouts/presentation/tab/progress/workoutShareCardImage";

describe("workout share card image exporter", () => {
  it("builds a branded 4:5 SVG without private data", () => {
    const svg = buildWorkoutShareCardSvg({
      type: "workout_summary",
      title: "Upper Body Session",
      subtitle: "3 exercises · 42 min",
      metrics: [
        { label: "Volume", value: "2800 kg" },
        { label: "Points", value: "65" },
      ],
      highlights: ["Bench Press", "Lat Pulldown"],
      privateNotes: "do not leak",
    });

    expect(svg).toContain('width="1080"');
    expect(svg).toContain('height="1350"');
    expect(svg).toContain("#FF6B35");
    expect(svg).toContain("TRIBELOG");
    expect(svg).toContain("Upper Body");
    expect(svg).not.toContain("do not leak");
  });

  it("escapes card text before putting it into svg markup", () => {
    const svg = buildWorkoutShareCardSvg({
      type: "workout_summary",
      title: "Lift <script>alert(1)</script>",
      subtitle: "Safe & strong",
      metrics: [{ label: "Volume", value: "1000 kg" }],
      highlights: ["Chest > arms"],
    });

    expect(svg).toContain("&lt;script&gt;");
    expect(svg).toContain("Safe &amp; strong");
    expect(svg).toContain("Chest &gt; arms");
    expect(svg).not.toContain("<script>");
  });

  it("creates an svg data url", () => {
    const svg = buildWorkoutShareCardSvg({ title: "Workout" });
    const dataUrl = svgToDataUrl(svg);

    expect(dataUrl).toMatch(/^data:image\/svg\+xml;charset=utf-8,/);
    expect(decodeURIComponent(dataUrl)).toContain("Workout");
  });
});
