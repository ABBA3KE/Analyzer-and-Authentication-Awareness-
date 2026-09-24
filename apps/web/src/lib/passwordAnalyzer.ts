/**
 * passwordAnalyzer.ts
 *
 * SECURITY REQUIREMENT: this module runs entirely in the browser.
 * The password passed into analyzePassword() is never sent to a server,
 * never logged, never persisted, and never transmitted anywhere.
 * Do not import this module from any file that calls fetch()/axios/etc.
 *
 * This produces a HEURISTIC educational score, not a scientifically exact
 * measurement of real-world cracking resistance.
 */

import { COMMON_PASSWORDS } from "./commonPasswords";

export type StrengthLabel = "Very Weak" | "Weak" | "Fair" | "Strong" | "Very Strong";

export interface PasswordChecks {
  length12: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
  noRepeatedCharacters: boolean;
  noSequentialPattern: boolean;
  noKeyboardPattern: boolean;
  notCommonPassword: boolean;
  notCommonName: boolean;
}

export interface Weakness {
  id: string;
  title: string;
  whyItMatters: string;
  howToImprove: string;
}

export interface PasswordAnalysis {
  score: number; // 0-100
  strength: StrengthLabel;
  entropy: number; // estimated bits
  length: number;
  checks: PasswordChecks;
  weaknesses: Weakness[];
  recommendations: string[];
}

const KEYBOARD_ROWS = [
  "qwertyuiop",
  "asdfghjkl",
  "zxcvbnm",
  "1234567890",
];

const COMMON_NAMES = [
  "john", "james", "michael", "david", "daniel", "mary", "grace",
  "chidi", "amaka", "tunde", "bola", "emeka", "ngozi", "sarah",
  "student", "admin",
];

function hasSequential(pw: string, minRun = 4): boolean {
  const lower = pw.toLowerCase();
  for (let i = 0; i <= lower.length - minRun; i++) {
    let ascending = true;
    let descending = true;
    for (let j = 1; j < minRun; j++) {
      const prev = lower.charCodeAt(i + j - 1);
      const cur = lower.charCodeAt(i + j);
      if (cur !== prev + 1) ascending = false;
      if (cur !== prev - 1) descending = false;
    }
    if (ascending || descending) return true;
  }
  return false;
}

function hasKeyboardWalk(pw: string, minRun = 4): boolean {
  const lower = pw.toLowerCase();
  for (const row of KEYBOARD_ROWS) {
    for (let i = 0; i <= row.length - minRun; i++) {
      const segment = row.slice(i, i + minRun);
      const reversed = segment.split("").reverse().join("");
      if (lower.includes(segment) || lower.includes(reversed)) return true;
    }
  }
  return false;
}

function hasRepeatedRun(pw: string, minRun = 4): boolean {
  let run = 1;
  for (let i = 1; i < pw.length; i++) {
    if (pw[i] === pw[i - 1]) {
      run += 1;
      if (run >= minRun) return true;
    } else {
      run = 1;
    }
  }
  return false;
}

function includesCommonName(pw: string): boolean {
  const lower = pw.toLowerCase();
  return COMMON_NAMES.some((n) => lower.includes(n));
}

function estimateEntropy(pw: string): number {
  if (!pw) return 0;
  let poolSize = 0;
  if (/[a-z]/.test(pw)) poolSize += 26;
  if (/[A-Z]/.test(pw)) poolSize += 26;
  if (/[0-9]/.test(pw)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) poolSize += 32;
  if (poolSize === 0) return 0;
  return Math.round(pw.length * Math.log2(poolSize) * 10) / 10;
}

function scoreToStrength(score: number): StrengthLabel {
  if (score < 20) return "Very Weak";
  if (score < 40) return "Weak";
  if (score < 60) return "Fair";
  if (score < 80) return "Strong";
  return "Very Strong";
}

export function analyzePassword(password: string): PasswordAnalysis {
  const pw = password ?? "";
  const lowerPw = pw.toLowerCase();

  const checks: PasswordChecks = {
    length12: pw.length >= 12,
    uppercase: /[A-Z]/.test(pw),
    lowercase: /[a-z]/.test(pw),
    number: /[0-9]/.test(pw),
    special: /[^a-zA-Z0-9]/.test(pw),
    noRepeatedCharacters: !hasRepeatedRun(pw),
    noSequentialPattern: !hasSequential(pw),
    noKeyboardPattern: !hasKeyboardWalk(pw),
    notCommonPassword: !COMMON_PASSWORDS.has(lowerPw),
    notCommonName: !includesCommonName(pw),
  };

  const entropy = estimateEntropy(pw);

  // Weighted heuristic score. Length and entropy dominate; pattern/common
  // password checks apply penalties. This is intentionally simple and
  // transparent rather than a black box.
  let score = 0;
  if (pw.length > 0) {
    score += Math.min(40, pw.length * 3); // up to 40 pts for length
    score += Math.min(30, entropy / 2.5); // up to ~30 pts for entropy/diversity
    const varietyCount = [checks.uppercase, checks.lowercase, checks.number, checks.special].filter(Boolean).length;
    score += varietyCount * 5; // up to 20 pts for variety

    if (!checks.noRepeatedCharacters) score -= 15;
    if (!checks.noSequentialPattern) score -= 15;
    if (!checks.noKeyboardPattern) score -= 15;
    if (!checks.notCommonPassword) score = Math.min(score, 10); // hard cap
    if (!checks.notCommonName) score -= 10;
    if (pw.length < 8) score = Math.min(score, 25);
  }
  score = Math.max(0, Math.min(100, Math.round(score)));

  const weaknesses: Weakness[] = [];

  if (!checks.length12) {
    weaknesses.push({
      id: "length",
      title: "Short password",
      whyItMatters: "Short passwords have far fewer possible combinations, so they can be guessed or checked much faster.",
      howToImprove: "Use a longer passphrase made from several unrelated words — aim for at least 12–16 characters.",
    });
  }
  if (!checks.notCommonPassword) {
    weaknesses.push({
      id: "common",
      title: "Matches a widely used password",
      whyItMatters: "Extremely common passwords are the very first ones automated guessing tools try.",
      howToImprove: "Choose something unique to you that isn't a well-known word or phrase.",
    });
  }
  if (!checks.noSequentialPattern) {
    weaknesses.push({
      id: "sequential",
      title: "Contains a sequential pattern",
      whyItMatters: "Sequences like '1234' or 'abcd' are predictable and add very little real randomness.",
      howToImprove: "Break up sequences with unrelated words or numbers instead of counting up or down.",
    });
  }
  if (!checks.noKeyboardPattern) {
    weaknesses.push({
      id: "keyboard",
      title: "Contains a keyboard pattern",
      whyItMatters: "Patterns like 'qwerty' follow the physical keyboard layout and are checked early by guessing tools.",
      howToImprove: "Avoid adjacent-key sequences; use unrelated characters instead.",
    });
  }
  if (!checks.noRepeatedCharacters) {
    weaknesses.push({
      id: "repeated",
      title: "Contains repeated characters",
      whyItMatters: "Long runs of the same character (e.g. 'aaaa') reduce the effective randomness of the password.",
      howToImprove: "Avoid repeating the same character more than two or three times in a row.",
    });
  }
  if (!checks.notCommonName) {
    weaknesses.push({
      id: "name",
      title: "May contain a common name",
      whyItMatters: "Names are often discoverable from social media and are commonly tried in targeted guessing.",
      howToImprove: "Avoid your own name, friends' names, or other personal identifiers.",
    });
  }
  if (!checks.special || !checks.uppercase || !checks.lowercase || !checks.number) {
    weaknesses.push({
      id: "variety",
      title: "Limited character variety",
      whyItMatters: "Using only one type of character (e.g. only lowercase letters) shrinks the pool of possible combinations.",
      howToImprove: "Mix uppercase, lowercase, numbers, and symbols, or use a longer multi-word passphrase instead.",
    });
  }

  const recommendations = [
    "Avoid personal information such as your name, birthday, or student ID.",
    "Never reuse this password on another site or system.",
    "Prefer a long passphrase of unrelated words over a short complex string.",
    "Enable multi-factor authentication wherever it's offered.",
  ];

  return {
    score,
    strength: scoreToStrength(score),
    entropy,
    length: pw.length,
    checks,
    weaknesses,
    recommendations,
  };
}

