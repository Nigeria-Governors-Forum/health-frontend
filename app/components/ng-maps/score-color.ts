import { scaleLinear } from "d3-scale";

export function scoreColorScale() {
  return scaleLinear<string>()
    .domain([20, 40, 55, 70, 85, 100])
    .range(["#fef3c7", "#fde68a", "#86efac", "#4ade80", "#16a34a", "#005031"])
    .clamp(true);
}

export function scoreColor(score: number): string {
  return scoreColorScale()(score);
}
