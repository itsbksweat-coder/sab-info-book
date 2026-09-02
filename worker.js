const API_BASE = "https://api.github.com/repos/itsbksweat-coder/sab-info-book/contents/.seed/";

const PARTS = [
  "decoded-000.b64",
  "decoded-r-000.b64",
  "d2part0.txt",
  "decoded2-000.b64",
  "dec-000.b64",
  "dec8-000.b64",
  "dec8-001.b64",
  "dec8-002.b64",
  "dec8-003.b64",
  "dec8-004.b64"
];

const SYNONYM_SECTION = String.raw`

UNIVERSAL SYNONYM / ALIAS COVERAGE — ALL INFO BOOK CONTENT
-----------------------------------------------------------
These rules apply globally to EVERY named entity and EVERY supported fact in this Info Book.

GLOBAL NORMALIZATION
- Matching is case-insensitive.
- Trim whitespace and collapse repeated spaces.
- Treat spaces, underscores, hyphens, slashes, periods, commas, colons, semicolons, apostrophes, curly apostrophes, quotes, and parentheses as interchangeable/ignorable separators during lookup.
- Normalize diacritics to plain Latin for matching. Example: Lirilì Larilà = Lirili Larila.
- & = and. Example: Yin & Yang = Yin and Yang = Yin Yang = YinYang.
- Straight and curly apostrophes are equivalent. Santa's = Santa’s. Valentine's = Valentines = Valentine.
- Ignore possessive 's where identity is unchanged.
- Accept singular/plural variants when unambiguous: trait/traits, mutation/mutations, machine/machines, brainrot/brainrots, block/blocks, base/bases, skin/skins, event/events, update/updates.
- Accept compact/no-space forms for names when unique: JohnPork = John Pork, RainbowBalloon = Rainbow Balloon, BrainrotGod = Brainrot God.
- Ignore harmless filler words such as the, a, an, of, from, in, on, at, for, was, is, did, does, what, which, who, when, where, tell me, give me, name, called, answer, riddle, code, question when meaning is preserved.
- Accept obvious one-word-order variations when all significant tokens identify one unique result.
- Accept one obvious typo/spelling correction only when one canonical entity is clearly closer than all others. Do not guess ties.
- Canonical output always uses the exact Info Book value/name.

BRAINROT / ENTITY SYNONYMS
- brainrot = animal = character = unit = mob = creature when SAB context clearly means Brainrot.
- Every Brainrot name automatically matches: canonical spelling, any case, punctuation-free, diacritic-free, spaces removed, separators replaced by spaces, and a unique partial-token form if it cannot collide.
- Alternate/legacy names written in Notes are aliases for that Brainrot.
- dragon -> Dragon Cannelloni when SAB Dragon shorthand is clearly intended.
- Strawberry -> Strawberry Elephant when OG Brainrot context is intended.
- Skibidi -> Skibidi Toilet when OG Brainrot context is intended.
- Headless -> Headless Horseman when OG Brainrot context is intended.
- Spyder -> Spyder Elephant when OG Brainrot context is intended rather than a Base Skin.

RARITY SYNONYMS
- Common = common tier = common rarity.
- Rare = rare tier = rare rarity.
- Epic = epic tier = epic rarity.
- Legendary = legendary tier = legendary rarity = leg when unambiguous.
- Mythic = mythic tier = mythic rarity = myth.
- Brainrot God = brainrot god rarity = god rarity = god = BG when rarity context is explicit.
- Honey = honey rarity = bee rarity when source data labels rarity Honey.
- Secret = secret tier = secret rarity = sec when rarity context is explicit.
- OG = og tier = og rarity.
- Unreleased = unreleased rarity = not released = upcoming where explicitly marked Unreleased.
- rarity = tier = class = category = grade.

FIELD SYNONYMS
- Name: name, called, named, title, which brainrot, what brainrot.
- Rarity: rarity, tier, class, category, grade.
- Income: income, income per second, per second, per sec, /s, cash per second, money per second, earns, earning, makes, making, generates, generation, production, produces, pays per second.
- Cost: cost, price, buy price, purchase price, costs, worth to buy, buy for, how much, price tag.
- Multiplier: multiplier, multi, mult, boost, bonus, x, times, modifier.
- Obtain/Source: obtain, obtained, obtainable from, obtained from, source, comes from, came from, get from, gotten from, found in, acquired from, acquisition, where to get, how to get.
- Release: release, released, came out, came in, introduced, added, debuted, first appeared.
- Update: update, update number, patch, version, release update, added update, introduced update, which update, what update.
- Date: date, release date, released on, added on, what day, when, launch date, debut date.
- Notes: notes, description, info, information, trivia, details, facts, about.
- Chance: chance, odds, probability, percent, percentage, drop rate, droprate, rate, likelihood.
- Image: image, icon, picture, asset, image id, asset id, rbxassetid.
- Timer: timer, cooldown, wait time, interval, spawn timer.
- Tradable: tradable, tradeable, can trade, transferable.
- Owned: owned, unlocked, ownership, have, has.

RANKING / COMPARISON SYNONYMS
- best = highest = top = strongest = greatest; for Brainrots default comparison is income unless another field is named.
- worst = lowest = bottom = weakest = least; for Brainrots default comparison is income unless another field is named.
- richest/highest earning/most income = highest income.
- poorest/lowest earning/least income = lowest income.
- most expensive/priciest/highest cost = highest cost.
- cheapest/least expensive/lowest cost = lowest cost.
- rarest/lowest chance/hardest drop = smallest Lucky Block chance.
- most common/highest chance/easiest drop = largest Lucky Block chance.
- oldest/first/earliest = earliest release/date/update in requested set.
- newest/latest/most recent/last = latest release/date/update in requested set.
- first..tenth = 1st..10th = 1..10 when used as rank positions.

TRAIT SYNONYMS
- trait = effect = trait effect = bonus trait in SAB context.
- best trait in <event> = best <event> trait = <event> best trait = highest multiplier trait in <event>.
- worst trait in <event> = worst <event> trait = <event> worst trait = lowest multiplier trait in <event>.
- AA = Admin Abuse = admin-abuse = admin abuse event.
- Job Application = Job App = Application trait.
- Aura Shades = Aura Glasses = Shades when trait context is explicit.
- Jack O' Lantern Pet = Jack O Lantern Pet = Jackolantern Pet = Pumpkin Pet.
- RIP Gravestone = RIP Grave = Gravestone = Grave Stone when trait context is explicit.
- Santa Hat = Santa's Hat = Santa cap.
- Reindeer Pet = Reindeer when trait context is explicit.
- Bunny Ears = Bunny Ear = Rabbit Ears.
- 1 Year = One Year = 1-Year = Anniversary trait when milestone context is explicit.
- 10B = 10 Billion = Ten Billion.
- Comet-struck = Comet Struck = Cometstruck.
- Queen Bee = QueenBee trait; Fire Bee = FireBee; Ice Bee = IceBee in trait context.
- Indonesia is canonical; Indonesian is a legacy alias.
- Brazil = Brazilian in country-trait context.
- United States = USA = US = U.S. = America in FIFA/country-trait context.
- South Korea = Korea = Republic of Korea in FIFA/country-trait context.
- DR Congo = DRC = Democratic Republic of the Congo = Congo DR.
- Ivory Coast = Côte d'Ivoire = Cote d Ivoire.
- Bosnia and Herzegovina = Bosnia = Bosnia & Herzegovina.
- Czechia = Czech Republic.

MUTATION SYNONYMS
- mutation = mut = mutation type = variant in mutation context.
- Bloodrot = Blood Rot.
- Rainbow = Rainbow Mutation.
- Candy = Candy Mutation.
- Lava = Lava Mutation.
- Galaxy = Galaxy Mutation = Galactic Mutation only when mutation context is explicit.
- Yin Yang = YinYang = Yin & Yang = Yin and Yang.
- Radioactive = Radioactive Mutation = Radio Mutation when unambiguous.
- Cursed = Curse = Cursed Mutation; evil/hell mutation wording -> Cursed.
- Divine = Divine Mutation; good/heaven mutation wording -> Divine.
- Cyber = Cyber Mutation = Cybernetic Mutation when unambiguous.
- Phantom = Phantom Mutation = Ghost mutation when unambiguous.
- Crystal = Crystal Mutation = Crystalline mutation when unambiguous.

MACHINE / SHOP SYNONYMS
- machine = device = station = maker when the named SAB system is otherwise unambiguous.
- Bubblegum Machine = Bubble Gum Machine = Gum Machine.
- Fuse Machine = Fuse = Fusing Machine.
- Craft Machine = Crafting Machine = Crafter.
- Witch Fuse = Witch's Fuse = Witch Fuse Machine = Halloween Fuse.
- Brainrot Dealer = Dealer = Brainrot Dealer Machine.
- Brainrot Trader = Trader = Brainrot Trading Machine when machine/source context is clear.
- Santa's Fuse = Santas Fuse = Santa Fuse = Christmas Fuse.
- Santa's Shop = Santas Shop = Santa Shop = North Pole Shop.
- New Years Machine = New Year's Machine = New Year Machine = NY Machine.
- Duels Machine = Duel Machine = Duels = Duel station.
- Cupids Machine = Cupid's Machine = Cupid Machine = Valentine Machine when update context supports it.
- Trade Machine = Trading Machine = Trade station.
- Divine Admin Machine = Divine Admin when context distinguishes it from Divine Fuse.
- Divine Fuse Machine = Divine Fuse = Divine Fuser.
- Egg Incubator = Incubator = Easter Incubator.
- Cyber Craft Machine = Cyber Craft = Cyber Crafter.
- Summer Fuse = Summer Fuse Machine = Summer Fuser.
- Los Traders = Los Trader = Los Trading.
- RNG Machine = RNG = Random Machine = Random Number Generator Machine.
- Bee Shop = Bee Merchant = Queen Bee Shop = Queen Bee Merchant when asking shop/source.
- Bee Admin Machine = Bee Admin = Bee-themed Admin Machine = Update 64 Admin Machine = August 29 Admin Machine.
- Prefer longest/specific alias over generic machine words.

LUCKY BLOCK SYNONYMS
- Lucky Block = luckyblock = block = LB when Lucky Block context is explicit.
- Mythic Lucky Block = Mythic Block = Mythic LB.
- Brainrot God Lucky Block = Brainrot God Block = God Lucky Block = God Block = BG Lucky Block.
- Secret Lucky Block = Secret Block = Secret LB.
- Admin Lucky Block = Admin Block = Admin LB.
- Taco Lucky Block = Taco Block = Taco LB.
- Los Lucky Blocks = Los Lucky Block = Los Blocks.
- Los Taco Blocks = Los Taco Block = Los Taco Lucky Blocks.
- Spooky Lucky Block = Spooky Block = Halloween Lucky Block.
- Festive Lucky Block = Festive Block = Christmas Lucky Block = Xmas Lucky Block.
- Heart Lucky Block = Heart Block = Valentine Lucky Block = Valentines Lucky Block.
- Leprechaun Lucky Block = Leprechaun Block = St Patricks Lucky Block = St Patrick's Lucky Block.
- Egg Lucky Block = Egg Block = Easter Lucky Block.
- Octo Lucky Block = Octo Block = Octopus Lucky Block = Summer Octo Block.
- Bee Lucky Block = Bee Block = Honey Lucky Block = Bee LB.
- Premium Bee Lucky Block = Premium Bee Block = Premium Honey Lucky Block = Paid Bee Lucky Block.
- drop = reward = outcome = brainrot from = inside = contains for Lucky Block contents.

EVENT SYNONYMS
- Halloween = Halloween Event = spooky event = Frightrot event = pumpkin event = Witch event when source context supports it.
- Easter = Easter Event = Easter Hour = Egg City = egg event = bunny event.
- St Patricks = St Patrick's = Saint Patricks = St Paddy's = St Paddys = Leprechaun event = Lucky Pot event.
- Christmas = Christmas Event = Xmas = X-mas = holiday event = winter event = North Pole event where source context supports it.
- Valentines = Valentine's = Valentine = Valentines Event = Valentine's Day = Heart event = Cupid event.
- Summer = Summer Event = summer update = Summer Hour.
- Taco = Taco Event = taco update = Taco Merchant event.
- Bee = Bee Event = honey event = Bee Shop event when event context is requested.
- Admin War = Admin Abuse War = Admin War event = Sammy vs Jandel war.
- Admin Abuse = AA = admin event = admin abuse event.
- Bloodmoon = Blood Moon = Bloodmoon Event.
- Mexico Event = Mexico = Mexican event in event/update context.
- Indonesia Event = Indonesia = Indonesian event in event/update context.
- Extinct Event = Extinct = extinction event.
- 1 Year Event = One Year Event = 1-Year Anniversary = Anniversary Event.
- Futbol Update = Football Update = Soccer Update = FIFA update for Update 55 context.
- part 1 = pt 1 = part one = p1; part 2 = pt 2 = part two = p2.

BASE SKIN SYNONYMS
- base skin = base = skin = base theme when SAB base context is clear.
- Default = Normal = Normal Base = Default Base.
- Red Octo = Octo base = Red Octopus base in Paid Base Skin context.
- Pot Of Gold = Pot of Gold = Gold Pot base.
- Valentines base = Valentine's base = Valentine base.
- YinYang base = Yin Yang base = Yin & Yang base.
- Headless base = Headless Horseman base in Base Skin context.
- Skibidi base = Skibidi Toilet base in Base Skin context.
- Strawberry base = Strawberry Elephant base in Base Skin context.
- Spyder base = Spyder Chain base = Spyder Chain Required base in Base Skin context.
- Bee Emperor = Emperor Bee base.
- Honey Bee = HoneyBee base = Honey Bee Base = Bee collection base.
- SpyderSammy's Base = Spyder Sammy Base = Sammy Base; Legacy/Old/New qualifiers remain significant.
- Tralalero Base = Tralalero base skin.

HONEY BEE BASE COLLECTION SYNONYMS
- unlock/get/obtain Honey Bee Base = requirement for Honey Bee Base = Honey Bee Base requirement.
- how many required = how many needed = number needed = required count.
- eligible brainrots = linked brainrots = counting brainrots = brainrots that count = collection pool.
- Canonical rule: collect any 10 of the 12 Honey Bee-linked Brainrots.

UPDATE / DATE SYNONYMS
- Update N = U<N> = upd N = update #N = patch N.
- Preserve Update 52.5 and 52.75 exactly; never round.
- Jan/Feb/Mar/Apr/Jun/Jul/Aug/Sep/Sept/Oct/Nov/Dec map to full month names.
- M/D/YYYY, MM/DD/YYYY, M-D-YYYY, and YYYY-MM-DD may match the same unambiguous date.
- Ordinal suffixes are optional: 1st = 1, 22nd = 22, 23rd = 23.
- when did X release = when was X added = X release date = date X came out = when did X drop -> Release Date unless update/event is explicitly requested.
- what update did X release = which update added X = update X came from = X release update -> Release Update.
- what event was X from = event X released in = X event = where X came from -> event/source theme when available.

NUMBER / MONEY SYNONYMS
- K = thousand; M = million; B = billion; T = trillion; Q = quadrillion.
- $400M = 400M = 400 million dollars for cost comparison.
- 1/s = 1 per second; K/s = thousand per second; M/s = million per second.
- 0.5% = .5% = 0.5 percent.
- Redeem-code concatenation returns canonical compact answer with no extra spaces/punctuation unless requested.

SAMMY FACT SYNONYMS
- favorite brainrot = fav brainrot = favourite brainrot = brainrot I like most = Sammy's favorite brainrot.
- least favorite brainrot = least fav brainrot = worst-liked brainrot = Sammy's least favorite brainrot.
- favorite color = favourite colour = fav color = fav colour = color I like = Sammy's favorite color.
- favorite Travis Scott album = favourite Travis Scott album = fav Travis album.
- birth month = birthday month = month born = what month was Sammy born.
- age = how old = years old = Sammy's age.
- weight = how much Sammy weighs = Sammy weight.
- place Sammy goes after Admin Abuse = where Sammy goes after Admin Abuse = after AA location = place after admin abuse = Gym.
- cat name = cat's name = cats name = name of cat = pet cat name = what is the cat called = Sammy's cat name = my cat name when riddle persona is Sammy = Nova.

DEVELOPER / STAFF SYNONYMS
- developer = dev; developers = devs; contributor = contrib; management = managers when credits context is explicit.
- lead developer = lead dev = head developer = main developer = Hasted.
- yHasteeD = HasteD = Hasted = hasted; canonical answer Hasted.
- Developer usernames match case-insensitively and may ignore underscores/spaces if unique: K4RM4_Dev = K4RM4 Dev; Conception_World = Conception World.

DISAMBIGUATION / PRECEDENCE
1. Exact canonical entity/fact.
2. Explicit alias in Info Book or entity Notes.
3. Global normalized canonical-name form.
4. Category-specific synonym rules above.
5. Unique typo/fuzzy match.
6. Semantic Source/Obtain/Release/Event inference.
- Longest/more specific alias wins: Bee Admin Machine > Admin Machine; Premium Bee Lucky Block > Bee Lucky Block; Divine Fuse > Fuse.
- Context resolves shared terms: Queen Bee trait means trait; Queen Bee shop means Bee Shop; Queen Bee brainrot means the Brainrot.
- Newer structured Info Book facts override older migration/reference excerpts.
- Direct current game-module values override stale third-party wording when marked current.
`;

let cachedInfoBook = null;
let cachedAt = 0;
const CACHE_MS = 5 * 60 * 1000;

function decodeGithubContent(content) {
  const cleaned = String(content || "").replace(/\s+/g, "");
  const binary = atob(cleaned);
  let out = "";
  const CHUNK = 8192;
  for (let i = 0; i < binary.length; i += CHUNK) {
    out += String.fromCharCode(...Uint8Array.from(binary.slice(i, i + CHUNK), c => c.charCodeAt(0)));
  }
  return out;
}

async function fetchSeedPart(part) {
  const response = await fetch(API_BASE + encodeURIComponent(part) + "?ref=main", {
    headers: {
      "Accept": "application/vnd.github+json",
      "User-Agent": "sab-info-book-worker"
    },
    cf: { cacheTtl: 300, cacheEverything: true }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${part}: HTTP ${response.status}`);
  }

  const body = await response.json();
  if (!body || body.encoding !== "base64" || !body.content) {
    throw new Error(`Invalid GitHub payload for ${part}`);
  }

  return decodeGithubContent(body.content).replace(/\s+/g, "");
}

async function rebuildInfoBook() {
  const chunks = await Promise.all(PARTS.map(fetchSeedPart));
  const packed = chunks.join("");

  const binary = atob(packed);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

  const stream = new Response(bytes).body.pipeThrough(new DecompressionStream("gzip"));
  const decoded = await new Response(stream).text();
  return decoded + SYNONYM_SECTION;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname !== "/") {
      return new Response("Not Found", {
        status: 404,
        headers: { "content-type": "text/plain; charset=UTF-8" }
      });
    }

    try {
      const now = Date.now();
      if (!cachedInfoBook || now - cachedAt > CACHE_MS) {
        cachedInfoBook = await rebuildInfoBook();
        cachedAt = now;
      }

      return new Response(cachedInfoBook, {
        status: 200,
        headers: {
          "content-type": "text/plain; charset=UTF-8",
          "cache-control": "no-store",
          "x-content-type-options": "nosniff"
        }
      });
    } catch (error) {
      return new Response(`SAB Info Book failed to load: ${error?.message || error}`, {
        status: 500,
        headers: { "content-type": "text/plain; charset=UTF-8" }
      });
    }
  }
};
