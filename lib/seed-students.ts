import { daysAgoISO } from "./format";
import type { Student } from "./types";

export const SEED_STUDENTS: Student[] = [
  {
    id: "maya",
    name: "Maya",
    grade: "1st",
    interests: "cats, soccer, drawing",
    context:
      "Comes in tired on Mondays after weekend soccer tournaments. Wears glasses — make sure she's sitting close to the text. Bilingual at home (Spanish/English).",
    scheduledTime: "09:00",
    sessions: [
      {
        id: "s-maya-1",
        date: daysAgoISO(5),
        notes: {
          strengths:
            "Strong one-to-one matching. Recognizes most kindergarten high-frequency words.",
          struggles:
            "Drops final consonants on CVC words. Substitutes short-e for short-i.",
          targetPattern: "Short-i CVC words",
          notes: "Running record at Level 7. 90% accuracy. Reread willingly.",
        },
        approved: true,
      },
      {
        id: "s-maya-2",
        date: daysAgoISO(2),
        notes: {
          strengths:
            "Self-corrected three times today when meaning broke down. Beautiful return-sweep.",
          struggles:
            "Still confusing 'bin/Ben' and 'pin/pen'. Slowed way down on multi-syllable words.",
          targetPattern: "Short-i CVC words",
          notes: "Level 8 attempt next week if short-i lands. 92% accuracy today.",
        },
        approved: true,
      },
    ],
  },
  {
    id: "eli",
    name: "Eli",
    grade: "K",
    interests: "dinosaurs, trucks, building things",
    context:
      "Newly assessed. First running record was last week. Very verbal — strong oral language vocabulary. ELL: home language is Mandarin.",
    scheduledTime: "09:30",
    sessions: [
      {
        id: "s-eli-1",
        date: daysAgoISO(3),
        notes: {
          strengths:
            "Loves predicting from pictures. Knows every consonant sound in isolation.",
          struggles:
            "Doesn't yet hear the medial vowel sound. Reads 'cat' as 'c-t'.",
          targetPattern: "Hearing and recording medial short-a sounds",
          notes:
            "Elkonin boxes worked well for /a/. Try /i/ next session once short-a is solid.",
        },
        approved: true,
      },
    ],
  },
  {
    id: "soraya",
    name: "Soraya",
    grade: "1st",
    interests: "horses, baking with grandma, jump rope",
    context:
      "Has been with us all year. Has made strong gains. Tends to memorize text and 'read' it back without looking — watch for finger-pointing slipping.",
    scheduledTime: "10:00",
    sessions: [
      {
        id: "s-soraya-1",
        date: daysAgoISO(8),
        notes: {
          strengths: "Fluent on familiar Level 12 texts. Great prosody.",
          struggles:
            "On unfamiliar text she over-relies on memory and skips finger-tracking.",
          targetPattern: "Maintaining 1:1 tracking on first read of new text",
          notes: "Cover words, expose one at a time to break the memorize habit.",
        },
        approved: true,
      },
      {
        id: "s-soraya-2",
        date: daysAgoISO(4),
        notes: {
          strengths:
            "Used finger consistently when prompted. Stopped at unknown words instead of guessing.",
          struggles: "Struggled with 'th' digraph — read 'the' as 't-he'.",
          targetPattern: "Digraph 'th' (the, this, that, with)",
          notes: "Pull a sort with th/sh/ch cards tomorrow.",
        },
        approved: true,
      },
      {
        id: "s-soraya-3",
        date: daysAgoISO(1),
        notes: {
          strengths: "Digraph 'th' is sticking. Read 'this' and 'that' cleanly.",
          struggles: "Still drops the digraph at the END of words: 'with' → 'wit'.",
          targetPattern: "Final 'th' (with, math, both, path)",
          notes: "Try a story with several final-th words tomorrow.",
        },
        approved: true,
      },
    ],
  },
  {
    id: "marcus",
    name: "Marcus",
    grade: "2nd",
    interests: "basketball, comic books, drawing superheroes",
    context:
      "Repeating 2nd grade this year. Has had a rough start — be encouraging, especially about decoding wins. Strong artist — draw a picture together as a reward.",
    scheduledTime: "10:30",
    sessions: [
      {
        id: "s-marcus-1",
        date: daysAgoISO(6),
        notes: {
          strengths:
            "Knows all his letter sounds and most short vowels. Will tackle long words.",
          struggles:
            "Reads through the punctuation. No pause at periods. Comprehension drops as a result.",
          targetPattern: "End punctuation — stopping at periods, voice down",
          notes:
            "Try modeled echo reading with a familiar comic-style text. Use his interest.",
        },
        approved: true,
      },
      {
        id: "s-marcus-2",
        date: daysAgoISO(2),
        notes: {
          strengths:
            "Stopped at 4 of 6 periods in the modeled reading today. Big win.",
          struggles:
            "When stopping at periods, loses his place. Eyes drift across line break.",
          targetPattern: "Periods + return sweep on multi-line text",
          notes: "Bookmark trick (slide it down line by line) worked. Try again.",
        },
        approved: true,
      },
    ],
  },
];
