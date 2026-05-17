import type {
  BookRecommendation,
  GenerateRequest,
  LessonOutput,
  LibraryBook,
} from "./types";

const PHONICS = ["phonics", "rhyme", "letter sounds"];
const PRINT = ["print concepts", "tracking", "one-to-one matching"];
const COMPREHENSION = ["comprehension", "prediction", "retell"];
const VOCAB = ["vocabulary", "oral language"];
const FLUENCY = ["fluency", "phrasing", "expression"];

function book(
  id: string,
  title: string,
  author: string,
  themes: string[],
  vocabulary: string[],
  skills: string[]
): LibraryBook {
  return { id, title, author, themes, vocabulary, skills };
}

export const EARLY_CHILDHOOD_BOOKS: LibraryBook[] = [
  book("brown-bear", "Brown Bear, Brown Bear, What Do You See?", "Bill Martin Jr. and Eric Carle", ["animals", "colors", "pattern"], ["bear", "bird", "duck", "horse", "see"], [...PRINT, ...VOCAB, "predictable text"]),
  book("hungry-caterpillar", "The Very Hungry Caterpillar", "Eric Carle", ["food", "days", "growth", "science"], ["apple", "pear", "plum", "caterpillar", "butterfly"], [...COMPREHENSION, ...VOCAB, "sequencing"]),
  book("goodnight-moon", "Goodnight Moon", "Margaret Wise Brown", ["bedtime", "home", "routine"], ["moon", "room", "chair", "brush", "quiet"], [...PRINT, ...FLUENCY, "rhyme"]),
  book("where-wild-things", "Where the Wild Things Are", "Maurice Sendak", ["imagination", "feelings", "family"], ["wild", "sail", "king", "rumpus", "home"], [...COMPREHENSION, ...VOCAB, "story structure"]),
  book("cat-hat", "The Cat in the Hat", "Dr. Seuss", ["silly", "pets", "rainy day"], ["cat", "hat", "mat", "sit", "trick"], [...PHONICS, ...FLUENCY, "short-a CVC"]),
  book("green-eggs", "Green Eggs and Ham", "Dr. Seuss", ["food", "trying new things", "persistence"], ["green", "eggs", "ham", "goat", "boat"], [...PHONICS, ...FLUENCY, "rhyme"]),
  book("very-cranky-bear", "The Very Cranky Bear", "Nick Bland", ["animals", "friendship", "feelings"], ["bear", "sheep", "moose", "lion", "cranky"], [...COMPREHENSION, ...VOCAB, "character feelings"]),
  book("llama-red-pajama", "Llama Llama Red Pajama", "Anna Dewdney", ["bedtime", "feelings", "family"], ["llama", "mama", "pajama", "wait", "red"], [...FLUENCY, ...COMPREHENSION, "rhyme"]),
  book("chicka-boom", "Chicka Chicka Boom Boom", "Bill Martin Jr. and John Archambault", ["alphabet", "letters", "trees"], ["letter", "coconut", "tree", "boom", "up"], [...PHONICS, "letter names", "alphabetic principle"]),
  book("gruffalo", "The Gruffalo", "Julia Donaldson", ["forest", "animals", "bravery"], ["mouse", "fox", "owl", "snake", "gruffalo"], [...COMPREHENSION, ...FLUENCY, "rhyme"]),
  book("room-broom", "Room on the Broom", "Julia Donaldson", ["friendship", "animals", "helping"], ["witch", "broom", "cat", "dog", "dragon"], [...COMPREHENSION, ...FLUENCY, "sequencing"]),
  book("dragons-love-tacos", "Dragons Love Tacos", "Adam Rubin", ["dragons", "food", "humor"], ["dragon", "taco", "spicy", "party", "salsa"], [...COMPREHENSION, ...VOCAB, "cause and effect"]),
  book("if-you-give-mouse", "If You Give a Mouse a Cookie", "Laura Numeroff", ["food", "home", "cause and effect"], ["mouse", "cookie", "milk", "straw", "mirror"], [...COMPREHENSION, "cause and effect", "sequencing"]),
  book("dont-let-pigeon", "Don't Let the Pigeon Drive the Bus!", "Mo Willems", ["transportation", "humor", "self-control"], ["pigeon", "bus", "drive", "please", "wait"], [...COMPREHENSION, ...FLUENCY, "dialogue"]),
  book("knuffle-bunny", "Knuffle Bunny", "Mo Willems", ["family", "feelings", "lost and found"], ["bunny", "laundry", "walk", "lost", "found"], [...COMPREHENSION, ...VOCAB, "retell"]),
  book("elephant-piggie", "We Are in a Book!", "Mo Willems", ["friendship", "books", "humor"], ["book", "read", "fun", "again", "page"], [...FLUENCY, ...PRINT, "dialogue"]),
  book("pete-shoes", "Pete the Cat: I Love My White Shoes", "Eric Litwin and James Dean", ["colors", "music", "resilience"], ["white", "red", "blue", "shoes", "sing"], [...PRINT, ...FLUENCY, "predictable text"]),
  book("pete-buttons", "Pete the Cat and His Four Groovy Buttons", "Eric Litwin and James Dean", ["counting", "clothes", "resilience"], ["button", "four", "pop", "shirt", "belly"], [...PRINT, "counting", "subtraction"]),
  book("bear-snores", "Bear Snores On", "Karma Wilson", ["animals", "winter", "friendship"], ["bear", "cave", "snow", "mouse", "sleep"], [...FLUENCY, ...VOCAB, "rhyme"]),
  book("bear-wants-more", "Bear Wants More", "Karma Wilson", ["animals", "spring", "food"], ["bear", "more", "berries", "roots", "spring"], [...FLUENCY, ...VOCAB, "rhyme"]),
  book("giraffes-dance", "Giraffes Can't Dance", "Giles Andreae", ["animals", "confidence", "music"], ["giraffe", "dance", "jungle", "music", "sway"], [...COMPREHENSION, ...VOCAB, "character change"]),
  book("rainbow-fish", "The Rainbow Fish", "Marcus Pfister", ["sharing", "ocean", "friendship"], ["fish", "scale", "blue", "shimmer", "share"], [...COMPREHENSION, ...VOCAB, "theme"]),
  book("corduroy", "Corduroy", "Don Freeman", ["toys", "friendship", "shopping"], ["bear", "button", "store", "bed", "pocket"], [...COMPREHENSION, ...VOCAB, "retell"]),
  book("caps-sale", "Caps for Sale", "Esphyr Slobodkina", ["monkeys", "patterns", "problem solving"], ["caps", "monkey", "tree", "sell", "shake"], [...PRINT, ...COMPREHENSION, "repetition"]),
  book("stone-soup", "Stone Soup", "Marcia Brown", ["food", "community", "sharing"], ["stone", "soup", "pot", "carrot", "village"], [...COMPREHENSION, ...VOCAB, "theme"]),
  book("little-blue-truck", "Little Blue Truck", "Alice Schertle", ["trucks", "farm animals", "helping"], ["truck", "beep", "mud", "goat", "friend"], [...PHONICS, ...FLUENCY, "sound words"]),
  book("going-bear-hunt", "We're Going on a Bear Hunt", "Michael Rosen", ["adventure", "family", "movement"], ["bear", "grass", "river", "mud", "cave"], [...PRINT, ...FLUENCY, "repetition"]),
  book("snowy-day", "The Snowy Day", "Ezra Jack Keats", ["winter", "play", "city"], ["snow", "stick", "tracks", "pocket", "melt"], [...COMPREHENSION, ...VOCAB, "sequence"]),
  book("swimmy", "Swimmy", "Leo Lionni", ["ocean", "teamwork", "bravery"], ["fish", "sea", "tuna", "school", "together"], [...COMPREHENSION, ...VOCAB, "theme"]),
  book("frederick", "Frederick", "Leo Lionni", ["seasons", "poetry", "community"], ["mouse", "winter", "sun", "colors", "words"], [...VOCAB, ...COMPREHENSION, "figurative language"]),
  book("make-way-ducklings", "Make Way for Ducklings", "Robert McCloskey", ["ducks", "city", "family"], ["duck", "pond", "park", "traffic", "island"], [...COMPREHENSION, ...VOCAB, "sequence"]),
  book("blueberries-sal", "Blueberries for Sal", "Robert McCloskey", ["berries", "family", "animals"], ["blueberry", "pail", "bear", "hill", "mother"], [...COMPREHENSION, ...VOCAB, "parallel story"]),
  book("harold-purple", "Harold and the Purple Crayon", "Crockett Johnson", ["drawing", "imagination", "adventure"], ["crayon", "moon", "draw", "path", "purple"], [...COMPREHENSION, ...VOCAB, "sequence"]),
  book("rosie-walk", "Rosie's Walk", "Pat Hutchins", ["farm", "fox", "prepositions"], ["hen", "fox", "around", "over", "under"], [...PRINT, ...VOCAB, "prepositions"]),
  book("good-night-gorilla", "Good Night, Gorilla", "Peggy Rathmann", ["zoo", "bedtime", "animals"], ["gorilla", "key", "cage", "zoo", "night"], [...PRINT, ...COMPREHENSION, "picture reading"]),
  book("click-clack-moo", "Click, Clack, Moo: Cows That Type", "Doreen Cronin", ["farm", "letters", "problem solving"], ["cow", "type", "note", "milk", "blanket"], [...PRINT, ...FLUENCY, "letter writing"]),
  book("diary-worm", "Diary of a Worm", "Doreen Cronin", ["insects", "school", "humor"], ["worm", "diary", "earth", "school", "dig"], [...COMPREHENSION, ...VOCAB, "point of view"]),
  book("napping-house", "The Napping House", "Audrey Wood", ["bedtime", "sequence", "animals"], ["house", "bed", "granny", "flea", "wake"], [...PRINT, ...COMPREHENSION, "cumulative text"]),
  book("king-bidgood", "King Bidgood's in the Bathtub", "Audrey Wood", ["bath", "royalty", "humor"], ["king", "bath", "tub", "fish", "party"], [...COMPREHENSION, ...VOCAB, "problem solving"]),
  book("strega-nona", "Strega Nona", "Tomie dePaola", ["food", "magic", "consequences"], ["pasta", "pot", "magic", "town", "bubble"], [...COMPREHENSION, ...VOCAB, "cause and effect"]),
  book("cloudy-meatballs", "Cloudy With a Chance of Meatballs", "Judi Barrett", ["weather", "food", "imagination"], ["cloudy", "meatball", "town", "rain", "food"], [...COMPREHENSION, ...VOCAB, "fantasy vs reality"]),
  book("jamberry", "Jamberry", "Bruce Degen", ["berries", "rhyme", "animals"], ["jam", "berry", "bear", "canoe", "train"], [...PHONICS, ...FLUENCY, "rhyme"]),
  book("mouse-paint", "Mouse Paint", "Ellen Stoll Walsh", ["colors", "mice", "art"], ["mouse", "paint", "red", "blue", "yellow"], [...VOCAB, "color words", "sequence"]),
  book("mouse-count", "Mouse Count", "Ellen Stoll Walsh", ["counting", "mice", "snake"], ["mouse", "count", "jar", "snake", "ten"], [...PRINT, "counting", "sequence"]),
  book("dear-zoo", "Dear Zoo", "Rod Campbell", ["zoo", "animals", "letters"], ["zoo", "lion", "giraffe", "camel", "puppy"], [...PRINT, ...VOCAB, "repetition"]),
  book("lost-found", "Lost and Found", "Oliver Jeffers", ["friendship", "penguins", "journey"], ["boy", "penguin", "boat", "sea", "lost"], [...COMPREHENSION, ...VOCAB, "character feelings"]),
  book("day-crayons-quit", "The Day the Crayons Quit", "Drew Daywalt", ["colors", "letters", "feelings"], ["crayon", "quit", "letter", "color", "draw"], [...PRINT, ...COMPREHENSION, "voice"]),
  book("press-here", "Press Here", "Herve Tullet", ["interactive", "colors", "following directions"], ["press", "dot", "shake", "tap", "yellow"], [...PRINT, ...VOCAB, "direction words"]),
  book("planting-rainbow", "Planting a Rainbow", "Lois Ehlert", ["flowers", "colors", "gardening"], ["seed", "bulb", "flower", "plant", "rainbow"], [...VOCAB, "science vocabulary", "sequence"]),
  book("leaf-man", "Leaf Man", "Lois Ehlert", ["fall", "leaves", "nature"], ["leaf", "wind", "fall", "tree", "field"], [...VOCAB, ...COMPREHENSION, "visual inference"]),
  book("chrysanthemum", "Chrysanthemum", "Kevin Henkes", ["names", "school", "identity"], ["name", "school", "mouse", "perfect", "tease"], [...COMPREHENSION, ...VOCAB, "character feelings"]),
  book("lilly-purple-purse", "Lilly's Purple Plastic Purse", "Kevin Henkes", ["school", "feelings", "self-control"], ["purse", "school", "teacher", "angry", "sorry"], [...COMPREHENSION, ...VOCAB, "character change"]),
  book("wemberly-worried", "Wemberly Worried", "Kevin Henkes", ["school", "worry", "friendship"], ["worry", "school", "mouse", "friend", "morning"], [...COMPREHENSION, ...VOCAB, "feelings vocabulary"]),
  book("owl-babies", "Owl Babies", "Martin Waddell", ["animals", "family", "separation"], ["owl", "tree", "branch", "mother", "dark"], [...COMPREHENSION, ...VOCAB, "repetition"]),
  book("guess-how-much", "Guess How Much I Love You", "Sam McBratney", ["family", "love", "measurement"], ["hare", "love", "far", "moon", "stretch"], [...COMPREHENSION, ...VOCAB, "comparison"]),
  book("big-red-barn", "Big Red Barn", "Margaret Wise Brown", ["farm", "animals", "night"], ["barn", "cow", "horse", "pig", "sleep"], [...VOCAB, ...FLUENCY, "rhyme"]),
  book("runaway-bunny", "The Runaway Bunny", "Margaret Wise Brown", ["family", "imagination", "security"], ["bunny", "run", "mother", "fish", "mountain"], [...COMPREHENSION, ...FLUENCY, "pattern"]),
  book("are-you-mother", "Are You My Mother?", "P.D. Eastman", ["animals", "family", "questions"], ["bird", "mother", "dog", "cow", "snort"], [...PRINT, ...COMPREHENSION, "question marks"]),
  book("go-dog-go", "Go, Dog. Go!", "P.D. Eastman", ["dogs", "vehicles", "opposites"], ["dog", "go", "up", "down", "hat"], [...PHONICS, ...PRINT, "high-frequency words"]),
  book("put-me-zoo", "Put Me in the Zoo", "Robert Lopshire", ["colors", "animals", "belonging"], ["spot", "zoo", "red", "blue", "yellow"], [...PRINT, ...VOCAB, "color words"]),
  book("hop-pop", "Hop on Pop", "Dr. Seuss", ["family", "word families", "rhyme"], ["hop", "pop", "cup", "pup", "ball"], [...PHONICS, "CVC word families", "rhyme"]),
  book("fox-socks", "Fox in Socks", "Dr. Seuss", ["tongue twisters", "rhyme", "animals"], ["fox", "socks", "box", "knox", "chicks"], [...PHONICS, ...FLUENCY, "consonant blends"]),
  book("alphabet-tree", "The Alphabet Tree", "Leo Lionni", ["letters", "words", "teamwork"], ["letter", "word", "tree", "wind", "sentence"], [...PHONICS, "letter names", "word building"]),
  book("each-peach", "Each Peach Pear Plum", "Janet and Allan Ahlberg", ["rhyme", "fairy tales", "search"], ["peach", "pear", "plum", "spy", "pie"], [...PHONICS, ...FLUENCY, "rhyme"]),
  book("jolly-postman", "The Jolly Postman", "Janet and Allan Ahlberg", ["letters", "fairy tales", "mail"], ["postman", "letter", "mail", "house", "read"], [...PRINT, ...COMPREHENSION, "environmental print"]),
  book("sheep-jeep", "Sheep in a Jeep", "Nancy Shaw", ["animals", "vehicles", "rhyme"], ["sheep", "jeep", "hill", "mud", "push"], [...PHONICS, ...FLUENCY, "long-e word family"]),
  book("sheep-shop", "Sheep in a Shop", "Nancy Shaw", ["shopping", "animals", "rhyme"], ["sheep", "shop", "ship", "gift", "cash"], [...PHONICS, ...FLUENCY, "sh digraph"]),
  book("frog-toad", "Frog and Toad Are Friends", "Arnold Lobel", ["friendship", "seasons", "kindness"], ["frog", "toad", "garden", "letter", "friend"], [...FLUENCY, ...COMPREHENSION, "early chapter stamina"]),
  book("little-bear", "Little Bear", "Else Holmelund Minarik", ["family", "animals", "imagination"], ["bear", "mother", "snow", "birthday", "soup"], [...FLUENCY, ...COMPREHENSION, "early reader"]),
  book("henry-mudge", "Henry and Mudge", "Cynthia Rylant", ["dogs", "friendship", "family"], ["dog", "boy", "walk", "friend", "big"], [...FLUENCY, ...COMPREHENSION, "early reader"]),
  book("biscuit", "Biscuit", "Alyssa Satin Capucilli", ["dogs", "bedtime", "pets"], ["dog", "biscuit", "woof", "bed", "sleep"], [...PRINT, ...FLUENCY, "high-frequency words"]),
  book("fly-guy", "Hi! Fly Guy", "Tedd Arnold", ["insects", "friendship", "humor"], ["fly", "guy", "boy", "pet", "buzz"], [...PHONICS, ...FLUENCY, "high-interest early reader"]),
  book("piggie-pie", "Piggie Pie!", "Margie Palatini", ["farm", "humor", "problem solving"], ["pig", "pie", "witch", "farm", "duck"], [...COMPREHENSION, ...VOCAB, "dialogue"]),
  book("three-little-pigs", "The Three Little Pigs", "Traditional", ["fairy tales", "building", "problem solving"], ["pig", "house", "straw", "sticks", "brick"], [...COMPREHENSION, ...VOCAB, "retell"]),
  book("little-red-hen", "The Little Red Hen", "Traditional", ["farm", "work", "bread"], ["hen", "seed", "wheat", "bread", "help"], [...COMPREHENSION, ...VOCAB, "sequence"]),
  book("gingerbread-man", "The Gingerbread Man", "Traditional", ["food", "chase", "rhyme"], ["run", "man", "fox", "cookie", "fast"], [...PRINT, ...FLUENCY, "refrain"]),
  book("goldilocks", "Goldilocks and the Three Bears", "Traditional", ["fairy tales", "size", "family"], ["bear", "chair", "bed", "porridge", "just right"], [...COMPREHENSION, ...VOCAB, "comparison"]),
  book("jack-beanstalk", "Jack and the Beanstalk", "Traditional", ["fairy tales", "plants", "adventure"], ["bean", "giant", "cow", "gold", "climb"], [...COMPREHENSION, ...VOCAB, "story elements"]),
  book("three-billy-goats", "The Three Billy Goats Gruff", "Traditional", ["bridges", "goats", "bravery"], ["goat", "bridge", "troll", "trip", "grass"], [...COMPREHENSION, ...FLUENCY, "repeated dialogue"]),
  book("pout-pout-fish", "The Pout-Pout Fish", "Deborah Diesen", ["ocean", "feelings", "friendship"], ["fish", "pout", "swim", "sea", "kiss"], [...FLUENCY, ...VOCAB, "rhyme"]),
  book("stick-man", "Stick Man", "Julia Donaldson", ["family", "seasons", "journey"], ["stick", "man", "dog", "snow", "home"], [...COMPREHENSION, ...FLUENCY, "rhyme"]),
  book("snail-whale", "The Snail and the Whale", "Julia Donaldson", ["ocean", "travel", "friendship"], ["snail", "whale", "sea", "trail", "save"], [...COMPREHENSION, ...VOCAB, "adventure sequence"]),
  book("monster-end", "The Monster at the End of This Book", "Jon Stone", ["monsters", "humor", "books"], ["monster", "page", "turn", "end", "scared"], [...PRINT, ...FLUENCY, "interactive text"]),
  book("elmer", "Elmer", "David McKee", ["elephants", "identity", "colors"], ["elephant", "patchwork", "gray", "color", "parade"], [...COMPREHENSION, ...VOCAB, "theme"]),
  book("grumpy-monkey", "Grumpy Monkey", "Suzanne Lang", ["feelings", "animals", "self-awareness"], ["monkey", "grumpy", "jungle", "smile", "feel"], [...COMPREHENSION, ...VOCAB, "emotion words"]),
  book("book-no-pictures", "The Book with No Pictures", "B.J. Novak", ["humor", "print", "sounds"], ["book", "words", "read", "silly", "sounds"], [...PRINT, ...FLUENCY, "expressive reading"]),
  book("not-box", "Not a Box", "Antoinette Portis", ["imagination", "play", "boxes"], ["box", "rabbit", "car", "mountain", "robot"], [...COMPREHENSION, ...VOCAB, "inference"]),
  book("beautiful-oops", "Beautiful Oops!", "Barney Saltzberg", ["art", "mistakes", "creativity"], ["oops", "tear", "spill", "art", "make"], [...COMPREHENSION, ...VOCAB, "growth mindset"]),
  book("ish", "Ish", "Peter H. Reynolds", ["art", "confidence", "creativity"], ["draw", "art", "ish", "paper", "feel"], [...COMPREHENSION, ...VOCAB, "character change"]),
  book("dot", "The Dot", "Peter H. Reynolds", ["art", "confidence", "school"], ["dot", "draw", "teacher", "mark", "gallery"], [...COMPREHENSION, ...VOCAB, "theme"]),
  book("last-stop-market", "Last Stop on Market Street", "Matt de la Pena", ["community", "city", "gratitude"], ["bus", "city", "market", "street", "music"], [...COMPREHENSION, ...VOCAB, "theme"]),
  book("sulwe", "Sulwe", "Lupita Nyong'o", ["identity", "family", "night"], ["skin", "night", "star", "bright", "beautiful"], [...COMPREHENSION, ...VOCAB, "theme"]),
  book("hair-love", "Hair Love", "Matthew A. Cherry", ["family", "identity", "hair"], ["hair", "dad", "love", "style", "mirror"], [...COMPREHENSION, ...VOCAB, "character feelings"]),
  book("we-dont-eat-classmates", "We Don't Eat Our Classmates", "Ryan T. Higgins", ["dinosaurs", "school", "friendship"], ["dinosaur", "school", "classmate", "eat", "friend"], [...COMPREHENSION, ...VOCAB, "social problem solving"]),
  book("mother-bruce", "Mother Bruce", "Ryan T. Higgins", ["animals", "family", "humor"], ["bear", "egg", "goose", "mother", "home"], [...COMPREHENSION, ...VOCAB, "character change"]),
  book("creepy-carrots", "Creepy Carrots!", "Aaron Reynolds", ["vegetables", "humor", "spooky"], ["carrot", "rabbit", "creepy", "field", "plan"], [...COMPREHENSION, ...VOCAB, "inference"]),
  book("tacky-penguin", "Tacky the Penguin", "Helen Lester", ["penguins", "individuality", "humor"], ["penguin", "tacky", "march", "hunter", "nice"], [...COMPREHENSION, ...VOCAB, "character traits"]),
  book("stellar-jay", "Stellaluna", "Janell Cannon", ["bats", "friendship", "differences"], ["bat", "bird", "night", "fruit", "wing"], [...COMPREHENSION, ...VOCAB, "compare and contrast"]),
  book("dear-primo", "Dear Primo", "Duncan Tonatiuh", ["family", "letters", "community"], ["primo", "letter", "city", "country", "cousin"], [...PRINT, ...COMPREHENSION, "compare and contrast"]),
  book("round-tortilla", "Round Is a Tortilla", "Roseanne Greenfield Thong", ["shapes", "food", "family"], ["round", "tortilla", "square", "star", "shape"], [...VOCAB, "shape words", "concepts"]),
];

function normalize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1);
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function overlap(tags: string[], haystack: Set<string>): string[] {
  return tags.filter((tag) => {
    const tagTokens = normalize(tag);
    return tagTokens.some((token) => haystack.has(token));
  });
}

function percent(score: number): number {
  return Math.max(35, Math.min(98, Math.round(score)));
}

export function recommendBooksForLesson(
  input: GenerateRequest,
  lesson: LessonOutput
): BookRecommendation[] {
  const skillText = [
    input.targetPattern,
    input.struggles,
    input.notes,
    lesson.needSummary,
    lesson.teachingMove,
    lesson.reasoning?.instructional_goals.map((g) => g.goal).join(" "),
    lesson.reasoning?.lesson_constraints.target_phonics_patterns.join(" "),
  ].join(" ");
  const vocabText = [
    input.targetPattern,
    input.notes,
    lesson.targetWords.join(" "),
    lesson.miniStory,
  ].join(" ");
  const themeText = [input.interests, input.notes, lesson.miniStory].join(" ");

  const skillTokens = new Set(normalize(skillText));
  const vocabTokens = new Set(normalize(vocabText));
  const themeTokens = new Set(normalize(themeText));

  return EARLY_CHILDHOOD_BOOKS.map((book) => {
    const matchedSkills = unique(overlap(book.skills, skillTokens));
    const matchedVocabulary = unique(overlap(book.vocabulary, vocabTokens));
    const matchedThemes = unique(overlap(book.themes, themeTokens));

    const score =
      matchedSkills.length * 14 +
      matchedVocabulary.length * 9 +
      matchedThemes.length * 10 +
      (book.skills.some((skill) => skill.includes("phonics")) &&
      /phonics|cvc|short|vowel|digraph|blend|rhyme/i.test(skillText)
        ? 12
        : 0) +
      (matchedThemes.length > 0 ? 8 : 0) +
      (matchedVocabulary.length >= 2 ? 8 : 0);

    const matchPercent = percent(score);
    const mainSkill = matchedSkills[0] ?? book.skills[0];
    const mainTheme = matchedThemes[0] ?? book.themes[0];
    const vocabPhrase =
      matchedVocabulary.length > 0
        ? matchedVocabulary.slice(0, 4).join(", ")
        : book.vocabulary.slice(0, 3).join(", ");

    return {
      bookId: book.id,
      title: book.title,
      author: book.author,
      matchPercent,
      matchedSkills,
      matchedVocabulary,
      matchedThemes,
      productiveStruggleNote: `Use this as productive struggle by keeping the focus narrow: ${mainSkill}. Preview the story context and ${vocabPhrase}, then let the student do the reading work with brief prompts before you step in. Stop before frustration builds; the goal is one supported stretch, not a whole-book performance.`,
      suggestion: `Use ${book.title} to connect ${mainSkill} with ${mainTheme}. Before reading, name the target skill and rehearse 2-3 high-leverage words. During reading, pause at one planned page for the student to apply the skill independently, then return to meaning with a quick retell or question.`,
    };
  })
    .sort((a, b) => b.matchPercent - a.matchPercent || a.title.localeCompare(b.title))
    .slice(0, 3);
}

export function buildProductiveStrugglePlan(
  input: GenerateRequest,
  lesson: LessonOutput,
  recommendations: BookRecommendation[]
): string {
  const primarySkill =
    lesson.reasoning?.instructional_goals[0]?.goal ||
    input.targetPattern ||
    lesson.needSummary;
  const targetWords =
    lesson.targetWords.length > 0
      ? lesson.targetWords.slice(0, 6).join(", ")
      : "the highest-leverage words from the lesson";
  const bestBook = recommendations[0];

  return [
    `Next lesson focus: keep the challenge on ${primarySkill}. Begin with a quick success reread or oral rehearsal so the student starts regulated, then introduce only one new stretch task.`,
    bestBook
      ? `Use ${bestBook.title} as the anchor text because it matches the student's current skill work and interests at ${bestBook.matchPercent}%. Preview only the vocabulary that would otherwise block meaning (${targetWords}), then let the student attempt the planned words before intervening.`
      : `Use a short, highly familiar text and preview ${targetWords} before reading.`,
    "Productive struggle boundary: wait 3-5 seconds after a miscued target word, prompt with one precise cue, and return immediately to meaning once the student self-corrects or approximates the skill. If the student shows repeated guessing, visible frustration, or loss of comprehension, reduce the task to one sentence or one word sort rather than pushing through the whole book.",
  ].join("\n\n");
}
