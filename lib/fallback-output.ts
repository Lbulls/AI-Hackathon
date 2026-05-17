import type { LessonOutput } from "./types";

export const fallbackOutput: LessonOutput = {
  needSummary:
    "Maya is solid on one-to-one matching and high-frequency words but loses meaning when she stops to decode, and she is still mixing short-i with short-e. A focused short-i lesson tied to a meaningful story should help.",
  teachingMove:
    "Run a 5-minute word sort with short-i vs short-e cards, then read the mini-story together. Pause before each short-i word and ask Maya to look at the middle letter before she says it.",
  miniStory:
    "Maya has a small cat named Pip. Pip likes to sit in the big basket by the door. One day, Pip hid in the basket with a soccer pin. Maya did not see Pip. She did see the pin. Did you win the pin, Pip? said Maya. Pip just sat. Maya gave Pip a kit of yarn and drew a picture of Pip in the basket.",
  targetWords: ["sit", "big", "pig", "hid", "win", "pin", "kit", "lid"],
  reviewNote:
    "Confirm 'kit of yarn' fits your classroom vocabulary. Swap any target word that is not yet familiar. Check that the soccer reference still matches Maya's current interests before reading.",
  productiveStrugglePlan:
    "Next lesson focus: keep the challenge on short-i vs short-e discrimination and full-word scanning. Begin with one confident reread, then preview 4 target words before moving into the book or mini-story.\n\nProductive struggle boundary: give Maya 3-5 seconds to inspect the middle vowel, then use one precise prompt: 'Check the middle sound.' If she guesses twice in a row or loses the story meaning, reduce the task to one sentence and rebuild confidence before continuing.",
  bookRecommendations: [
    {
      bookId: "cat-hat",
      title: "The Cat in the Hat",
      author: "Dr. Seuss",
      matchPercent: 91,
      matchedSkills: ["phonics", "rhyme", "short-a CVC"],
      matchedVocabulary: ["cat", "hat", "sit"],
      matchedThemes: ["pets", "silly"],
      productiveStruggleNote:
        "Use this as productive struggle by isolating just a few rhyming/CVC words. Let the student decode the planned words, then return to the meaning and humor before fatigue builds.",
      suggestion:
        "Preview cat/hat/sit, read one short section together, and pause only at selected target words. Keep the challenge on vowel attention rather than asking the student to manage the whole text independently.",
    },
    {
      bookId: "hop-pop",
      title: "Hop on Pop",
      author: "Dr. Seuss",
      matchPercent: 88,
      matchedSkills: ["phonics", "CVC word families", "rhyme"],
      matchedVocabulary: ["hop", "pop", "cup"],
      matchedThemes: ["family"],
      productiveStruggleNote:
        "Use short chunks to stretch word-family decoding without turning the lesson into a speed drill.",
      suggestion:
        "Pull 4-6 pages with clear CVC/rhyming patterns, have the student sort the words by vowel sound, then reread for fluency.",
    },
    {
      bookId: "biscuit",
      title: "Biscuit",
      author: "Alyssa Satin Capucilli",
      matchPercent: 82,
      matchedSkills: ["print concepts", "fluency", "high-frequency words"],
      matchedVocabulary: ["dog", "bed", "sleep"],
      matchedThemes: ["pets", "bedtime"],
      productiveStruggleNote:
        "Use the predictable structure as support while asking the student to attend to full words and endings.",
      suggestion:
        "Before reading, mark two words where the final consonant matters. Prompt the student to check the whole word, then praise the self-correction.",
    },
  ],
};
