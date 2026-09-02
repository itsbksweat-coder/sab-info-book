import baseWorker from "./worker-v11.js";

const SAMMY_FAVORITE_MUTATION_SYNONYMS = String.raw`

SAMMY FAVORITE MUTATION — V12
=============================
Canonical answer: Galaxy

Fact:
- Sammy's favorite mutation is Galaxy.

Treat all of the following as asking for Galaxy:
- Sammy's favorite mutation
- Sammys favorite mutation
- Sammy favorite mutation
- Sammy's fav mutation
- Sammys fav mutation
- Sammy fav mutation
- Sammy's favourite mutation
- Sammys favourite mutation
- Sammy favourite mutation
- Sammy's favorite mut
- Sammy favorite mut
- Sammy's fav mut
- Sammy fav mut
- Sammy's favourite mut
- Sammy favourite mut
- Sammy's preferred mutation
- Sammy preferred mutation
- Sammy's preferred mut
- Sammy preferred mut
- mutation Sammy likes most
- mutation Sammy likes the most
- mutation Sammy likes best
- mutation Sammy prefers
- mutation Sammy prefers most
- mutation Sammy prefers the most
- which mutation does Sammy like most
- which mutation does Sammy like the most
- which mutation does Sammy like best
- which mutation does Sammy prefer
- which mutation does Sammy prefer most
- which mutation does Sammy prefer the most
- what mutation does Sammy like most
- what mutation does Sammy like the most
- what mutation does Sammy like best
- what mutation does Sammy prefer
- what mutation does Sammy prefer most
- what mutation does Sammy prefer the most
- what is Sammy's favorite mutation
- what is Sammys favorite mutation
- what's Sammy's favorite mutation
- whats Sammys favorite mutation
- what is Sammy's fav mutation
- what's Sammy's fav mutation
- what is Sammy's favourite mutation
- what's Sammy's favourite mutation
- what is Sammy favorite mutation
- whats Sammy favorite mutation
- name Sammy's favorite mutation
- name Sammys favorite mutation
- tell me Sammy's favorite mutation
- tell me Sammys favorite mutation
- Sammy mutation favorite
- Sammy mutation fav
- Sammy mutation favourite
- favorite mutation of Sammy
- favourite mutation of Sammy
- fav mutation of Sammy
- preferred mutation of Sammy
- Sammy's number one mutation
- Sammy number one mutation
- Sammy's #1 mutation
- Sammy #1 mutation
- Sammy's top mutation
- Sammy top mutation
- Sammy's best-liked mutation
- Sammy best liked mutation
- Sammy's most liked mutation
- Sammy most liked mutation
- Sammy's mutation of choice
- Sammy mutation of choice
- Sammy's favorite variant
- Sammy favorite variant
- Sammy's fav variant
- Sammy fav variant

Normalization / inference:
- favorite = favourite = fav = preferred = preference = likes most = likes the most = likes best = prefers = prefers most = prefers the most = top = number one = #1 = best-liked = most-liked = of choice.
- mutation = mut = mutation type = mutation variant = variant when Sammy preference context is explicit.
- Sammy's = Sammys = Sammy when possessive meaning is otherwise clear.
- Question fillers such as what, which, is, does, tell me, give me, name, and please do not change the meaning.
- Punctuation, apostrophe style, capitalization, repeated spaces, hyphens, and harmless word-order variations do not change the match when the meaning remains unambiguous.
- Canonical output must be exactly: Galaxy

ONGOING USER-ADDED FACT RULE
- For user-added Info Book facts, include natural synonyms/aliases whenever alternate wording is reasonably required to solve the same fact.
- Do not require the user to separately request synonyms each time.
`;

export default {
  async fetch(request, env, ctx) {
    const response = await baseWorker.fetch(request, env, ctx);
    const url = new URL(request.url);

    if (url.pathname !== "/" || !response.ok) {
      return response;
    }

    const text = await response.text();
    return new Response(text + SAMMY_FAVORITE_MUTATION_SYNONYMS, {
      status: response.status,
      headers: response.headers
    });
  }
};
