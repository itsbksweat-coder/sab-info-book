import baseWorker from "./worker-v12.js";

const MUTATION_ONE_OF_ONES = String.raw`

MUTATION 1/1s — V13
===================
Canonical category names / synonyms:
- 1/1s
- 1/1
- one of ones
- one-of-ones
- actual 1/1s
- actual one of ones
- real 1/1s
- true 1/1s
- confirmed 1/1s
- mutation 1/1s
- mutation one of ones
- mutation one-of-ones
- mutated 1/1s
- mutation uniques
- unique mutation combos
- unique mutation brainrots

Interpret all of the above as referring to this tracked Mutation 1/1 list unless the question clearly specifies another category.

Tracked Mutation 1/1s:
Lava John Pork
Crystal Strawberry Elephant
Crystal Skibidi Toilet
Rainbow Griffin
Candy Love Love Bear
Galaxy Love Love Bear
Divine Moby Bros
Rainbow Arca Dragon
Bloodrot Elefanto Frigo
Yin Yang Kraken
Cursed Hydra Bunny
Radioactive Hydra Bunny
Cursed Jelly Moby
Candy La Breakfast Combinasion
Crystal Rosey and Teddy
Divine Orchidox
Cyber Orchidox
Cursed Fortunu and Cashuru
Cyber Reinito Sleighito
Divine Reinito Sleighito
Candy Antonio
Cyber Pancake and Syrup
Cursed Kalikia Bros
Bloodrot Kalikia Bros
Candy Sammyni Truckini
Divine La Casa Boo
Divine La Fuse Machine
Cursed La Fuse Machine
Lava Los Admins
Bloodrot Duggy Bros
Cyber Yetimatic
Candy Yetimatic
Bloodrot Yetimatic
Radioactive Los Chillis
Phantom La Ginger Sekolah
Bloodrot Rubiko and Kubiko
Radioactive Rubiko and Kubiko
Cyber Rubiko and Kubiko
Galaxy Rubrikiko
Candy Grabatron
Lava Grabatron
Yin Yang Grabatron
Radioactive Grabatron
Cursed Hopilikalika Hopilikalako
Cyber Rico Dinero
Crystal Rico Dinero
Radioactive Rico Dinero
Yin Yang Rico Dinero
Lava Rico Dinero
Bloodrot Rico Dinero
Crystal Los Primos
Phantom Eviledon
Cyber Eviledon
Bloodrot Globa Stepa
Radioactive Globa Stepa
Yin Yang Sand Sand Sand
Crystal Traledon
Cursed Brutto Gialutto
Divine Raccoonini Jandelini

Matching rules:
- Treat mutation name + Brainrot name as one canonical 1/1 entry.
- Mutation aliases already defined elsewhere apply here too: Bloodrot/Blood Rot, Yin Yang/YinYang/Yin & Yang/Yin and Yang, etc.
- Brainrot punctuation, apostrophe, spacing, capitalization, and unique harmless spelling variants follow the global synonym rules.
- Queries such as "is X a 1/1", "is X an actual 1/1", "is X a mutation 1/1", "which 1/1s", "list the actual 1/1s", "show mutation one of ones", and equivalent wording all use this list.
- Canonical output should preserve the exact mutation + Brainrot spelling shown above.
- Do not invent entries not present in this tracked list.
`;

export default {
  async fetch(request, env, ctx) {
    const response = await baseWorker.fetch(request, env, ctx);
    const url = new URL(request.url);
    if (url.pathname !== "/" || !response.ok) return response;
    const text = await response.text();
    return new Response(text + MUTATION_ONE_OF_ONES, {
      status: response.status,
      headers: response.headers
    });
  }
};
