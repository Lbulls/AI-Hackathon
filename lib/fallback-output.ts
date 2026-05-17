import type { LessonOutput } from "./types";

export const fallbackOutput: LessonOutput = {
  reasoning: {
    observations: [
      {
        behavior: "vowel_confusion",
        evidence: "teacher reports Maya reads 'ben' for 'bin'",
      },
      {
        behavior: "omits_word_endings",
        evidence: "drops the ending sound on CVC words",
      },
      {
        behavior: "weak_self_monitoring",
        evidence:
          "loses meaning when she stops to sound out, though she self-corrects when prompted",
      },
      {
        behavior: "frustration_after_errors",
        evidence: "gets stuck when decoding stalls",
      },
      {
        behavior: "rereads_independently",
        evidence: "willingly rereads when asked",
      },
    ],
    reading_processes: [
      {
        process: "weak_orthographic_mapping",
        confidence: 0.7,
        reasoning:
          "Short-i / short-e substitution suggests the medial vowel is not yet anchored.",
      },
      {
        process: "emerging_self_monitoring",
        confidence: 0.6,
        reasoning:
          "She catches meaning breaks but only after the fact, not in the moment.",
      },
      {
        process: "limited_decoding_stamina",
        confidence: 0.5,
        reasoning:
          "Accuracy is solid at Level 8 but effort cost spikes on harder words.",
      },
    ],
    instructional_goals: [
      {
        goal: "strengthen_vowel_discrimination",
        why: "Short-i vs short-e is the highest-leverage next step given the substitution pattern.",
      },
      {
        goal: "increase_attention_to_word_endings",
        why: "Pair with the vowel work so Maya scans the whole word, not just the onset.",
      },
    ],
    lesson_constraints: {
      target_phonics_patterns: [
        "short-i CVC (sit, big, pig, hid, win, pin, kit, lid)",
        "short-e contrast set (pen, hen, bed)",
      ],
      sentence_complexity: "4–7 words, mostly simple subject-verb-object",
      vocabulary_control:
        "only kindergarten high-frequency words plus the target CVC words",
      picture_predictability:
        "low — pictures should support meaning but not reveal target words",
      recommended_prompting_style: [
        "Look at the middle letter.",
        "What sound does it make?",
        "Does that look right and sound right?",
      ],
      targeted_reading_behaviors: [
        "full-word scan left-to-right",
        "attention to medial vowel",
        "attention to final consonant",
      ],
      engagement_hooks: ["cats", "soccer", "drawing"],
    },
  },
  sections: {
    "What I Noticed":
      "- vowel_confusion — teacher reports Maya reads 'ben' for 'bin'\n- omits_word_endings — drops the ending sound on CVC words\n- weak_self_monitoring — loses meaning when she stops to sound out, though she does self-correct when prompted\n- frustration_after_errors — \"started saying 'I'm not a good reader' before lessons\"\n- rereads_independently — \"rereads when prompted\"",
    "Likely Reading Processes":
      "- weak_orthographic_mapping for short vowels (confidence ~0.7) — short-i/short-e substitution suggests the medial vowel is not yet anchored\n- emerging_self_monitoring (confidence ~0.6) — she catches meaning breaks but only after the fact\n- limited_decoding_stamina (confidence ~0.5) — accuracy is solid at Level 8 but effort cost spikes on harder words",
    "Recommended Instructional Focus":
      "1. strengthen_vowel_discrimination — short-i vs short-e is the highest-leverage next step given the substitution pattern.\n2. increase_attention_to_word_endings — pair with the vowel work so Maya scans the whole word, not just the onset.",
    "Lesson Constraints":
      "- target_phonics_patterns: short-i CVC (sit, big, pig, hid, win, pin, kit, lid); contrast set with short-e (pen, hen, bed)\n- sentence_complexity: 4–7 words, mostly simple subject-verb-object\n- vocabulary_control: only kindergarten high-frequency words plus target CVC words\n- picture_predictability: low — pictures should support meaning but not reveal target words\n- recommended_prompting_style: 'Look at the middle letter.' / 'What sound does it make?' / 'Does that look right and sound right?'\n- targeted_reading_behaviors: full-word scan left-to-right, attention to medial vowel and final consonant\n- engagement_hooks: cats, soccer, drawing",
    "Mini Lesson":
      "5 minutes word work: short-i vs short-e sort (pin/pen, bin/Ben, hid/head). Maya names the middle sound before placing each card.\n10 minutes shared reading of the decodable story below. Pause before each highlighted short-i word; cue Maya to look at the middle letter, then read.\n5 minutes writing extension (see below).",
    "Decodable Story":
      "Maya has a cat named Pip. Pip likes to sit in the big basket. One day Pip hid in the basket. Maya did not see Pip. She did see a pin. Maya gave Pip a kit of yarn.",
    "Teacher Prompts":
      "- Before a target word: 'Look at the middle letter — what sound?'\n- After a substitution: 'Try that again. Does it look right?'\n- On a self-correction: 'I noticed you fixed that. How did you know?'\n- On a stall: 'Get your mouth ready for the first sound, then check the middle.'",
    "Word Work":
      "Picture sort: 6 short-i cards (pin, pig, lid, kid, sit, win) vs 6 short-e cards (pen, hen, bed, web, ten, red). Maya says the word, isolates the middle sound, then places the card. Finish by writing two short-i words and two short-e words from memory.",
    "Writing Extension":
      "Maya draws a picture of Pip in the basket. Underneath, she writes one sentence using at least two short-i words from the target list. Teacher scaffolds by saying the sentence slowly and pointing to each word as Maya writes.",
  },
};
