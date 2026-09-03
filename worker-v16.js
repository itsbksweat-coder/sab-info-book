import baseWorker from "./worker-v15.js";

const ONE_OF_ONE_RANKED_MUTATION_LOOKUPS = String.raw`

1/1 MUTATION RANKED LOOKUP SUPPORT — V16
========================================
Support questions that ask for the best, worst, strongest, weakest, highest-multiplier, or lowest-multiplier tracked 1/1 mutation belonging to a specific Brainrot/entity.

Primary example:
- the best mutation 1/1 of Rico Dinero => Crystal

Equivalent BEST / HIGHEST patterns:
- the best mutation 1/1 of <brainrot>
- best mutation 1/1 of <brainrot>
- the best 1/1 mutation of <brainrot>
- best 1/1 mutation of <brainrot>
- the best 1/1 of <brainrot>
- best 1/1 of <brainrot>
- <brainrot>'s best mutation 1/1
- <brainrot>'s best 1/1 mutation
- <brainrot> best mutation 1/1
- <brainrot> best 1/1 mutation
- what is the best mutation 1/1 of <brainrot>
- what's the best mutation 1/1 of <brainrot>
- whats the best mutation 1/1 of <brainrot>
- what is the best 1/1 mutation of <brainrot>
- which is the best 1/1 mutation of <brainrot>
- what is <brainrot>'s best 1/1 mutation
- what's <brainrot>'s best 1/1 mutation
- which 1/1 mutation of <brainrot> is best
- what 1/1 mutation of <brainrot> is best
- strongest mutation 1/1 of <brainrot>
- strongest 1/1 mutation of <brainrot>
- highest mutation 1/1 of <brainrot>
- highest 1/1 mutation of <brainrot>
- highest multiplier mutation 1/1 of <brainrot>
- highest multiplier 1/1 mutation of <brainrot>
- 1/1 mutation of <brainrot> with the highest multiplier
- 1/1 mutation of <brainrot> with the biggest multiplier
- top mutation 1/1 of <brainrot>
- top 1/1 mutation of <brainrot>
- number one mutation 1/1 of <brainrot>
- #1 mutation 1/1 of <brainrot>
- most powerful mutation 1/1 of <brainrot>
- most powerful 1/1 mutation of <brainrot>

Equivalent WORST / LOWEST patterns:
- the worst mutation 1/1 of <brainrot>
- worst mutation 1/1 of <brainrot>
- the worst 1/1 mutation of <brainrot>
- worst 1/1 mutation of <brainrot>
- <brainrot>'s worst mutation 1/1
- <brainrot>'s worst 1/1 mutation
- what is the worst mutation 1/1 of <brainrot>
- which 1/1 mutation of <brainrot> is worst
- weakest mutation 1/1 of <brainrot>
- weakest 1/1 mutation of <brainrot>
- lowest mutation 1/1 of <brainrot>
- lowest 1/1 mutation of <brainrot>
- lowest multiplier mutation 1/1 of <brainrot>
- lowest multiplier 1/1 mutation of <brainrot>
- 1/1 mutation of <brainrot> with the lowest multiplier
- bottom mutation 1/1 of <brainrot>
- least powerful 1/1 mutation of <brainrot>

Normalization / intent:
- best = top = strongest = highest = highest multiplier = biggest multiplier = most powerful = number one = #1 when ranking mutations by their mutation multiplier.
- worst = bottom = weakest = lowest = lowest multiplier = smallest multiplier = least powerful when ranking mutations by their mutation multiplier.
- mutation 1/1 = 1/1 mutation = mutation one of one = one-of-one mutation = actual 1/1 mutation = tracked 1/1 mutation when the tracked Mutation 1/1 dataset is intended.
- of <brainrot> = for <brainrot> = belonging to <brainrot> = <brainrot>'s.
- Ignore capitalization, punctuation, apostrophe style, repeated spaces, harmless word-order differences, and common question fillers when intent is unambiguous.

Ranking source:
- Rank ONLY the tracked 1/1 mutations that actually exist for the requested Brainrot/entity.
- Compare those mutation names using the canonical mutation multipliers in the Info Book.
- Do not rank mutations that are not tracked as a 1/1 for that Brainrot.
- If two tracked mutations are tied for the requested rank, return all tied mutation names in stored order.
- Do not invent or infer an unlisted 1/1.

Known Rico Dinero tracked 1/1 mutations:
- Cyber Rico Dinero
- Crystal Rico Dinero
- Radioactive Rico Dinero
- Yin Yang Rico Dinero
- Lava Rico Dinero
- Bloodrot Rico Dinero

Therefore:
- the best mutation 1/1 of Rico Dinero => Crystal
- the strongest 1/1 mutation of Rico Dinero => Crystal
- the highest multiplier 1/1 mutation of Rico Dinero => Crystal
- the worst mutation 1/1 of Rico Dinero => Bloodrot
- the weakest 1/1 mutation of Rico Dinero => Bloodrot
- the lowest multiplier 1/1 mutation of Rico Dinero => Bloodrot

STRICT OUTPUT RULE:
- For these ranked 1/1 reverse-lookup questions, reply with ONLY the mutation name.
- Do NOT include the Brainrot/entity name.
- Do NOT include the full tracked 1/1 entry.
- Do NOT include labels, explanation, multiplier, punctuation, markdown, or extra words.
- Example output for "the best mutation 1/1 of Rico Dinero": Crystal
`;

export default {
  async fetch(request, env, ctx) {
    const response = await baseWorker.fetch(request, env, ctx);
    const url = new URL(request.url);

    if (url.pathname !== "/" || !response.ok) return response;

    const text = await response.text();
    return new Response(text + ONE_OF_ONE_RANKED_MUTATION_LOOKUPS, {
      status: response.status,
      headers: response.headers
    });
  }
};
