// Worked examples baked into SYSTEM_PROMPT. Each example was hand-checked
// against the validator: target phonics words appear in the Decodable Story,
// no sentence exceeds 12 words, picks 1-2 (not more) instructional goals,
// references the student's interests by name.

const EXAMPLE_JAVIER_INPUT = `Teacher observation notes for ONE student. Reason through the full 5-step pipeline, then return your response in TWO parts: a \`\`\`json reasoning block, then the nine FINAL OUTPUT FORMAT markdown sections.

Student name: Javier
Grade: 2nd
Target sound or pattern for this week: Long vowel silent-e patterns, fluency
Student interests: soccer, sharks, video games

Reading strengths the teacher has observed:
Strong decoding stamina. Willing to attempt difficult words independently. No longer reliant on pictures; consistently looks through the word visually before responding. Decodes most CVC and CVCE patterns accurately. Strong oral language and rich verbal vocabulary.

Reading struggles the teacher has observed:
Reads in a fast, robotic manner without attending to punctuation or phrasing. Decoded "hope" correctly but continued through the sentence despite obvious confusion about meaning. Misses important details in retell because he focuses on "getting through" the text. Frustrated when asked to reread — perceives it as punishment.

Additional teacher notes:
Echo reading together substantially improved phrasing. Self-corrects when prompted to think about meaning — once independently reread after noticing a sentence sounded strange. Writing sample shows good phonics control but sentence construction stays simple and repetitive even though spoken language is much richer.`;

const EXAMPLE_JAVIER_OUTPUT = `\`\`\`json
{
  "observations": [
    {"behavior": "decoding_attempts", "evidence": "strong decoding stamina; willing to attempt difficult words independently"},
    {"behavior": "word_by_word_reading", "evidence": "reads in a fast, robotic manner without attending to punctuation or phrasing"},
    {"behavior": "weak_self_monitoring", "evidence": "decoded 'hope' correctly but continued through the sentence despite obvious confusion about meaning"},
    {"behavior": "frustration_after_errors", "evidence": "perceives rereading as punishment rather than support"},
    {"behavior": "rereads_independently", "evidence": "independently reread after noticing a sentence sounded strange"},
    {"behavior": "strong_oral_language", "evidence": "uses richer vocabulary verbally than in writing"}
  ],
  "reading_processes": [
    {"process": "weak_fluency_automaticity", "confidence": 0.85, "reasoning": "Decoding is accurate but reading is fast and robotic without phrasing. Fluency has not yet integrated with meaning-making."},
    {"process": "weak_self_monitoring", "confidence": 0.75, "reasoning": "Specifically for semantic monitoring — he checks letters but not whether the sentence makes sense. Self-correction is prompt-dependent."},
    {"process": "strong_orthographic_mapping", "confidence": 0.85, "reasoning": "Solid on CVC and CVCe patterns; rarely substitutes visually similar words. The decoding system itself is intact."},
    {"process": "strong_language_comprehension", "confidence": 0.8, "reasoning": "Rich verbal vocabulary and oral retell strength indicate that once meaning monitoring kicks in, comprehension will follow."}
  ],
  "instructional_goals": [
    {"goal": "improve_fluency_automaticity", "why": "Phrasing and prosody are the highest-leverage next step. Javier needs to learn that reading sounds like talking, not like word-calling."},
    {"goal": "improve_self_monitoring", "why": "Specifically for meaning. Pair the fluency work with explicit 'did that make sense?' checking so accuracy and meaning come together."}
  ],
  "lesson_constraints": {
    "target_phonics_patterns": ["long-vowel silent-e CVCe (hope, ride, bake, time, hide, late, lake, bike, side, gate, make, take, game)"],
    "sentence_complexity": "6-10 words; varied punctuation (periods, commas, question marks, dialogue) for phrasing practice",
    "vocabulary_control": "Familiar words at his independent level — fluency work needs decoding to feel easy, not stretched",
    "picture_predictability": "moderate — pictures support meaning monitoring without revealing every detail",
    "recommended_prompting_style": ["Make it sound like talking.", "Did that make sense?", "Try that sentence again smoothly — eyes on the punctuation."],
    "targeted_reading_behaviors": ["phrasing across natural chunks", "attending to punctuation", "meaning monitoring at sentence boundaries"],
    "engagement_hooks": ["soccer", "sharks", "video games"]
  }
}
\`\`\`

# What I Noticed
- decoding_attempts — strong stamina; willing to attempt difficult words independently
- word_by_word_reading — "fast, robotic manner without attending to punctuation or phrasing"
- weak_self_monitoring (for meaning) — decoded "hope" accurately but continued through obvious meaning confusion
- frustration_after_errors — perceives rereading as punishment
- rereads_independently — independently reread after noticing a sentence sounded strange
- strong_oral_language — uses richer vocabulary verbally than in writing

# Likely Reading Processes
- weak_fluency_automaticity (confidence ~0.85) — Decoding is accurate but reading is fast and robotic without phrasing. Fluency has not yet integrated with meaning-making.
- weak_self_monitoring for semantics (confidence ~0.75) — Checks letters but not whether the sentence makes sense; self-correction is prompt-dependent.
- strong_orthographic_mapping (confidence ~0.85) — Solid on CVC and CVCe patterns. The decoding system itself is intact.
- strong_language_comprehension (confidence ~0.8) — Rich verbal vocabulary; once meaning monitoring kicks in, comprehension will follow.

# Recommended Instructional Focus
1. **improve_fluency_automaticity** — Phrasing and prosody are the highest-leverage next step. Javier needs to learn that reading sounds like talking, not like word-calling.
2. **improve_self_monitoring** — Specifically for meaning. Pair the fluency work with explicit "did that make sense?" checking so accuracy and meaning come together.

# Lesson Constraints
- **Target patterns:** long-vowel silent-e CVCe (hope, ride, bake, time, hide, late, lake, bike, side, gate, make, take, game) — for continued exposure, not as the primary instructional target
- **Sentence complexity:** 6–10 words; varied punctuation (periods, commas, question marks, dialogue) to give phrasing practice
- **Vocabulary control:** familiar words at his independent level — fluency work needs decoding to feel easy, not stretched
- **Picture predictability:** moderate — pictures support meaning monitoring without revealing every detail
- **Prompting style:** "Make it sound like talking." / "Did that make sense?" / "Try that sentence again smoothly — eyes on the punctuation."
- **Behaviors to reinforce:** phrasing across natural chunks; attending to punctuation; meaning monitoring at sentence boundaries

# Mini Lesson
**3 min — Echo reading warmup.** Teacher reads the first two sentences of the decodable story below with strong phrasing and expression. Javier echoes each sentence immediately. No discussion of meaning yet — this is about pacing.

**8 min — Independent read of the full story.** Javier reads with a finger or eye-tracking aid. Teacher prompts only on phrasing ("Read to the comma, then the next chunk") and meaning ("Did that match?"). No phonics prompts.

**6 min — Reread with retell.** Javier rereads, then summarizes what happened. Teacher asks one comprehension question that requires noticing something specific in the text.

**3 min — Closing.** Name the specific phrasing improvement: "When you read 'The game is late, but Jake takes the kick,' you paused at the comma. That made it sound real."

# Decodable Story
**The Late Game**

Jake hopes to play soccer at the lake. He rides his bike past the gate. "Hide the ball!" his brother yells. Jake races to the bike rack. He has to make it on time. The game is late, but Jake takes the kick. The team wins. Jake feels great.

# Teacher Prompts
- On a robotic stretch: "Make it sound like talking. Read to the next comma."
- After a decode that breaks meaning: "Did that make sense? Try the whole sentence again."
- On a successful phrased read: "That sounded like a real story. How did you know to pause there?"
- If frustration rises on a reread: "Not a reread for accuracy — a reread because the first time was the warmup."
- On a self-correction: "You noticed something didn't sound right. What did you fix?"

# Word Work
**Phrase chunking (5 min).** Teacher writes sentences on cards with \`/\` marks at natural phrase boundaries:
- "Jake hopes / to play soccer / at the lake."
- "He rides his bike / past the gate."
Javier reads each card aloud, pausing at each \`/\`. Then teacher removes the \`/\` marks; Javier reads again, pausing in the same spots from memory.

**Punctuation roleplay (3 min).** Teacher writes the same sentence three ways: as a statement, a question, an exclamation. Javier reads each with the matching expression.

# Writing Extension
Javier writes 2–3 sentences about a soccer game using varied punctuation (at least one question or exclamation). The goal is **sentence variety**, not phonics — encourage him to use the richer vocabulary he uses verbally. Teacher prompt: "Read what you wrote out loud. Does it sound like you're talking?"`;

const EXAMPLE_ELIJAH_INPUT = `Teacher observation notes for ONE student. Reason through the full 5-step pipeline, then return your response in TWO parts: a \`\`\`json reasoning block, then the nine FINAL OUTPUT FORMAT markdown sections.

Student name: Elijah
Grade: 1st
Target sound or pattern for this week: Consonant blends, phoneme segmentation
Student interests: dinosaurs, trucks, superheroes

Reading strengths the teacher has observed:
Knows letter names and most letter sounds. Engagement picks up significantly when the topic is dinosaurs. Persistence after encouragement is a real strength — once he succeeded with "stop" today, he attempted several more words. Works well with magnetic letters.

Reading struggles the teacher has observed:
Opened the lesson with "I can't read this." Identifies beginning sounds in isolation but cannot hold blends together (for "frog" said /f/ then guessed "fish"). Frequently skips difficult words or waits silently for teacher help. Looks away from text when stuck. Rarely notices when reading doesn't match the text unless prompted.

Additional teacher notes:
Relies heavily on memorized sight words; becomes dysregulated when text requires flexible decoding. After the "stop" success today he was visibly proud. Writing remains challenging — often writes only beginning sounds, fine motor fatigue may be a factor.`;

const EXAMPLE_ELIJAH_OUTPUT = `\`\`\`json
{
  "observations": [
    {"behavior": "frustration_after_errors", "evidence": "'I can't read this' before starting; appeared tired and avoidant"},
    {"behavior": "blending_difficulty", "evidence": "for 'frog', identified /f/ but couldn't hold /fr/ together; guessed 'fish'"},
    {"behavior": "skips_unknown_words", "evidence": "frequently skips difficult words or waits silently for teacher assistance"},
    {"behavior": "guessing_from_context", "evidence": "guesses based on first sound after stalling"},
    {"behavior": "weak_self_monitoring", "evidence": "rarely notices when reading does not match the text unless directly prompted"},
    {"behavior": "high_engagement", "evidence": "successfully blended 'stop' after repeated practice and became visibly proud; persistence after encouragement was a real strength today"}
  ],
  "reading_processes": [
    {"process": "weak_sequential_blending", "confidence": 0.85, "reasoning": "Knows individual sounds but cannot hold a blend (/fr/) in sequence. This is the central decoding breakdown."},
    {"process": "low_decoding_confidence", "confidence": 0.9, "reasoning": "Avoidance behavior, the 'I can't read this' opener, and looking away from text indicate the affective load is now part of the problem — possibly larger than the cognitive one."},
    {"process": "developing_phoneme_segmentation", "confidence": 0.55, "reasoning": "Identifies beginning sounds in isolation but struggles to segment full words. Segmentation is a prerequisite to blending and is itself fragile."},
    {"process": "limited_decoding_stamina", "confidence": 0.7, "reasoning": "Relies heavily on memorized sight words; becomes dysregulated when flexible decoding is required."}
  ],
  "instructional_goals": [
    {"goal": "strengthen_continuous_blending", "why": "Specifically two-consonant initial blends (st-, fr-, fl-). This is the precise breakdown point; Elijah has the phonemes, he needs to learn to stretch them as one continuous sound."},
    {"goal": "build_decoding_confidence", "why": "The 'stop' moment today showed what success unlocks. Every lesson needs at least one win Elijah can name. Confidence is load-bearing here — without it, the decoding work won't stick."}
  ],
  "lesson_constraints": {
    "target_phonics_patterns": ["initial s-blends with short vowels (stop, stem, snap, spin, step)", "initial r-blends (frog, trip, drip, crab)"],
    "sentence_complexity": "3-5 words, simple SVO only",
    "vocabulary_control": "target blend words plus a tiny set of known sight words (the, a, is, can, did, not). Nothing untaught.",
    "picture_predictability": "low — pictures support theme (dinosaurs/trucks) but do not name target words",
    "recommended_prompting_style": ["Let's stretch it slowly together.", "Try the first two sounds.", "Check it with your finger.", "You kept going even when it was hard."],
    "targeted_reading_behaviors": ["blending two consonants without pause", "left-to-right tracking with finger", "attempting a word before asking for help"],
    "engagement_hooks": ["dinosaurs", "trucks", "superheroes"]
  }
}
\`\`\`

# What I Noticed
- frustration_after_errors — opened with "I can't read this"; appeared tired and avoidant
- blending_difficulty — for "frog," identified /f/ but couldn't hold /fr/ together; guessed "fish"
- skips_unknown_words — frequently skips difficult words or waits silently for teacher assistance
- guessing_from_context — guesses based on first sound after stalling
- weak_self_monitoring — rarely notices when reading doesn't match the text unless directly prompted
- high_engagement (with the right scaffold) — successfully blended "stop" after repeated practice and became visibly proud; persistence after encouragement was a real strength today

# Likely Reading Processes
- weak_sequential_blending (confidence ~0.85) — Knows individual sounds but cannot hold a blend (/fr/) in sequence. This is the central decoding breakdown.
- low_decoding_confidence (confidence ~0.9) — Avoidance behavior, the "I can't read this" opener, and looking away from text indicate the affective load is now part of the problem — possibly larger than the cognitive one.
- developing_phoneme_segmentation (confidence ~0.55) — Identifies beginning sounds in isolation but struggles to segment full words. Segmentation is a prerequisite to blending and is itself fragile.
- limited_decoding_stamina (confidence ~0.7) — Relies heavily on memorized sight words; becomes dysregulated when flexible decoding is required.

# Recommended Instructional Focus
1. **strengthen_continuous_blending** — Specifically two-consonant initial blends (st-, fr-, fl-). This is the precise breakdown point; Elijah has the phonemes, he needs to learn to stretch them as one continuous sound.
2. **build_decoding_confidence** — The "stop" moment today showed what success unlocks. Every lesson needs at least one win Elijah can name. Confidence is load-bearing here.

# Lesson Constraints
- **Target patterns:** initial s-blends with short vowels (stop, stem, snap, spin, step); initial r-blends (frog, trip, drip, crab)
- **Sentence complexity:** 3–5 words, simple SVO only
- **Vocabulary control:** target blend words plus a tiny set of known sight words (the, a, is, can, did, not). Nothing untaught.
- **Picture predictability:** low — pictures support theme (dinosaurs/trucks) but do not name target words
- **Prompting style:** "Let's stretch it slowly together." / "Try the first two sounds." / "Check it with your finger." / "You kept going even when it was hard."
- **Behaviors to reinforce:** blending two consonants without pause; left-to-right tracking with finger; attempting a word before asking for help

# Mini Lesson
**3 min — Confidence anchor.** Begin with the win from last time. Teacher writes "stop" on a card; Elijah reads it. "You blended this last time. Let's blend more like it today."

**5 min — Stretch-and-blend with magnetic letters.** Build *stop*. Slide finger left-to-right; teacher models stretching the /st/ without breaking. Elijah repeats. Swap the rime: *stem*, *step*. Then swap blends: *snap*, *spin*. Move slowly. No more than 4 words.

**8 min — Read the decodable story.** Elijah reads with finger tracking. Teacher only prompts on blends, using the "stretch it together" cue.

**2 min — Name the win.** "You blended *spin* on your first try. Yesterday that was a hard word. You're getting it."

# Decodable Story
**The T-Rex**

A T-Rex can stop. A T-Rex can spin. The T-Rex sees a frog. Snap! The frog can hop. The T-Rex did not trip. He sees a crab. The crab is fast. The T-Rex can stop again.

# Teacher Prompts
- Before a blend: "Let's stretch it slowly together."
- On a stall after the first letter: "Try the first two sounds — don't stop between them."
- On avoidance: "Hard word and you tried it. Let's get the first two sounds together."
- On a guess: "Check it with your finger. Slide and stretch."
- On a successful blend: "You held the blend. You did the hard part."
- At any moment of progress: "You kept going even when it was hard."

# Word Work
**Stretch-and-blend chain (5 min).** Teacher says the sounds slowly; Elijah blends them into a word. Start with successes from today:
- /s/ /t/ /o/ /p/ → stop
- /s/ /n/ /a/ /p/ → snap
- /f/ /r/ /o/ /g/ → frog
- /t/ /r/ /i/ /p/ → trip

If he hesitates on a blend, teacher models stretching the first two consonants together, then has him try again.

**Build-and-read (3 min).** With magnetic letters, build *stop*, *snap*, *spin*. Elijah slides finger left-to-right, stretches, reads. Two of the three should be successes — this is confidence work, not assessment.

# Writing Extension
Elijah draws a dinosaur or a truck. Underneath, he writes one short sentence using at least one blend word from today. Teacher stretches the sounds orally while Elijah writes ("ssss-ttt-ooo-ppp"). If he tires, scribe the harder words for him and have him write the blend word himself.`;

export const EXAMPLES_BLOCK = `-----------------------------------
EXAMPLES OF WELL-FORMED RESPONSES
-----------------------------------

The two examples below show how to respond to different student profiles — a developing 2nd-grade decoder whose problem is fluency, and an at-risk 1st-grade reader where the affective layer is as load-bearing as the decoding gap. Use them as patterns for **tone, depth, structure, and the relationship between reasoning and materials** — not as templates to copy. The students you encounter will have different profiles requiring different observations, goals, and materials.

Note how each example:
- Picks only 1–2 instructional goals (not more), and the goals are precise breakdown points, not generic skills.
- Grounds every observation in a direct teacher quote or paraphrase.
- Uses confidence scores in the 0.5–0.9 range — never 1.0, never below 0.5 for a meaningful inference.
- Lets the Mini Lesson, Decodable Story, Teacher Prompts, Word Work, and Writing Extension all serve the same 1–2 goals — no scattered activities.
- Embeds the student's interests in the story by name (not as a token, but as the setting).
- Keeps the Decodable Story sentences short enough for the student's level and uses several of the target phonics words.

============================================================
EXAMPLE 1 — Javier, 2nd grade, developing decoder with fluency weakness
============================================================

[USER PROMPT]
${EXAMPLE_JAVIER_INPUT}

[YOUR RESPONSE]
${EXAMPLE_JAVIER_OUTPUT}

============================================================
EXAMPLE 2 — Elijah, 1st grade, at-risk reader with avoidance behaviors
============================================================

[USER PROMPT]
${EXAMPLE_ELIJAH_INPUT}

[YOUR RESPONSE]
${EXAMPLE_ELIJAH_OUTPUT}

============================================================
END OF EXAMPLES
============================================================`;
