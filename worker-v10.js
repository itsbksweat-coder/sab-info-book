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

const EXTRA_SYNONYMS = String.raw`

COMPREHENSIVE NATURAL-LANGUAGE SYNONYM EXPANSION — V10
======================================================
These rules supplement every synonym/alias rule already present in the Info Book.

DIRECTION / ORDER
- reverse = reversed = backwards = backward = back-to-front = back to front = in reverse = reverse order = reversed order = opposite order = other way around = the other way round = flip the order = flipped order = invert the order = inverted order = turn the order around = read from the end = end to start = last to first.
- forward = forwards = normal order = original order = listed order = front-to-back = front to back = start to finish = first to last.
- ascending = ascending order = low to high = lowest to highest = least to greatest = smallest to largest.
- descending = descending order = high to low = highest to lowest = greatest to least = largest to smallest.
- chronological = chronological order = oldest to newest = earliest to latest = first released to last released.
- reverse chronological = newest to oldest = latest to earliest = most recent to oldest.
- IMPORTANT: reverse/reversed/backwards means invert the current requested/listed order. It does not automatically mean descending unless the original order is known.

SINGLE-WORD BACKWARDS
- spell backwards = write backwards = reverse the letters = backwards spelling = reverse spelling = letters reversed = flip the letters = write it in reverse.
- If the object is one answer/string/word/name, reverse characters.
- If the object is a list/ranking/fragments, reverse element order.
- "backwards" alone uses the nearest explicit object: word/name/string => character reversal; list/order/ranking/fragments => element reversal.

SEQUENCE / POSITION
- first = 1st = number one = #1 = beginning = earliest position.
- second = 2nd = number two = #2.
- third = 3rd = number three = #3.
- fourth = 4th = number four = #4.
- fifth = 5th = number five = #5.
- sixth = 6th = number six = #6.
- seventh = 7th = number seven = #7.
- eighth = 8th = number eight = #8.
- ninth = 9th = number nine = #9.
- tenth = 10th = number ten = #10.
- last = final = ending = final one = last one.
- next = following = subsequent = one after.
- previous = prior = preceding = one before.
- immediately before = directly before = right before.
- immediately after = directly after = right after.
- between = in between = middle of.

RANKING / COMPARISON
- best = top = highest = strongest = greatest = number one = #1 when using the relevant requested field.
- worst = bottom = lowest = weakest = least = last place when using the relevant requested field.
- better = higher = stronger = greater for the same metric.
- worse = lower = weaker = lesser for the same metric.
- highest income = best income = most income = most money per second = top earner = biggest earner = earns the most = makes the most = generates the most.
- lowest income = worst income = least income = least money per second = lowest earner = earns the least = makes the least = generates the least.
- highest multiplier = best multiplier = biggest multiplier = strongest multiplier = most x.
- lowest multiplier = worst multiplier = smallest multiplier = weakest multiplier = least x.
- most expensive = priciest = highest price = highest cost = costs the most.
- cheapest = least expensive = lowest price = lowest cost = costs the least.
- rarest drop = hardest drop = lowest odds = lowest chance = smallest probability = least likely.
- most common drop = easiest drop = highest odds = highest chance = largest probability = most likely.
- oldest = earliest = first released = first added = came first.
- newest = latest = most recent = last released = last added = came last.

QUESTION WORDING
- what is = what's = whats = tell me = give me = show me = name = identify = which is.
- find = locate = identify = determine = figure out = work out = solve.
- list = give all = show all = name all = enumerate = provide all.
- compare = versus = vs = compare with = compare to.
- sort = order = rank = arrange = organize = organise.
- include = contain = have = feature.
- exclude = without = leave out = omit.
- return only = answer only = just answer = only answer = no explanation.
- explain = describe = tell me about = details on = info on = information about.

IDENTITY / NAME
- name = title = called = named = identity.
- alias = synonym = alternate name = alternative name = other name = nickname = shorthand = short name = AKA = a.k.a. = also known as.
- canonical name = official name = exact name = proper name = full name.
- old name = former name = previous name = legacy name = original name when Notes support it.
- typo = misspelling = misspelled name = spelling mistake = spelling variant.
- no spaces = spaceless = compact form = joined form.
- punctuationless = no punctuation = stripped punctuation.

ENTITY / BRAINROT
- brainrot = brain rot = animal = character = unit = creature = mob when SAB entity context is clear.
- brainrots = brain rots = animals = characters = units = creatures = mobs.
- new brainrot = new animal = new character = new unit.
- all brainrots = every brainrot = all animals = every animal.
- OG brainrot = OG = original-tier brainrot when rarity/entity context is unambiguous.
- secret brainrot = secret = secret-tier brainrot when rarity/entity context is unambiguous.
- brainrot god = god brainrot = BG brainrot when rarity context is explicit.
- duo = pair = two-character brainrot when Notes support it.
- trio = group of three when Notes support it.

RARITY
- rarity = tier = class = grade = category.
- common = common rarity = common tier.
- rare = rare rarity = rare tier.
- epic = epic rarity = epic tier.
- legendary = legendary rarity = legendary tier = leg when unambiguous.
- mythic = mythic rarity = mythic tier = myth when unambiguous.
- brainrot god = brainrot god rarity = god rarity = god tier = BG rarity.
- honey = honey rarity = honey tier = bee rarity when source says Honey.
- secret = secret rarity = secret tier = sec when unambiguous.
- OG = OG rarity = OG tier.
- unreleased = upcoming = not released = unreleased rarity when explicitly marked.

INCOME / MONEY
- income = earnings = earning rate = money rate = production = generation = payout = cash generation.
- income per second = per second = per sec = /s = each second = every second = money per second = cash per second = dollars per second = earning per second.
- makes = earns = generates = produces = pays when followed by a per-second value.
- K = thousand; M = million; B = billion; T = trillion; Q = quadrillion.
- k/s = K/s = thousand per second.
- m/s = M/s = million per second in SAB income context.
- b/s = B/s = billion per second in SAB income context.

COST / PRICE
- cost = price = purchase price = buy price = price tag = amount to buy = buy for.
- costs = priced at when purchase-cost context is clear.
- expensive = high cost = high price.
- cheap = low cost = low price.

SOURCE / OBTAIN
- obtain = source = obtained from = obtainable from = get from = gotten from = comes from = came from = found in = acquired from = awarded by = rewarded by.
- how to get = where to get = where from = how obtained = acquisition method = obtain method.
- source machine = obtained from machine = machine it comes from.
- source event = obtained from event = event it comes from.
- source lucky block = block it comes from = lucky block it drops from.
- red carpet = carpet = the carpet when SAB obtain context is explicit.
- code = redeem code = code reward when source is Code.
- fishing = fish = fishing source when source is Fishing.

RELEASE / UPDATE / DATE
- release = released = came out = came in = launched = introduced = added = debuted = first appeared.
- release update = update it released in = update it came out in = added in update = introduced in update = debut update.
- release date = date released = date added = launch date = debut date = when it came out = when it was added.
- update number = update # = patch number = numbered update.
- update name = update theme = event/update title = patch name.
- current update = latest update = newest update.
- previous update = prior update = update before.
- next update = following update = update after.
- month = release month = month released in release context.
- year = release year = year released in release context.
- day = release day = day released in release context.
- month and year = month+year = month year = release month/year.
- returned = came back = reappeared = was brought back = came back again = returned to the game.
- removed = deleted = taken out = became unobtainable when the source explicitly says so.
- added back = re-added = restored = brought back = returned when source supports reintroduction.
- Update N = U<N> = upd N = update #N = patch N.
- Preserve Update 52.5 and 52.75 exactly; never round them.
- Jan/Feb/Mar/Apr/Jun/Jul/Aug/Sep/Sept/Oct/Nov/Dec map to full month names.
- M/D/YYYY, MM/DD/YYYY, M-D-YYYY, and YYYY-MM-DD may match the same unambiguous date.
- Ordinal suffixes are optional: 1st = 1, 22nd = 22, 23rd = 23.

EVENTS
- event = themed event = seasonal event = event theme.
- Halloween = Halloween Event = spooky event = fright event = Frightrot = pumpkin event = Witch event.
- Easter = Easter Event = egg event = bunny event = Easter Hour = Egg City.
- St Patricks = St Patrick's = Saint Patrick's = Saint Patricks = St Paddy's = St Paddys = leprechaun event = Lucky Pot event.
- Christmas = Xmas = X-mas = Christmas Event = winter event = holiday event = North Pole event.
- Valentines = Valentine = Valentine's = Valentine's Day = Valentine Event = heart event = Cupid event.
- Summer = Summer Event = summer update = Summer Hour.
- Taco = Taco Event = Taco Tuesday event = taco update = taco merchant event.
- Bee = Bee Event = bee-themed event = honey event.
- Admin War = Admin Abuse War = war event when context is Update 13.
- Admin Abuse = AA = admin event = admin abuse event.
- Eid = Eid Event = Eid Celebration.
- FIFA = FIFA 2026 = football event = soccer event = live match event when trait/country context is explicit.
- Anniversary = 1 Year Event = one year event = anniversary event.

MACHINES / SYSTEMS
- machine = device = station = system = apparatus when a named SAB machine is clearly intended.
- Fuse Machine = Fuse = Fuser = Fusing Machine.
- Craft Machine = Crafting Machine = Crafter = Craft station.
- Rainbow Machine = Rainbow station.
- Bubblegum Machine = Bubble Gum Machine = Gum Machine.
- Witch Fuse = Witch's Fuse = Halloween Fuse = Witch Fuse Machine.
- Brainrot Dealer = Dealer = Dealer Machine.
- Brainrot Trader = Trader = Trading Machine when context is source/machine.
- Santa's Fuse = Santas Fuse = Santa Fuse = Christmas Fuse.
- Santa's Shop = Santas Shop = Santa Shop = North Pole Shop.
- New Years Machine = New Year's Machine = New Year Machine = NY Machine.
- Duels Machine = Duel Machine = Duel station = Duels station.
- Cupids Machine = Cupid's Machine = Cupid Machine = Valentine Machine.
- Trade Machine = Trading Machine = Trade station.
- Divine Admin Machine = Divine Admin when distinct from Divine Fuse.
- Divine Fuse = Divine Fuse Machine = Divine Fuser.
- Egg Incubator = Incubator = Easter Incubator.
- Cyber Craft Machine = Cyber Craft = Cyber Crafter.
- Summer Fuse = Summer Fuse Machine = Summer Fuser.
- Los Traders = Los Trader = Los Trading station.
- RNG Machine = RNG = Random Machine = Randomizer Machine = Random Number Generator Machine.
- Bee Shop = Bee Merchant = Queen Bee Shop = Queen Bee Merchant.
- Bee Admin Machine = Bee Admin = Bee-themed Admin Machine = Update 64 Admin Machine = August 29 Admin Machine.

LUCKY BLOCKS
- lucky block = luckyblock = luck block = block = LB when Lucky Block context is explicit.
- drop = reward = outcome = pull = result = item inside = brainrot inside.
- drops = rewards = outcomes = contents = possible pulls = possible results.
- drop chance = chance = odds = probability = percentage = percent = rate = drop rate.
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
- Premium Bee Lucky Block = Premium Bee Block = Paid Bee Lucky Block = Premium Honey Lucky Block.

TRAITS
- trait = effect = bonus = modifier = trait effect in SAB trait context.
- multiplier = multi = mult = x = times = boost = modifier value.
- best trait = top trait = highest multiplier trait = strongest trait.
- worst trait = bottom trait = lowest multiplier trait = weakest trait.
- Admin Abuse trait = AA trait = admin trait in AA-exclusive context.
- Job Application = Job App = Application trait.
- Aura Shades = Aura Glasses = Shades in trait context.
- Jack O' Lantern Pet = Jack O Lantern Pet = Jackolantern Pet = Pumpkin Pet.
- RIP Gravestone = RIP Grave = Gravestone = Grave Stone.
- Santa Hat = Santa's Hat = Santa cap.
- Reindeer Pet = Reindeer trait.
- Bunny Ears = Bunny Ear = Rabbit Ears.
- 1 Year = One Year = 1-Year = Anniversary trait.
- 10B = 10 Billion = Ten Billion.
- Comet-struck = Comet Struck = Cometstruck.
- Queen Bee = QueenBee trait in trait context.
- Fire Bee = FireBee; Ice Bee = IceBee.
- Indonesia = Indonesian trait.
- United States = USA = U.S.A. = US = U.S. = America in country/FIFA trait context.
- South Korea = Korea = Republic of Korea in country/FIFA context.
- DR Congo = DRC = Democratic Republic of the Congo = Congo DR.
- Ivory Coast = Cote d'Ivoire = Côte d'Ivoire.
- Bosnia and Herzegovina = Bosnia & Herzegovina.
- Czechia = Czech Republic.

MUTATIONS
- mutation = mut = variant = mutation type.
- Bloodrot = Blood Rot = Bloodrot Mutation.
- Rainbow = Rainbow Mutation.
- Candy = Candy Mutation.
- Lava = Lava Mutation.
- Galaxy = Galaxy Mutation.
- Yin Yang = YinYang = Yin & Yang = Yin and Yang.
- Radioactive = Radioactive Mutation = Radio Mutation when unambiguous.
- Cursed = Curse = Cursed Mutation.
- Divine = Divine Mutation.
- Cyber = Cyber Mutation = Cybernetic Mutation.
- Phantom = Phantom Mutation = Ghost Mutation when unambiguous.
- Crystal = Crystal Mutation = Crystalline Mutation.

BASE SKINS
- base skin = base = skin = base cosmetic = base theme in SAB Base Skin context.
- event base = event base skin = seasonal base.
- paid base = paid base skin = purchasable base.
- OG base = OG base skin.
- mutation base = mutation base skin.
- inventory managed = inventory-managed = stored in inventory.
- tradable = tradeable = can be traded = can trade.
- untradable = nontradable = non-tradable = cannot trade = can't trade.
- owned = unlocked = possessed = have.
- unlock = obtain base = get base = acquire base.
- Honey Bee Base = Honey Bee = Bee Base in Base Skin context.
- Bee Emperor Base = Bee Emperor in Base Skin context.
- Red Octo = Octo base in paid/base-image context.
- Pot Of Gold = Pot of Gold = Pot-of-Gold.
- YinYang = Yin Yang = Yin & Yang in Base Skin context.
- Headless = Headless Horseman base in Base Skin context.

COUNT / QUANTITY
- count = amount = quantity = number of = how many = total = total number.
- exist count = existence count = copies = copy count = number existing = how many exist = how many copies.
- total drops = number of drops = how many drops.
- total slots = number of slots = how many slots.
- required = needed = necessary = must collect = have to collect.
- at least = minimum = minimum of.
- at most = maximum = maximum of.
- exactly = precisely = equal to.
- any 10 of 12 = ten out of twelve = 10/12 = collect ten from the twelve = collect any ten.

CHANCE / PROBABILITY
- chance = odds = probability = likelihood = percent = percentage = drop chance = drop rate.
- rarest = lowest probability = lowest chance = smallest odds.
- commonest = most common = highest probability = highest chance = biggest odds.

TIME / TIMER
- timer = cooldown = interval = wait = wait time = cycle time.
- seconds = sec = secs = s in time context.
- minutes = min = mins in time context.
- hours = hr = hrs in time context.
- 900 seconds = 15 minutes when conversion is requested.

DEVELOPERS / PEOPLE
- developer = dev = game developer.
- lead developer = lead dev = head developer.
- management = managers = management team.
- contributor = contrib = contributor team member.
- staff = team = development team in Development Credits context.
- Hasted = HasteD = yHasteeD.
- Sammy = SpyderSammy when the question clearly refers to SAB creator/manager context.
- Jandel = admin-war opponent when asking Sammy's Admin War opponent.

SAMMY FACTS
- favorite = favourite = fav = fave.
- least favorite = least favourite = least fav = least fave = most disliked in preference-fact context.
- favorite brainrot = fav brainrot = fave brainrot.
- least favorite brainrot = least fav brainrot = least fave brainrot.
- favorite color = favourite colour = fav color = fave color.
- favorite Travis Scott album = fav Travis album = favorite Travis album.
- birth month = birthday month = month born.
- age = how old.
- weight = weighs = how much does Sammy weigh.
- place after Admin Abuse = where Sammy goes after Admin Abuse = where he goes after AA.
- cat's name = cat name = cats name = name of Sammy's cat = Sammy cat = his cat's name = pet cat name.
- Nova = Sammy's cat name in personal-fact context.

BOOLEAN
- yes = true = enabled = allowed = supported when asking a boolean fact.
- no = false = disabled = not allowed = unsupported when asking a boolean fact.
- can = is able to.
- cannot = can't = can not = unable to.

TEXT NORMALIZATION
- Ignore capitalization for lookup.
- Treat straight quotes, curly quotes, apostrophes, hyphens, em-dashes, en-dashes, underscores, slashes, periods, commas, colons, semicolons, parentheses, brackets, and repeated punctuation as equivalent separators for entity matching.
- Treat one or more spaces as equivalent.
- Accept no-space joined names when unique.
- Strip diacritics for matching while preserving canonical output spelling.
- & = and.
- Singular/plural forms are interchangeable where unambiguous.
- Common contractions are equivalent: what's = what is; who's = who is; when's = when is; can't = cannot; didn't = did not.
- Chat shorthand: rn = right now; pls/plz = please; info = information; pic = picture; img = image; num = number; amt = amount; max = maximum; min = minimum; avg = average.
- Accept obvious one-edit typos only when a single canonical candidate clearly wins.
- Never map an ambiguous synonym when two canonical SAB entities fit equally well; use surrounding category/source/update context.

RELATION / MEMBERSHIP
- from = out of = obtained from = comes from when source relation is intended.
- in = inside = within = contained in when membership relation is intended.
- has = contains = includes = features.
- belongs to = part of = in the set of.
- released with = added with = introduced alongside when update association is intended.
- linked to = associated with = related to when a source-defined relation exists.
- required for = needed for = used to unlock when unlock requirement is intended.

MULTI-PART RIDDLES
- plus = + = and then = followed by = then = concatenate with when multiple answer fragments are intended.
- concatenate = join = combine = stick together = put together.
- no spaces = without spaces = remove spaces = joined together.
- no punctuation = without punctuation = strip punctuation.
- preserve order = same order = in order = as asked.
- reverse the answer order = backwards order = reverse order = last fragment first.
- solve separately = solve each part = answer each piece = resolve every fragment.

END COMPREHENSIVE NATURAL-LANGUAGE SYNONYM EXPANSION — V10
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
      "User-Agent": "sab-info-book-worker-v10"
    },
    cf: { cacheTtl: 300, cacheEverything: true }
  });
  if (!response.ok) throw new Error(`Failed to fetch ${part}: HTTP ${response.status}`);
  const body = await response.json();
  if (!body || body.encoding !== "base64" || !body.content) throw new Error(`Invalid GitHub payload for ${part}`);
  return decodeGithubContent(body.content).replace(/\s+/g, "");
}

async function rebuildInfoBook() {
  const chunks = await Promise.all(PARTS.map(fetchSeedPart));
  const packed = chunks.join("");
  const binary = atob(packed);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const stream = new Response(bytes).body.pipeThrough(new DecompressionStream("gzip"));
  const base = await new Response(stream).text();
  return base + EXTRA_SYNONYMS;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname !== "/") {
      return new Response("Not Found", { status: 404, headers: { "content-type": "text/plain; charset=UTF-8" } });
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
