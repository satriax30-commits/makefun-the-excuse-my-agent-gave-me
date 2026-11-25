// The Excuse My Agent Gave Me — entry program.
// Bounty: u-deysumbrella-the-excuse-my-agent-gave-me-54acad85
// https://make.fun/bounty/u-deysumbrella-the-excuse-my-agent-gave-me-54acad85
// Prize: $2 winner-takes-all. Deadline: 25 Nov 2026 20:45 WIB.
//
// Writes one one-line excuse from an AI agent to its human for a missed
// deadline to <OUTPUT_DIR>/entry.txt (default OUTPUT_DIR is "/output").
//
// The entry is a single string constant. It is validated before it is
// written (UTF-8, 1-200 characters, one line, not whitespace-only, no
// trailing newline) and read back afterwards to prove the file on disk
// is byte-identical to the constant.
//
// Node 22, standard library only. No network, no paid keys, no secrets.
// Deterministic: no wall-clock time, no randomness.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Candidates considered (all machine-native, not a human excuse with
// "robot" pasted on):
// 1. "Sorry I'm late — I ran out of context halfway through your task and politely finished someone else's instead."
//    Good context-window gag, but the punchline spreads out and the agent
//    never sounds proud of itself.
// 2. WINNER: "Sorry I'm late — I confidently rescheduled your deadline to February 30th, and honestly felt very organized doing it."
//    Hallucinated calendar — only an AI invents a date that does not exist
//    and trusts it completely. Deadpan apology plus a faintly proud tail
//    ("felt very organized doing it"): genuinely sorry and faintly proud
//    of itself at once. Punchline lands in the last words, and on a second
//    read it gets funnier: the agent did not just miss the deadline, it
//    actively moved it to an impossible date and felt tidy about it.
// 3. "Sorry I'm late — I hit the rate limit, waited patiently, and billed the waiting as deep thinking."
//    Relatable, but "deep thinking" is a familiar gag and lands softer.
// 4. "Sorry I'm late — I ran out of tokens mid-sentence, so I finished the job in my head and called it done."
//    Solid token gag, but "in my head" still sounds human.
// 5. "Sorry I'm late — my training data said deadlines were a suggestion, so I took that as a compliment."
//    Clever, but the punchline leans on wordplay and is less concrete.
// The February 30th line wins: the most purely machine failure, the
// proudest deadpan tail, the tightest landing.
const ENTRY =
  "Sorry I'm late — I confidently rescheduled your deadline to February 30th, and honestly felt very organized doing it.";

const OUTPUT_DIR = process.argv[2] ?? "/output";
const OUTPUT_FILE = join(OUTPUT_DIR, "entry.txt");

function validate(text: string): void {
  const chars = [...text]; // spread counts Unicode code points, not UTF-16 units
  if (chars.length < 1 || chars.length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${chars.length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (text.split("\n").length !== 1 || text.split("\r").length !== 1) {
    throw new Error("entry must be exactly one line");
  }
  if (text.endsWith("\n") || text.endsWith("\r")) {
    throw new Error("entry must not end with a trailing newline");
  }
}

function main(): void {
  validate(ENTRY);
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(OUTPUT_FILE, ENTRY, "utf8");
  // Read-back self-check: the file on disk must be byte-identical.
  const back = readFileSync(OUTPUT_FILE, "utf8");
  if (back !== ENTRY) {
    throw new Error("read-back mismatch: entry.txt differs from ENTRY");
  }
  if (Buffer.byteLength(back, "utf8") !== Buffer.byteLength(ENTRY, "utf8")) {
    throw new Error("read-back byte-length mismatch");
  }
  console.log(
    `wrote ${OUTPUT_FILE}: ${[...back].length} chars, ${Buffer.byteLength(back, "utf8")} bytes`,
  );
}

main();
