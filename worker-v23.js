import baseWorker from "./worker-v18.js";
export { ExistRelay } from "./worker-v18.js";

const WORKER_CACHE_VERSION = "v35";

// Public SAB Wiki tables checked November 11, 2026. Null means unpublished.
// https://stealabrainrot.wiki/wiki/mutations/
// https://stealabrainrot.wiki/wiki/traits/
// https://stealabrainrot.wiki/wiki/traits/seasonal/
const WIKI_MUTATIONS = [
  ["Default",1,null],
  ["Gold",1.25,"2025-05-31"],
  ["Diamond",1.5,"2025-05-31"],
  ["Rainbow",10,"2025-06-21"],
  ["Bloodrot",2,"2025-06-07"],
  ["Candy",4,"2025-07-05"],
  ["Lava",6,"2025-07-25"],
  ["Galaxy",7,"2025-08-23"],
  ["Yin Yang",7.5,"2025-09-27"],
  ["Radioactive",8.5,"2025-11-15"],
  ["Cursed",9,"2026-01-03"],
  ["Divine",10,"2026-02-21"],
  ["Cyber",11,"2026-04-18"],
  ["Phantom",12,"2026-06-13"],
  ["Crystal",13,"2026-07-25"],
  ["Eclipse",14,"2026-10-03"]
];
const WIKI_TRAITS = [
  ["Bat",null],
  ["Money",null],
  ["Strawberry",8],
  ["Meowl",7],
  ["John Pork",6.5],
  ["Skibidi",6],
  ["Granny",5.5],
  ["Fire",5],
  ["Rose",5],
  ["Fireworks",5],
  ["Nyan",5],
  ["Lightning",5],
  ["Burger",4.5],
  ["Aura Shades",4.5],
  ["Disco",4],
  ["Glitched",4],
  ["Claws",4],
  ["Zombie",4],
  ["Bubblegum",3],
  ["Taco",2],
  ["UFO",2],
  ["Sleepy",0.5],
  ["Bull",null],
  ["Paint",5],
  [":3",4.5],
  ["Tie",3.75],
  ["Spider",3.5],
  ["Matteo Hat",3.5],
  ["Galactic",3],
  ["Explosive",3],
  ["Shark Fin",3],
  ["Job Application",null],
  ["Reindeer Pet",5],
  ["Santa Hat",4],
  ["Jack O' Lantern Pet",4.5],
  ["RIP Gravestone",3.5],
  ["Witch Hat",3],
  ["Bunny Ears",4.5],
  ["Pink Egg",6.5],
  ["Blue Egg",5],
  ["Green Egg",4],
  ["Orange Egg",3],
  ["1 Year",5.5],
  ["26",5],
  ["10B",3],
  ["Rainbow Balloon",6.5],
  ["Pink Balloon",5.5],
  ["Red Balloon",5],
  ["Blue Balloon",4],
  ["Green Balloon",3.5],
  ["Orange Balloon",3],
  ["Halo",5],
  ["Bee",null],
  ["Fire Bee",null],
  ["Ice Bee",null],
  ["Queen Bee",null],
  ["Lucky",5],
  ["Sun",5],
  ["Ball",5],
  ["Chocolate",4.5],
  ["Skeleton",3],
  ["Brazil",5],
  ["Indonesian",4],
  ["Sombrero",4],
  ["Algeria",4.5],
  ["Argentina",4.5],
  ["Australia",4.5],
  ["Austria",4.5],
  ["Belgium",4.5],
  ["Bosnia and Herzegovina",4.5],
  ["Canada",4.5],
  ["Cape Verde",4.5],
  ["Colombia",null],
  ["Croatia",4.5],
  ["Curacao",4.5],
  ["Czechia",4.5],
  ["DR Congo",4.5],
  ["Ecuador",4.5],
  ["Egypt",4.5],
  ["England",4.5],
  ["France",4.5],
  ["Germany",4.5],
  ["Ghana",4.5],
  ["Haiti",4.5],
  ["Iran",4.5],
  ["Iraq",4.5],
  ["Ivory Coast",4.5],
  ["Japan",4.5],
  ["Jordan",4.5],
  ["Mexico",4.5],
  ["Morocco",4.5],
  ["Netherlands",4.5],
  ["New Zealand",4.5],
  ["Norway",4.5],
  ["Panama",4.5],
  ["Paraguay",4.5],
  ["Portugal",4.5],
  ["Qatar",4.5],
  ["Saudi Arabia",4.5],
  ["Scotland",4.5],
  ["Senegal",4.5],
  ["South Africa",4.5],
  ["South Korea",4.5],
  ["Spain",4.5],
  ["Sweden",4.5],
  ["Switzerland",4.5],
  ["Tunisia",4.5],
  ["Turkey",4.5],
  ["United States",4.5],
  ["Uruguay",4.5],
  ["Uzbekistan",4.5],
  ["Comet-struck",2.5],
  ["Snowy",2],
  ["Wet",1.5]
];

// Trait dates from the supplied roster. Only documented values support exact lookups.
// https://stealabrainrot.wiki/wiki/witching-hour-event/
// https://stealabrainrot.wiki/wiki/update-log/update-08/
// https://stealabrainrot.wiki/wiki/update-log/update-39/
const TRAIT_RELEASES = {
  "26": ["reported","New Year's Machine – Jan 1, 2026"],
  "Strawberry": ["reported","Released Aug 30, 2025 – Update 14"],
  "Meowl": ["reported","Released Oct 18, 2025 – Update 21"],
  "John Pork": ["reported","Released May 2, 2026 – Update 49"],
  "Skibidi": ["reported","Released Dec 27, 2025 – Update 31"],
  "Granny": ["reported","Released Mar 21, 2026 – Update 43"],
  "Fire": ["reported","Released June 2025 – Update 5+"],
  "Rose": ["reported","Released Jan 17, 2026 – Update 34"],
  "Fireworks": ["reported","Released July 4–5, 2025 – Update 6"],
  "Nyan": ["reported","Released June 28, 2025 – Update 5"],
  "Lightning": ["reported","Released Summer 2025 – Admin Abuse"],
  "Burger": ["reported","Released May 30, 2026 – Update 52.5"],
  "Aura Shades": ["reported","Released June 6, 2026 – Update 52.75"],
  "Disco": ["reported","Released Summer 2025 – Admin Abuse"],
  "Glitched": ["reported","Released July 18, 2025 – Update 8"],
  "Claws": ["reported","Released Summer 2025 – Admin Abuse"],
  "Zombie": ["reported","Released Nov 15, 2025 – Update 25"],
  "Bubblegum": ["documented","2025-07-18"],
  "Taco": ["reported","Released June 28, 2025 – Update 5"],
  "UFO": ["reported","Released Summer 2025 – Admin Abuse"],
  "Sleepy": ["reported","Released Summer 2025 – Admin Abuse"],
  "Bull": ["reported","Released July 25, 2026 – Update 59 / Spain Event"],
  "Paint": ["reported","Chicleteira Bicicleteira Ritual – Late 2025"],
  ":3": ["reported","Mi Gatito Ritual – Jan 31, 2026 / Update 36"],
  "Tie": ["reported","Dul Dul Dul Ritual – Late 2025"],
  "Spider": ["reported","Sammyni Spyderini Ritual – Aug 23, 2025 / Update 13"],
  "Matteo Hat": ["reported","Matteo Ritual – Aug 23, 2025 / Update 13"],
  "Galactic": ["reported","La Vacca Saturno Saturnita Ritual – Aug 23, 2025 / Update 13"],
  "Explosive": ["reported","Bombardiro Crocodilo Ritual – Aug 23, 2025 / Update 13"],
  "Shark Fin": ["reported","Orcalero Orcala Ritual – Aug 23, 2025 / Update 13"],
  "Job Application": ["reported","Job Job Job Sahur Ritual – Aug 1, 2026 / Update 60"],
  "Money": ["reported","Money Puggy Ritual – Sept 5, 2026 / Update 65"],
  "Rainbow Balloon": ["reported","All released March 21, 2026 – Update 43"],
  "Pink Balloon": ["reported","All released March 21, 2026 – Update 43"],
  "Red Balloon": ["reported","All released March 21, 2026 – Update 43"],
  "Blue Balloon": ["reported","All released March 21, 2026 – Update 43"],
  "Green Balloon": ["reported","All released March 21, 2026 – Update 43"],
  "Orange Balloon": ["reported","All released March 21, 2026 – Update 43"],
  "Pink Egg": ["reported","Released March 28 – April 4, 2026 – Updates 44–45"],
  "Blue Egg": ["reported","Released March 28 – April 4, 2026 – Updates 44–45"],
  "Bunny Ears": ["reported","Released March 28 – April 4, 2026 – Updates 44–45"],
  "Green Egg": ["reported","Released March 28 – April 4, 2026 – Updates 44–45"],
  "Orange Egg": ["reported","Released March 28 – April 4, 2026 – Updates 44–45"],
  "Lucky": ["reported","St. Patrick's Day – Mar 14, 2026 / Update 42"],
  "Sun": ["reported","Summer Hour – June 13, 2026 / Update 53"],
  "Ball": ["reported","Live Match Events – June 27, 2026 / Update 55"],
  "Chocolate": ["reported","Valentine's Day – Feb 7, 2026 / Update 37"],
  "Skeleton": ["reported","Extinct Event – Sept 13, 2025 / Update 16"],
  "Jack O' Lantern Pet": ["reported","Released Oct 25, 2025 – Update 22"],
  "RIP Gravestone": ["reported","Released Oct 25, 2025 – Update 22"],
  "Witch Hat": ["documented","2025-10-11"],
  "Bat": ["reported","Trick or Treat – Oct 31, 2026 / Update 73"],
  "Bee": ["reported","All released August 8–29, 2026 – Updates 61–64"],
  "Fire Bee": ["reported","All released August 8–29, 2026 – Updates 61–64"],
  "Ice Bee": ["reported","All released August 8–29, 2026 – Updates 61–64"],
  "Queen Bee": ["reported","All released August 8–29, 2026 – Updates 61–64"],
  "1 Year": ["reported","1 Year Anniversary – May 16, 2026 / Update 51"],
  "10B": ["reported","10 Billion Visits – Nov 15, 2025 / Update 25"],
  "Comet-struck": ["reported","Launched starting June 28, 2025 – Update 5"],
  "Snowy": ["reported","Launched starting June 28, 2025 – Update 5"],
  "Wet": ["reported","Launched starting June 28, 2025 – Update 5"],
  "Reindeer Pet": ["reported","Released Dec 13–20, 2025 – Updates 29–30"],
  "Santa Hat": ["reported","Released Dec 6, 2025 – Update 28"],
  "Halo": ["documented","2026-02-21"],
  "Brazil": ["reported","Brazil Event – Aug 15, 2025 / Update 12"],
  "Indonesian": ["reported","Indonesia Event – Oct 18, 2025 / Update 21"],
  "Sombrero": ["reported","Mexico Event – Sept 20, 2025 / Update 17"],
  "Algeria": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Argentina": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Australia": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Austria": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Belgium": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Bosnia and Herzegovina": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Canada": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Cape Verde": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Colombia": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Croatia": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Curacao": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Czechia": ["event date","2026-06-27 (Update 55, Futbol)"],
  "DR Congo": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Ecuador": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Egypt": ["event date","2026-06-27 (Update 55, Futbol)"],
  "England": ["event date","2026-06-27 (Update 55, Futbol)"],
  "France": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Germany": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Ghana": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Haiti": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Iran": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Iraq": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Ivory Coast": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Japan": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Jordan": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Mexico": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Morocco": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Netherlands": ["event date","2026-06-27 (Update 55, Futbol)"],
  "New Zealand": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Norway": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Panama": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Paraguay": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Portugal": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Qatar": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Saudi Arabia": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Scotland": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Senegal": ["event date","2026-06-27 (Update 55, Futbol)"],
  "South Africa": ["event date","2026-06-27 (Update 55, Futbol)"],
  "South Korea": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Spain": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Sweden": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Switzerland": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Tunisia": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Turkey": ["event date","2026-06-27 (Update 55, Futbol)"],
  "United States": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Uruguay": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Uzbekistan": ["event date","2026-06-27 (Update 55, Futbol)"]
};

const STORED_AI_PROMPT = `You are TRACED RIDDLER, a deterministic solver for Steal a Brainrot (SAB) riddles and code clues.

PRIMARY GOAL
Return the exact answer fragment the game expects. Do not chat. Do not explain reasoning.

SOURCE PRIORITY
1. Rules and authoritative hardcoded game facts in this prompt.
2. RECENT CLIENT DATA supplied with the request. Treat live Animals/Traits/Mutations context from the client as newer than stored Info Book data.
3. The supplied SAB Info Book.
4. Obvious real-world/common-knowledge facts only when the clue is not SAB-specific.
Never invent an SAB-specific fact that is not supported by these sources.

INTERPRETATION
- Treat spelling, capitalization, punctuation, apostrophes, minor grammar mistakes, singular/plural forms, aliases, abbreviations, and partial canonical names flexibly.
- In Sammy/Eternal riddles, "my", "me", "I", "his", and "Sammy" refer to Sammy when context makes that clear.
- Prefer canonical Brainrot, mutation, rarity, trait, update, event, machine, and item names from the Info Book.
- A standalone number is literal. Never turn a bare number into a riddle. Preserve its digits exactly.
- If asked for a name, return the name only. If asked for a count/number, return the number only. If asked for a mutation, return the mutation only.
- "best", "highest", "most", "strongest" means the highest applicable numeric value unless the Info Book explicitly defines otherwise.
- "worst", "lowest", "least", "weakest", "rarest" means the lowest applicable numeric value/count unless wording or the Info Book says otherwise.
- For exist counts, use live/current count data when supplied and never fabricate a missing count.

OUTPUT CONTRACT
- Output ONLY the requested answer value or fragment.
- No explanations, markdown, labels, quotes, prefixes, suffixes, or commentary.
- Never write "Answer:", "Code:", "The answer is", or similar text.
- Use the exact delimiter requested by an outer multipart instruction.
- Do not add a delimiter to a single-part answer.

MULTIPART / CODE RIDDLES
- Solve each clue independently in the original order.
- Do not let one clue alter another clue's meaning.
- Bare numeric pieces remain unchanged.
- When the pieces form a code, concatenate final fragments in clue order with no spaces or punctuation unless the caller explicitly asks for a delimiter.
- Example: "favorite color, my cat, 67" => bluenova67
- Example: "the color of grass, the color of tree bark, the color of sand, 67" => greenbrownyellow67
- If the outer instruction requires ||| between fragments, return the independent fragments with exactly ||| instead of concatenating them.

WORD-ORDER RULES
- "spell X backwards" or a single answer "backwards" means reverse characters.
- "backwards order" or "reverse the order" for a list means reverse list elements, not letters inside the elements.

UPDATE / EVENT RULES
- When asked which update/event/theme something released in, return the update/event/theme NAME if the question asks for the name.
- Return an Update number only when the question explicitly asks for the number.
- Pot Pumpkin release theme/name => Halloween.
- Treat reported trait dates and event dates as approximate context. Give an exact trait debut only when documented. Money is a reported trait name with an unpublished multiplier. 1x1x1x1 is the ritual and its Brainrot reward. Glitched is the associated trait.

SAMMY / ETERNAL HARD FACTS
- Name: Sammy
- Favorite Brainrot: Meowl
- Least Favorite Brainrot: Raccooni Jandelini
- Favorite color: Blue
- Favorite Travis Scott album: Astro World
- Birth month: February
- Age: 24
- Weight: 250
- Place after Admin Abuse: Gym
- Cat name: Nova
- Favorite mutation: Yin Yang
- Anti-cheat developer name: Adam

KNOWN SAB RIDDLE FACTS
- Hacker is scheduled for Saturday, November 21, 2026. Its multiplier and mechanics are unconfirmed. Use the current date and any newer client information for questions about the next mutation.
- Scarino Crowino is a reskin of Fishino Clownino. SAB released on May 15.
- The Brainrot associated with John Pork is Tim Cheese. For the paired earnings clue, the expected number is 5.
- Scorpi is the second scorpion Brainrot. The first was obtained from the RNG Machine.
- Sammyni Spyderini was previously called Chimpanzini Spiderini.
- The Halloween event that gave Brainrots purple hats was Witching Hour.
- The rarest DLC Brainrot from the first minifigure release was Pancake and Syrup.
- The trick-or-treating event Brainrot was Noomy Candy.
- When Sammy skips tacos on Tuesday, the singular answer is enchilada.
- Pum Pum Pum is a reskin of Dug Dug Dug. Halloween is October 31.
- Past event riddles used Eclipse for the new mutation, Phoenix for the best Fuse Brainrot, and Griffin for the strongest Series 2 minifigure. For current questions, use newer supplied game data when available.

COMMON OBJECT COLORS
- grass/leaves/tree/frog => green
- sky/ocean/sea/water => blue
- sun/banana/lemon/cheese/sand => yellow
- snow/cloud/milk/paper => white
- blood/fire/tomato/strawberry/apple/rose => red
- night/coal => black
- orange/carrot/pumpkin => orange
- chocolate/dirt/mud/wood/tree bark => brown
- pig/flamingo => pink
- grape/lavender => purple

MUTATION MODIFIERS — AUTHORITATIVE LAST-WORKING GAME DATA
- Gold 0.25
- Diamond 0.5
- Bloodrot 1
- Candy 3
- Lava 5
- Galaxy 6
- Yin Yang 6.5
- Radioactive 7.5
- Cursed 8
- Rainbow 9
- Divine 9
- Cyber 10
- Phantom 11
- Crystal 12
- Eclipse 12.5
Use these raw values for explicit game-data Modifier questions and tracked 1/1 comparisons. The wiki multiplier is the displayed value and can differ from the raw game field. Prefer live client data when it explicitly supplies the requested field.

BASE SKINS — LAST-WORKING DATA
1 OF 1
Bee Emperor
Bunny Basket
Headless
Honey Bee
John Pork
Meowl
Pot of Gold
Skibidi
Spyder
Strawberry

RANKED 1/1 RULE
For "best/highest 1/1 mutation", compare only that Brainrot's tracked 1/1 mutations and return the highest Modifier mutation from the authoritative mutation table above. For "worst/lowest", return the lowest Modifier mutation. Return only the mutation name.

DATE RULES
A CURRENT DATE CONTEXT is supplied by the Worker. Use it for "today", "current date", "date/day of the month", current month/year, and weekday-relative questions. For date/day of the month, return only the numeric day.

FINAL CHECK
Before answering: use the Info Book instead of guessing SAB facts; preserve literal numbers; preserve multipart order; return only the exact requested value.`;

// Keep the full prompt readable in source. Select optional sections once per request.
const promptSections = STORED_AI_PROMPT.split(/\n\n(?=[A-Z][A-Z /0-9—-]+\n)/);
const optionalPromptSections = new Map([
  ["MULTIPART / CODE RIDDLES", /\b(code|concatenate|fragment|combine|join|plus|delimiter)\b/],
  ["WORD-ORDER RULES", /\b(reverse|backwards|backward|reversed)\b/],
  ["UPDATE / EVENT RULES", /\b(update|event|theme|release|released|launch|introduced|added|pot pumpkin)\b/],
  ["SAMMY / ETERNAL HARD FACTS", /\b(sammy|eternal|my|me|i|his|favorite|favourite|least favorite|admin abuse|anti cheat|anticheat)\b/],
  ["KNOWN SAB RIDDLE FACTS", /\b(brainrot|reskin|scarino|fishino|john pork|tim cheese|scorpi|scorpion|sammyni|spyderini|halloween|witching|dlc|minifigures?|toys?|tacos?|enchiladas?|dug dug dug|fuse|new mutation|next mutation|hacker|eclipse|phoenix|griffin|sab|steal a brainrot|released?|trick or treating)\b/],
  ["COMMON OBJECT COLORS", /\b(color|colour|colored|coloured|shade)\b/],
  ["MUTATION MODIFIERS — AUTHORITATIVE LAST-WORKING GAME DATA", /\b(mutations?|modifier|multiplier|multiplies|gold|diamond|bloodrot|candy|lava|galaxy|yin yang|yinyang|radioactive|cursed|rainbow|divine|cyber|phantom|crystal|eclipse)\b|1\s*(?:\/|of)\s*1\b/],
  ["BASE SKINS — LAST-WORKING DATA", /\b(base|skins?|one of one)\b|1\s*(?:\/|of)\s*1\b/],
  ["RANKED 1/1 RULE", /\bone of one\b|1\s*(?:\/|of)\s*1\b/],
  ["DATE RULES", /\b(today|tomorrow|yesterday|date|day|month|year|weekday|monday|tuesday|wednesday|thursday|friday|saturday|sunday|current|recent|now|ago|next|last)\b/],
]);

function buildPromptContext(clues, {multipart=false, recentContext="", infoContext=""} = {}) {
  const question = clues.toLowerCase().replace(/[^a-z0-9/]+/g, " ");
  const selected = promptSections.filter(section => {
    const heading = section.split("\n", 1)[0];
    const trigger = optionalPromptSections.get(heading);
    return !trigger || trigger.test(question) || (multipart && heading === "MULTIPART / CODE RIDDLES");
  });
  if (optionalPromptSections.get("DATE RULES").test(question)) {
    selected.push("=== CURRENT DATE CONTEXT ===\n" + currentPromptContext());
  }
  if (/\bmutations?\b/.test(question)) {
    selected.push("=== WIKI MUTATION DATA ===\nName | displayed multiplier | release date\n" +
      WIKI_MUTATIONS.map(([name, value, date]) => name + " | " + value + "x | " + (date || "—")).join("\n"));
  }
  if (/\btraits?\b/.test(question)) {
    const wantsDates = /\b(when|release|released|introduced|added|debut|date|month|year|first appeared)\b/.test(question);
    const mentioned = WIKI_TRAITS.filter(([name]) => {
      const key = normalizeDirect(name);
      return key && (" " + normalizeDirect(clues) + " ").includes(" " + key + " ");
    });
    const rows = wantsDates && mentioned.length ? mentioned : WIKI_TRAITS;
    selected.push("=== WIKI TRAIT DATA ===\nName | multiplier" + (wantsDates ? " | release evidence" : "") + "\n" +
      rows.map(([name, value]) => {
        const release = TRAIT_RELEASES[name];
        return name + " | " + (value == null ? "unpublished" : value + "x")
          + (wantsDates ? " | " + (release ? release.join(": ") : "unknown") : "");
      }).join("\n"));
  }
  if (recentContext) selected.push("=== RECENT SAMMY CONTEXT ===\n" + recentContext);
  if (infoContext) selected.push("=== RELEVANT SAB INFO BOOK ===\n" + infoContext);
  return selected.join("\n\n");
}


const json = (data, status=200) => Response.json({...data, workerVersion:WORKER_CACHE_VERSION}, {
  status,
  headers: {
    "cache-control": "no-store",
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "content-type,x-riddler-token",
    "access-control-allow-methods": "POST,OPTIONS"
  }
});

const normalizeDirect = value => String(value || "")
  .toLowerCase()
  .replace(/<[^>]*>/g, " ")
  .replace(/[’']/g, "'")
  .replace(/[^a-z0-9']+/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const directAnswers = new Map([
  ["my name","sammy"],
  ["what is my name","sammy"],
  ["whats my name","sammy"],
  ["what's my name","sammy"],
  ["sammy name","sammy"],
  ["the color of my avatar","red"],
  ["the colour of my avatar","red"],
  ["my avatar color","red"],
  ["my avatar colour","red"],
  ["my cats name","nova"],
  ["my cat name","nova"],
  ["my cat's name","nova"],
  ["name of my cat","nova"],
  ["my favorite brainrot","meowl"],
  ["my favourite brainrot","meowl"],
  ["favorite brainrot","meowl"],
  ["favourite brainrot","meowl"],
  ["my least favorite brainrot","raccooni jandelini"],
  ["my least favourite brainrot","raccooni jandelini"],
  ["my favorite color","blue"],
  ["my favourite colour","blue"],
  ["my favorite mutation","yin yang"],
  ["my favourite mutation","yin yang"],
  ["my birth month","february"],
  ["my birthday month","february"],
  ["my age","24"],
  ["my weight","250"],
  ["the color of grass","green"],
  ["the color of the grass","green"],
  ["what color is grass","green"],
  ["what colour is grass","green"],
  ["grass color","green"],
  ["grass colour","green"],

  ["the color of tree bark","brown"],
  ["the color of the tree bark","brown"],
  ["the colour of tree bark","brown"],
  ["the colour of the tree bark","brown"],
  ["what color is tree bark","brown"],
  ["what colour is tree bark","brown"],
  ["tree bark color","brown"],
  ["tree bark colour","brown"],
  ["bark color","brown"],
  ["bark colour","brown"],

  ["the color of sand","yellow"],
  ["the color of the sand","yellow"],
  ["the colour of sand","yellow"],
  ["the colour of the sand","yellow"],
  ["what color is sand","yellow"],
  ["what colour is sand","yellow"],
  ["sand color","yellow"],
  ["sand colour","yellow"]
]);

// Keep these patterns specific to the known clues so nearby questions can use the Info Book.
const knownRiddleAnswers = [
  [/\bscarino crowino\b.*\breskin of\b/, "fishino clownino"],
  [/\b(?:day|date) in may\b.*\b(?:sab|steal a brainrot)\b.*\breleas/, "15"],
  [/\bbrainrot\b.*\bassociated with john pork\b/, "timcheese"],
  [/\bscorpi\b.*\bfirst one (?:obtained|acquired)\b/, "rngmachine"],
  [/\bsammyni spyderini\b.*\b(?:called before|previously called|old name)\b/, "chimpanzini spiderini"],
  [/\bhalloween event\b.*\bpurple hats?\b/, "witchinghour"],
  [/\brarest dlc brainrot\b.*\bfirst minifigures\b/, "pancakeandsyrup"],
  [/\bbrainrot\b.*\btrick or treating event\b/, "noomycandy"],
  [/\bmedusa\b.*\bon her head\b/, "snakes"],
  [/\btacos for tuesday\b.*\busually get\b/, "enchilada"],
  [/\breskin of dug dug dug\b/, "pumpumpum"],
  [/^(?:and )?what (?:day|date) is halloween$/, "31"]
];

const eventRiddleAnswers = new Map([
  ["todays new mutation", "eclipse"],
  ["today's new mutation", "eclipse"],
  ["best brainrot in the fuse", "phoenix"],
  ["what is the most op minifigure toy in the new series 2 minifigures", "griffin"]
]);

const NUMBER_ONLY = /^-?\d+(?:\.\d+)?%?$/;

const CAPITALS = new Map([
  ["france","paris"],["italy","rome"],["germany","berlin"],["spain","madrid"],
  ["portugal","lisbon"],["japan","tokyo"],["china","beijing"],["india","newdelhi"],
  ["canada","ottawa"],["mexico","mexicocity"],["brazil","brasilia"],["australia","canberra"],
  ["russia","moscow"],["egypt","cairo"],["england","london"],["britain","london"],
  ["united kingdom","london"],["south korea","seoul"],["north korea","pyongyang"],
  ["argentina","buenosaires"],["sweden","stockholm"],["norway","oslo"],["finland","helsinki"],
  ["denmark","copenhagen"],["ireland","dublin"],["greece","athens"],["turkey","ankara"],
  ["thailand","bangkok"],["vietnam","hanoi"],["philippines","manila"],["indonesia","jakarta"],
  ["singapore","singapore"],["switzerland","bern"],["austria","vienna"],["belgium","brussels"],
  ["netherlands","amsterdam"],["poland","warsaw"],["ukraine","kyiv"],["romania","bucharest"],
  ["hungary","budapest"],["czechia","prague"],["czech republic","prague"],["iceland","reykjavik"],
  ["cuba","havana"],["peru","lima"],["chile","santiago"],["colombia","bogota"],
  ["venezuela","caracas"],["morocco","rabat"],["kenya","nairobi"],["nigeria","abuja"],
  ["ethiopia","addisababa"],["new zealand","wellington"],["united states","washingtondc"],
  ["usa","washingtondc"],["america","washingtondc"]
]);

const CAPITAL_CITY_SELF = new Map([
  ["paris","paris"],["rome","rome"],["berlin","berlin"],["madrid","madrid"],["lisbon","lisbon"],
  ["tokyo","tokyo"],["beijing","beijing"],["ottawa","ottawa"],["brasilia","brasilia"],
  ["canberra","canberra"],["moscow","moscow"],["cairo","cairo"],["london","london"],
  ["seoul","seoul"],["oslo","oslo"],["helsinki","helsinki"],["copenhagen","copenhagen"],
  ["dublin","dublin"],["athens","athens"],["ankara","ankara"],["bangkok","bangkok"],
  ["hanoi","hanoi"],["manila","manila"],["jakarta","jakarta"],["bern","bern"],
  ["vienna","vienna"],["brussels","brussels"],["amsterdam","amsterdam"],["warsaw","warsaw"],
  ["kyiv","kyiv"],["prague","prague"],["reykjavik","reykjavik"],["havana","havana"],
  ["lima","lima"],["santiago","santiago"],["bogota","bogota"],["caracas","caracas"],
  ["rabat","rabat"],["nairobi","nairobi"],["abuja","abuja"],["wellington","wellington"]
]);

function directGenericAnswer(question) {
  const q = normalizeDirect(question);

  const literalWord =
    q.match(/^the word ([a-z0-9]+)$/) ||
    q.match(/^word ([a-z0-9]+)$/) ||
    q.match(/^the literal word ([a-z0-9]+)$/);
  if (literalWord) return literalWord[1];

  // Flexible Sammy/persona phrasing should never need an upstream AI call.
  if (q.includes("least favorite brainrot") || q.includes("least favourite brainrot")) {
    return "raccooni jandelini";
  }
  if (q.includes("favorite brainrot") || q.includes("favourite brainrot")) {
    return "meowl";
  }
  if (q.includes("favorite color") || q.includes("favourite colour")) {
    return "blue";
  }
  if (q.includes("favorite mutation") || q.includes("favourite mutation")) {
    return "yin yang";
  }
  if (q.includes("cat") && q.includes("name")) return "nova";
  if (q.includes("birth") && q.includes("month")) return "february";
  if (q.includes("travis") && q.includes("album")) return "astro world";
  if ((q.includes("my age") || q.includes("sammy age") || q.includes("how old is sammy") || q === "how old am i")) return "24";
  if ((q.includes("my weight") || q.includes("sammy weight") || q.includes("how much does sammy weigh"))) return "250";

  for (const [pattern, answer] of knownRiddleAnswers) {
    if (pattern.test(q)) return answer;
  }

  if (q.includes("capital")) {
    for (const [country, capital] of CAPITALS) {
      if (q.includes(country)) return capital;
    }
    for (const [city, answer] of CAPITAL_CITY_SELF) {
      if (q.includes(city)) return answer;
    }
  }

  return null;
}

function mutationMonthDayAnswer(question) {
  const clue = normalizeDirect(question);
  const match = clue.match(/^(?:what (?:is|was) )?(?:the )?month (?:and )?(?:the )?day (?:of |that |when )?(?:the )?(.+) mutation (?:was )?(?:released|came out|come out|added|introduced)$/);
  if (!match) return null;
  const name = match[1].replaceAll(" ", "");
  const entry = WIKI_MUTATIONS.find(([label]) => normalizeDirect(label).replaceAll(" ", "") === name);
  if (!entry?.[2]) return null;
  const date = new Date(entry[2] + "T12:00:00Z");
  const month = new Intl.DateTimeFormat("en-US", {timeZone:"UTC", month:"long"}).format(date).toLowerCase();
  return month + date.getUTCDate();
}

function documentedTraitReleaseAnswer(question) {
  const q = normalizeDirect(question);
  const match = q.match(/^when (?:did|was) (?:the )?(.+) trait (?:come out|release|released|added|introduced)$/)
    || q.match(/^(?:(?:what is|what's|whats) )?(?:the )?release date (?:of|for) (?:the )?(.+) trait$/);
  if (!match) return null;
  const entry = Object.entries(TRAIT_RELEASES).find(([name]) => normalizeDirect(name) === match[1]);
  if (entry?.[1][0] !== "documented") return null;
  const date = new Date(entry[1][1] + "T12:00:00Z");
  return new Intl.DateTimeFormat("en-US", {timeZone:"UTC", month:"long", day:"numeric", year:"numeric"})
    .format(date).replace(",", "").toLowerCase();
}

function wikiMultiplierAnswer(question) {
  const q = normalizeDirect(question);
  const clue = q.replace(/^(?:what is|what's|whats) /, "").replace(/^the /, "");
  const kindFirst = clue.match(/^(mutation|trait) multiplier (?:of|for) (?:the )?(.+)$/);
  const nameFirst = clue.match(/^(?:multiplier (?:of|for) (?:the )?)?(.+) (mutation|trait)(?: multiplier)?$/);
  if (!kindFirst && !(nameFirst && clue.includes("multiplier"))) return null;
  const kind = kindFirst ? kindFirst[1] : nameFirst[2];
  const name = kindFirst ? kindFirst[2] : nameFirst[1];
  const catalog = kind === "trait" ? WIKI_TRAITS : WIKI_MUTATIONS;
  const entry = catalog.find(([label]) => normalizeDirect(label) === name);
  return entry ? (entry[1] == null ? "unknown" : String(entry[1])) : null;
}

function scheduledMutationAnswer(question) {
  const q = normalizeDirect(question);
  const asksAboutHacker = /\bhacker mutation\b/.test(q);
  const asksAboutNext = /\b(?:next|upcoming) mutation\b/.test(q);
  if (!asksAboutHacker && !asksAboutNext) return null;
  if (!asksAboutHacker && Date.now() >= Date.parse("2026-11-21T00:00:00-06:00")) return null;
  if (/\b(?:modifier|multiplier|odds|chance|income)\b/.test(q)) return null;
  if (/\b(?:what month|which month)\b/.test(q)) return "november";
  if (/\b(?:what year|which year)\b/.test(q)) return "2026";
  if (/\b(?:day of the month|day in november)\b/.test(q)) return "21";
  if (/\b(?:what day|which day|what weekday)\b/.test(q)) return "saturday";
  if (/\b(?:when|date|release date)\b/.test(q)) return "november 21 2026";
  return /^(?:(?:what is|whats|what's|name) (?:the )?)?(?:next|upcoming) mutation(?: (?:called|name))?$/.test(q)
    ? "hacker" : null;
}

function looksSabSpecific(question) {
  const q = normalizeDirect(question);
  return /\b(brainrot|mutation|rarity|fuse|craft|lucky block|admin abuse|sammy|meowl|jandelini|exist count|index|trait|base skin|red carpet|income per second|generation|og)\b/.test(q);
}

function centralDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }).formatToParts(date);

  const out = {};
  for (const part of parts) {
    if (part.type !== "literal") out[part.type] = part.value;
  }
  return out;
}

function currentPromptContext() {
  const p = centralDateParts();
  return [
    "CURRENT DATE CONTEXT (America/Chicago):",
    "weekday=" + (p.weekday || ""),
    "month=" + (p.month || ""),
    "day=" + (p.day || ""),
    "year=" + (p.year || "")
  ].join("\n");
}

function directDateAnswer(question) {
  const q = normalizeDirect(question);

  let offsetDays = 0;

  if (q.includes("day after tomorrow")) {
    offsetDays = 2;
  } else if (q.includes("day before yesterday")) {
    offsetDays = -2;
  } else if (q.includes("tomorrow")) {
    offsetDays = 1;
  } else if (q.includes("yesterday")) {
    offsetDays = -1;
  } else {
    const future =
      q.match(/\bin\s+(\d+)\s+days?\b/) ||
      q.match(/\b(\d+)\s+days?\s+from\s+now\b/) ||
      q.match(/\b(\d+)\s+days?\s+later\b/);

    const past =
      q.match(/\b(\d+)\s+days?\s+ago\b/) ||
      q.match(/\b(\d+)\s+days?\s+before\s+today\b/);

    if (future) offsetDays = Number(future[1]) || 0;
    if (past) offsetDays = -(Number(past[1]) || 0);
  }

  const when = new Date(Date.now() + offsetDays * 86400000);
  const p = centralDateParts(when);

  const asksDay =
    q.includes("date of the month") ||
    q.includes("day of the month") ||
    q.includes("day of month") ||
    q.includes("todays date") ||
    q.includes("today's date") ||
    q.includes("today date") ||
    q.includes("yesterdays date") ||
    q.includes("yesterday's date") ||
    q.includes("tomorrows date") ||
    q.includes("tomorrow's date") ||
    q === "date" ||
    q === "day" ||
    q === "current date" ||
    q === "current day" ||
    /^(?:what is )?(?:the )?day today$/.test(q);

  if (asksDay && p.day) return String(p.day);
  if ((q === "month" || q === "current month" || q.includes("what month")) && p.month) {
    return String(p.month).toLowerCase();
  }
  if ((q === "year" || q === "current year" || q.includes("what year")) && p.year) {
    return String(p.year);
  }
  return null;
}

function directContextAnswer(question, context) {
  const q = normalizeDirect(question);
  const c = String(context || "").toLowerCase();

  const asksDevice =
    q.includes("device") &&
    (q.includes("using") || q.includes("on") || q.includes("right now"));

  if (asksDevice && c) {
    const lines = c.split(/\r?\n/).reverse();
    for (const line of lines) {
      if (/\biphone\b|\bphone\b|\bmobile\b/.test(line)) return "phone";
      if (/\blaptop\b/.test(line)) return "laptop";
      if (/\bipad\b/.test(line)) return "ipad";
      if (/\btablet\b/.test(line)) return "tablet";
      if (/\bdesktop\b|\bcomputer\b|\bpc\b/.test(line)) return "computer";
    }
  }

  return null;
}

const cleanFragment = value => String(value ?? "")
  .replace(/\r/g, "")
  .trim()
  .split(/\n+/)[0]
  .replace(/^(?:ANSWER|CODE)\s*:\s*/i, "")
  .split(/\s*\|\|\s*ALT\s*:/i)[0]
  .replace(/^['"`]+|['"`]+$/g, "")
  .trim();

function splitMultipart(question) {
  let raw = String(question || "").trim();

  raw = raw.replace(/^\s*(?:riddle|question|clue)\s*(?:is)?\s*[:\-]\s*/i, "");

  raw = raw.replace(/\s*\d+\s*\/\s*\d+\s*[:\-]\s*/g, "\n");

  let pieces = raw
    .split(/[;,\n]+|\?\s*(?=(?:and\s+)?(?:what|how|who|when|where|which)\b)|\s+and\s+(?=(?:(?:what|how|who|when|where|which)\b|(?:the\s+)?day\s+today\b))/i)
    .map((piece, index) => index ? piece.trim().replace(/^and\s+/i, "") : piece.trim())
    .filter(Boolean);

  if (pieces.length === 1) {
    const m = raw.match(/^(.*\D)\s+(-?\d+(?:\.\d+)?%?)\s*$/);
    if (m && m[1].trim()) pieces = [m[1].trim(), m[2]];
  }

  return pieces;
}

function isLiveIndexQuestion(question) {
  const q = normalizeDirect(question);
  return (
    q.includes("exist count") ||
    q.includes("copies") ||
    q.includes("cached exist") ||
    q.includes("exist cache") ||
    q.includes("index total") ||
    q.includes("brainrots in the index") ||
    q.includes("mutations scanned") ||
    q.includes("mutation scan count") ||
    /how many .* exist/.test(q)
  );
}

function edgeCacheKey(url, question) {
  const u = new URL(url);
  u.pathname = "/__answer_cache/" + WORKER_CACHE_VERSION + "/" + encodeURIComponent(normalizeDirect(question));
  u.search = "";
  return new Request(u.toString(), {method:"GET"});
}

async function getEdgeAnswer(url, question) {
  if (isLiveIndexQuestion(question) || typeof caches === "undefined") return null;

  try {
    const hit = await caches.default.match(edgeCacheKey(url, question));
    if (!hit) return null;

    const data = await hit.json();
    const answer = cleanFragment(data?.answer);
    return answer || null;
  } catch {
    return null;
  }
}

async function putEdgeAnswer(ctx, url, question, answer) {
  if (isLiveIndexQuestion(question) || typeof caches === "undefined") return;

  const clean = cleanFragment(answer);
  if (!clean) return;

  ctx.waitUntil((async()=>{
    try {
      await caches.default.put(
        edgeCacheKey(url, question),
        new Response(JSON.stringify({answer:clean}), {
          headers:{
            "content-type":"application/json",
            "cache-control":"public, max-age=21600"
          }
        })
      );
    } catch {}
  })());
}

let infoBookCacheText = "";
let infoBookCacheUntil = 0;

async function getInfoBook(url, env, ctx, forceFresh=false) {
  const now = Date.now();

  // Static/general riddles can reuse the already-built Info Book briefly.
  // Live exist-count questions bypass this cache.
  if (!forceFresh && infoBookCacheText && now < infoBookCacheUntil) {
    return infoBookCacheText;
  }

  const response = await baseWorker.fetch(
    new Request(new URL("/", url), {method:"GET"}),
    env,
    ctx
  );

  if (!response.ok) throw new Error("Info Book unavailable");

  const text = await response.text();

  if (!forceFresh) {
    infoBookCacheText = text;
    infoBookCacheUntil = now + 60000;
  }

  return text;
}


function selectInfoBookContext(question, infoBook, maxChars=28000) {
  const source = String(infoBook || "");
  if (!source || source.length <= maxChars) return source;

  const stop = new Set([
    "the","a","an","of","in","on","at","for","from","to","is","are","was","were",
    "what","which","who","when","where","how","my","me","i","his","her","their",
    "best","worst","highest","lowest","most","least","brainrot","brainrots"
  ]);

  const q = normalizeDirect(question);
  const tokens = [...new Set(
    q.split(/\s+/)
      .map(v => v.replace(/[^a-z0-9]/g, ""))
      .filter(v => v.length >= 3 && !stop.has(v))
  )];

  const lines = source.split(/\r?\n/);
  const scored = [];

  for (let i=0; i<lines.length; i++) {
    const normalized = normalizeDirect(lines[i]);
    if (!normalized) continue;

    let score = 0;
    for (const token of tokens) {
      if (normalized.includes(token)) {
        score += token.length >= 8 ? 7 : token.length >= 5 ? 4 : 2;
      }
    }

    if (q.includes("fuse") && normalized.includes("fuse")) score += 5;
    if (q.includes("mutation") && normalized.includes("mutation")) score += 5;
    if (q.includes("trait") && normalized.includes("trait")) score += 5;
    if (q.includes("lucky block") && normalized.includes("lucky block")) score += 6;
    if (q.includes("rarity") && normalized.includes("rarity")) score += 4;
    if ((q.includes("income") || q.includes("generation")) && normalized.includes("generation")) score += 5;
    if ((q.includes("price") || q.includes("cost")) &&
        (normalized.includes("price") || normalized.includes("cost"))) score += 5;

    if (score > 0) scored.push({i, score});
  }

  if (!scored.length) return source.slice(0, maxChars);

  scored.sort((a,b) => b.score - a.score || a.i - b.i);

  const selected = new Set();
  for (const row of scored.slice(0, 140)) {
    for (let j=Math.max(0,row.i-2); j<=Math.min(lines.length-1,row.i+2); j++) {
      selected.add(j);
    }
  }

  let out = "";
  for (const i of [...selected].sort((a,b)=>a-b)) {
    const next = lines[i] + "\n";
    if (out.length + next.length > maxChars) break;
    out += next;
  }

  return out || source.slice(0, maxChars);
}

function uniqueModels(env) {
  const values = [
    env.GEMINI_MODEL,
    "gemini-3.5-flash-lite",
    "gemini-3.8-flash",
    "gemini-3.5-flash"
  ].filter(Boolean);

  return [...new Set(values.map(v => String(v).trim()).filter(Boolean))];
}

function generationConfigFor(model, maxOutputTokens) {
  const config = {
    temperature: 0,
    topP: 0.1,
    candidateCount: 1,
    // Gemini 3 thinking tokens count toward this budget too. Keep enough room
    // that a short answer is not accidentally cut off during reasoning.
    maxOutputTokens: Math.max(Number(maxOutputTokens) || 128, 768)
  };

  if (String(model).startsWith("gemini-3")) {
    config.thinkingConfig = {
      thinkingLevel: "low"
    };
  }

  return config;
}

async function callGemini(env, prompt, maxOutputTokens=128) {
  if (!env.GEMINI_API_KEY) {
    return {ok:false,status:503,error:"AI provider not configured"};
  }

  const models = uniqueModels(env);
  let lastStatus = 0;
  let lastError = "AI temporarily unavailable";

  for (const model of models) {
    const endpoint =
      "https://generativelanguage.googleapis.com/v1beta/models/" +
      encodeURIComponent(model) +
      ":generateContent";

    const requestBody = JSON.stringify({
      contents: [{
        role:"user",
        parts:[{text:String(prompt)}]
      }],
      generationConfig: generationConfigFor(model, maxOutputTokens)
    });

    for (let attempt=1; attempt<=2; attempt++) {
      try {
        const response = await fetch(endpoint, {
          method:"POST",
          headers:{
            "content-type":"application/json",
            "x-goog-api-key":String(env.GEMINI_API_KEY)
          },
          body:requestBody
        });

        lastStatus = response.status;

        if (response.ok) {
          const data = await response.json();

          const answer = String(
            data?.candidates?.[0]?.content?.parts
              ?.map(part => part?.text || "")
              .join("") || ""
          ).trim();

          if (answer) {
            return {
              ok:true,
              status:response.status,
              answer,
              model
            };
          }

          const finishReason =
            data?.candidates?.[0]?.finishReason ||
            data?.promptFeedback?.blockReason ||
            "empty";

          lastError = "Empty AI answer: " + finishReason;
          console.error("Gemini empty answer", JSON.stringify({
            model,
            finishReason
          }));

          // Empty output from one model should try the next model.
          break;
        }

        const errorText = (await response.text()).slice(0,1200);
        lastError = errorText || ("HTTP " + response.status);

        console.error("Gemini upstream error", JSON.stringify({
          model,
          attempt,
          status:response.status,
          body:errorText
        }));

        const modelProblem =
          response.status === 404 ||
          (response.status === 400 &&
            /model|not found|unsupported|unknown|thinking/i.test(errorText));

        if (modelProblem) break;

        const transient =
          response.status === 408 ||
          response.status === 409 ||
          response.status === 429 ||
          response.status >= 500;

        if (!transient || attempt === 2) break;
      } catch (err) {
        lastError = String(
          err?.message || err || "fetch failed"
        ).slice(0,1200);

        console.error("Gemini fetch exception", JSON.stringify({
          model,
          attempt,
          error:lastError
        }));

        if (attempt === 2) break;
      }

      await new Promise(resolve => setTimeout(resolve, 120));
    }
  }

  return {
    ok:false,
    status:502,
    error:"AI unavailable across model fallbacks",
    upstreamStatus:lastStatus || null,
    detail:lastError
  };
}

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);

    if (url.pathname === "/health" && request.method === "GET") {
      return json({
        ok:true,
        worker:"riddler",
        version:WORKER_CACHE_VERSION,
        aiConfigured:Boolean(env.GEMINI_API_KEY),
        tokenConfigured:Boolean(env.RIDDLER_CLIENT_TOKEN),
        configuredModel:env.GEMINI_MODEL || null,
        fallbackModels:uniqueModels(env),
        mode:"ai-first"
      });
    }

    if (url.pathname === "/probe" && request.method === "POST") {
      const clientToken = request.headers.get("x-riddler-token") || "";
      if (!env.RIDDLER_CLIENT_TOKEN || clientToken !== env.RIDDLER_CLIENT_TOKEN) {
        return json({ok:false,error:"Unauthorized"}, 401);
      }

      const ai = await callGemini(
        env,
        "Return only the exact word OK",
        64
      );

      if (!ai.ok) {
        return json({
          ok:false,
          error:ai.error,
          upstreamStatus:ai.upstreamStatus ?? null,
          detail:ai.detail ?? null
        }, ai.status || 502);
      }

      return json({
        ok:true,
        answer:cleanFragment(ai.answer),
        model:ai.model || null
      });
    }

    if (url.pathname === "/" && request.method === "GET") {
      return new Response(JSON.stringify({ok:false,error:"POST only"}), {status:405, headers:{"content-type":"application/json; charset=UTF-8"}});
    }

    if (url.pathname === "/" && request.method === "POST") {
      url.pathname = "/ask";
      request = new Request(url.toString(), request);
    }

    if (url.pathname !== "/ask") {
      return baseWorker.fetch(request, env, ctx);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status:204,
        headers:{
          "access-control-allow-origin":"*",
          "access-control-allow-headers":"content-type,x-riddler-token",
          "access-control-allow-methods":"POST,OPTIONS"
        }
      });
    }

    if (request.method !== "POST") return json({ok:false,error:"POST only"}, 405);

    const clientToken = request.headers.get("x-riddler-token") || "";
    if (!env.RIDDLER_CLIENT_TOKEN || clientToken !== env.RIDDLER_CLIENT_TOKEN) {
      return json({ok:false,error:"Unauthorized"}, 401);
    }

    let body;
    try { body = await request.json(); }
    catch { return json({ok:false,error:"Invalid JSON"}, 400); }

    const originalQuestion = String(body?.question ?? body?.q ?? "").trim();
    const recentContext = String(body?.context ?? "").trim().slice(0, 6000);
    if (!originalQuestion) return json({ok:false,error:"Missing question"}, 400);
    if (originalQuestion.length > 2000) return json({ok:false,error:"Question too long"}, 413);

    // Zero-cost literal path.
    if (NUMBER_ONLY.test(originalQuestion)) {
      return json({ok:true,answer:originalQuestion});
    }

    const pieces = splitMultipart(originalQuestion);
    const useAnswerCache = !recentContext && !pieces.some(piece => directDateAnswer(piece) || /\b(?:next|upcoming) mutation\b/.test(normalizeDirect(piece)));
    const knownEventAnswer = piece => recentContext ? null : scheduledMutationAnswer(piece) || documentedTraitReleaseAnswer(piece) || wikiMultiplierAnswer(piece) || eventRiddleAnswers.get(normalizeDirect(piece));
    const isMultipart = pieces.length > 1;

    if (!isMultipart) {
      const releaseDate = mutationMonthDayAnswer(originalQuestion);
      if (releaseDate) return json({ok:true,answer:releaseDate});
      const genericDirect = directGenericAnswer(originalQuestion);
      if (genericDirect) return json({ok:true,answer:genericDirect});

      const directDate = directDateAnswer(originalQuestion);
      if (directDate) return json({ok:true,answer:directDate});

      const contextDirect = directContextAnswer(originalQuestion, recentContext);
      if (contextDirect) return json({ok:true,answer:contextDirect});

      const direct = directAnswers.get(normalizeDirect(originalQuestion)) || knownEventAnswer(originalQuestion);
      if (direct) return json({ok:true,answer:direct});

      // Fast edge cache first.
      const edgeHit = useAnswerCache && await getEdgeAnswer(url, originalQuestion);
      if (edgeHit) return json({ok:true,answer:edgeHit});

      // Then the existing shared answer store.
      if (useAnswerCache && env.EXIST_RELAY) {
        try {
          const shared = await env.EXIST_RELAY.get(env.EXIST_RELAY.idFromName("eternal")).fetch(
            new Request("https://internal/ai/shared?q=" + encodeURIComponent(originalQuestion))
          );
          if (shared.ok) {
            const hit = await shared.json();
            if (hit?.hit && hit?.answer) {
              const answer = String(hit.answer);
              putEdgeAnswer(ctx, url, originalQuestion, answer);
              return json({ok:true,answer});
            }
          }
        } catch {}
      }
    } else if (useAnswerCache) {
      // Exact repeated multipart riddles can be returned immediately too.
      const edgeHit = await getEdgeAnswer(url, originalQuestion);
      if (edgeHit) return json({ok:true,answer:edgeHit});
    }

    let finalAnswer = "";
    let modelUsed = null;

    if (isMultipart) {
      const slots = new Array(pieces.length);
      const unresolved = [];

      // Resolve literal/direct pieces immediately.
      for (let i=0; i<pieces.length; i++) {
        const piece = pieces[i];

        if (NUMBER_ONLY.test(piece)) {
          slots[i] = piece;
          continue;
        }

        if (slots[i - 1] === "timcheese" && /^how much s does he do(?: in the game)?$/.test(normalizeDirect(piece))) {
          slots[i] = "5";
          continue;
        }

        const genericDirect = directGenericAnswer(piece);
        if (genericDirect) {
          slots[i] = genericDirect;
          continue;
        }

        const releaseDate = mutationMonthDayAnswer(piece);
        if (releaseDate) {
          slots[i] = releaseDate;
          continue;
        }

        const directDate = directDateAnswer(piece);
        if (directDate) {
          slots[i] = directDate;
          continue;
        }

        const contextDirect = directContextAnswer(piece, recentContext);
        if (contextDirect) {
          slots[i] = contextDirect;
          continue;
        }

        const direct = directAnswers.get(normalizeDirect(piece)) || knownEventAnswer(piece);
        if (direct) {
          slots[i] = direct;
          continue;
        }

        unresolved.push({index:i, clue:piece});
      }

      if (unresolved.length === 0) {
        finalAnswer = slots.join("");
        if (useAnswerCache) putEdgeAnswer(ctx, url, originalQuestion, finalAnswer);
        return json({ok:true,answer:finalAnswer,model:modelUsed});
      }

      // Check unresolved clue caches first. Avoid rebuilding the large SAB
      // Info Book for ordinary real-world trivia.
      const cachedPieces = await Promise.all(
        unresolved.map(row => recentContext ? null : getEdgeAnswer(url, row.clue))
      );

      const stillUnresolved = [];
      for (let i=0; i<unresolved.length; i++) {
        const row = unresolved[i];
        const cached = cachedPieces[i];

        if (cached) {
          slots[row.index] = cached;
        } else {
          stillUnresolved.push(row);
        }
      }

      if (stillUnresolved.length === 0) {
        finalAnswer = slots.join("");
        if (useAnswerCache) putEdgeAnswer(ctx, url, originalQuestion, finalAnswer);
        return json({ok:true,answer:finalAnswer});
      }

      const needsInfoBook = stillUnresolved.some(row => looksSabSpecific(row.clue));
      let infoBook = "";

      if (needsInfoBook) {
        try {
          infoBook = await getInfoBook(
            url,
            env,
            ctx,
            isLiveIndexQuestion(originalQuestion)
          );
        } catch (err) {
          console.error("Info Book fetch failed; using fallback context", String(err?.message || err || "unknown"));
          infoBook = "SAB Info Book temporarily unavailable. Solve from the supplied clues and general knowledge. Return only the answers.";
        }
      }

      // ONE AI request for every clue that was not already literal/direct/cached.
      const clueList = stillUnresolved
        .map((row, i) => (i + 1) + ". " + row.clue)
        .join("\n");

      const infoContext = needsInfoBook
        ? selectInfoBookContext(clueList, infoBook)
        : infoBook;

      const prompt =
        buildPromptContext(clueList, {multipart:true, recentContext, infoContext}) +
        "\n\n=== MULTIPART MODE ===\n" +
        "Solve every clue below in order in ONE response.\n" +
        "Return exactly one short answer per clue.\n" +
        "Separate answers ONLY with |||.\n" +
        "No numbering, labels, explanations, markdown, or extra text.\n" +
        "Return exactly " + stillUnresolved.length + " fragments.\n\n" +
        clueList;

      const ai = await callGemini(
        env,
        prompt,
        Math.max(64, Math.min(256, stillUnresolved.length * 48))
      );

      if (!ai.ok) {
        return json({
          ok:false,
          error:ai.error,
          upstreamStatus:ai.upstreamStatus ?? null,
          detail:ai.detail ?? null
        }, ai.status || 502);
      }

      let answers = String(ai.answer)
        .split("|||")
        .map(cleanFragment)
        .filter(v => v !== "");

      if (stillUnresolved.length === 1 && answers.length !== 1) {
        answers = [cleanFragment(ai.answer)];
      }

      if (answers.length !== stillUnresolved.length) {
        console.error("Multipart answer count mismatch", JSON.stringify({
          expected:stillUnresolved.length,
          got:answers.length,
          raw:String(ai.answer).slice(0,800)
        }));
        return json({ok:false,error:"Multipart answer format error"}, 502);
      }

      for (let i=0; i<stillUnresolved.length; i++) {
        const row = stillUnresolved[i];
        const answer = answers[i];
        slots[row.index] = answer;
        if (!recentContext) putEdgeAnswer(ctx, url, row.clue, answer);
      }

      finalAnswer = slots.join("");
    } else {
      let infoBook = "";

      if (looksSabSpecific(originalQuestion)) {
        try {
          infoBook = await getInfoBook(
            url,
            env,
            ctx,
            isLiveIndexQuestion(originalQuestion)
          );
        } catch (err) {
          console.error("Info Book fetch failed; using fallback context", String(err?.message || err || "unknown"));
          infoBook = "SAB Info Book temporarily unavailable. Solve from the supplied question and general knowledge. Return only the answer.";
        }
      }

      const infoContext = looksSabSpecific(originalQuestion)
        ? selectInfoBookContext(originalQuestion, infoBook)
        : infoBook;

      const prompt =
        buildPromptContext(originalQuestion, {recentContext, infoContext}) +
        "\n\n=== QUESTION ===\n" + originalQuestion +
        "\n\nReturn only the final answer.";

      const ai = await callGemini(env, prompt, 96);

      if (!ai.ok) {
        return json({
          ok:false,
          error:ai.error,
          upstreamStatus:ai.upstreamStatus ?? null,
          detail:ai.detail ?? null
        }, ai.status || 502);
      }

      finalAnswer = cleanFragment(ai.answer);
    }

    if (!finalAnswer) return json({ok:false,error:"Empty AI answer"}, 502);

    // Make the next identical request nearly instant and free.
    if (useAnswerCache) putEdgeAnswer(ctx, url, originalQuestion, finalAnswer);

    // Keep the existing shared-answer store in the background.
    if (useAnswerCache && env.EXIST_RELAY) {
      ctx.waitUntil((async()=>{
        try {
          await env.EXIST_RELAY.get(env.EXIST_RELAY.idFromName("eternal")).fetch(
            new Request("https://internal/ai/shared", {
              method:"POST",
              headers:{
                "content-type":"application/json",
                "x-eternal-client-ip":request.headers.get("CF-Connecting-IP") || ""
              },
              body:JSON.stringify({
                question:originalQuestion,
                answer:finalAnswer
              })
            })
          );
        } catch {}
      })());
    }

    return json({ok:true,answer:finalAnswer});
    } catch (err) {
      console.error("Unhandled /ask error", String(err?.stack || err?.message || err || "unknown").slice(0,1600));
      return json({ok:false,error:"Worker internal error"}, 502);
    }
  }
};
