import { describe, it, expect } from "vitest";
import { analyzePassword } from "../passwordAnalyzer";

describe("analyzePassword", () => {
  it("scores a common weak password very low", () => {
    const result = analyzePassword("password");
    expect(result.checks.notCommonPassword).toBe(false);
    expect(result.score).toBeLessThan(20);
    expect(result.strength).toBe("Very Weak");
  });

  it("detects sequential patterns", () => {
    const result = analyzePassword("abcd1234efgh");
    expect(result.checks.noSequentialPattern).toBe(false);
  });

  it("detects keyboard walks", () => {
    const result = analyzePassword("qwertyUIOP99");
    expect(result.checks.noKeyboardPattern).toBe(false);
  });

  it("detects repeated character runs", () => {
    const result = analyzePassword("aaaaBBBB1234");
    expect(result.checks.noRepeatedCharacters).toBe(false);
  });

  it("scores a long random passphrase as strong or very strong", () => {
    const result = analyzePassword("Correct-Horse-Battery-Staple-42!");
    expect(result.checks.length12).toBe(true);
    expect(["Strong", "Very Strong"]).toContain(result.strength);
  });

  it("never returns a score outside 0-100", () => {
    const result = analyzePassword("");
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("provides a why/how explanation for every weakness", () => {
    const result = analyzePassword("123456");
    for (const w of result.weaknesses) {
      expect(w.whyItMatters.length).toBeGreaterThan(0);
      expect(w.howToImprove.length).toBeGreaterThan(0);
    }
  });
});
