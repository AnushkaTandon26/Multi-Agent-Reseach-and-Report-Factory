import { describe, it, expect } from "vitest";
import { SEARCHER_DIVERSITY_FACTOR } from "../src/lib/agents/searcher";
import { FACT_EXTRACTION_CONFIDENCE_THRESHOLD } from "../src/lib/agents/reader";
import { REPLAN_CONFIDENCE_BENCHMARK } from "../src/lib/agents/critic";

describe("Multi-Agent Critic Feedback Loop Suite", () => {
  it("verifies diversity factor and confidence threshold invariants", () => {
    expect(SEARCHER_DIVERSITY_FACTOR).toBeGreaterThan(0.8);
    expect(FACT_EXTRACTION_CONFIDENCE_THRESHOLD).toBe(0.70);
    expect(REPLAN_CONFIDENCE_BENCHMARK).toBe(80);
  });
});
