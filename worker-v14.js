import baseWorker from "./worker-v13.js";

const ONE_OF_ONE_REVERSE_LOOKUP_SYNONYMS = String.raw`

1/1 MUTATION REVERSE-LOOKUP QUESTION SUPPORT — V14
===================================================
Purpose: support questions that give a Brainrot/entity name and ask which tracked 1/1 mutation belongs to it.

Primary example:
- the 1/1 mutation of Traledon => Crystal

Equivalent wording patterns:
- the 1/1 mutation of <brainrot>
- 1/1 mutation of <brainrot>
- the one of one mutation of <brainrot>
- one of one mutation of <brainrot>
- the actual 1/1 mutation of <brainrot>
- actual 1/1 mutation of <brainrot>
- the real 1/1 mutation of <brainrot>
- real 1/1 mutation of <brainrot>
- the true 1/1 mutation of <brainrot>
- true 1/1 mutation of <brainrot>
- the mutation 1/1 of <brainrot>
- mutation 1/1 of <brainrot>
- the 1/1 mut of <brainrot>
- 1/1 mut of <brainrot>
- the one-of-one mut of <brainrot>
- one-of-one mut of <brainrot>
- <brainrot>'s 1/1 mutation
- <brainrot> 1/1 mutation
- <brainrot>'s one of one mutation
- <brainrot> one of one mutation
- <brainrot>'s actual 1/1 mutation
- <brainrot> actual 1/1 mutation
- what is the 1/1 mutation of <brainrot>
- what's the 1/1 mutation of <brainrot>
- whats the 1/1 mutation of <brainrot>
- what 1/1 mutation does <brainrot> have
- which 1/1 mutation does <brainrot> have
- which mutation is the 1/1 for <brainrot>
- what mutation is the 1/1 for <brainrot>
- which mutation is <brainrot>'s 1/1
- what mutation is <brainrot>'s 1/1
- what is <brainrot>'s 1/1 mutation
- what's <brainrot>'s 1/1 mutation
- tell me the 1/1 mutation of <brainrot>
- give me the 1/1 mutation of <brainrot>
- name the 1/1 mutation of <brainrot>
- find the 1/1 mutation of <brainrot>
- identify the 1/1 mutation of <brainrot>
- <brainrot> mutation one of one
- <brainrot> mutation 1/1
- mutation of <brainrot> that is 1/1
- mutation of <brainrot> that's 1/1
- mutation of <brainrot> that is one of one
- mutation of <brainrot> that's one of one
- unique mutation of <brainrot> in the 1/1 list
- tracked 1/1 mutation of <brainrot>
- confirmed 1/1 mutation of <brainrot>

Normalization:
- 1/1 = 1 of 1 = one of one = one-of-one = actual 1/1 = real 1/1 = true 1/1 = confirmed 1/1 = tracked 1/1 when the tracked mutation-1/1 dataset is intended.
- mutation = mut = mutation type = mutation variant when 1/1 context is explicit.
- of <brainrot> = for <brainrot> = belonging to <brainrot> = <brainrot>'s when asking for that entity's mutation.
- what = which = tell me = give me = name = find = identify do not change the lookup intent.
- Ignore capitalization, apostrophe style, harmless punctuation, repeated spaces, and singular/plural wording differences where meaning is unambiguous.

Resolution rule:
- Search the tracked Mutation 1/1 list by Brainrot/entity name.
- Return the mutation attached to that Brainrot.
- If a Brainrot has multiple tracked 1/1 mutations, return all matching mutation names in the order stored in the Info Book unless the question asks for one specific one.
- Do not infer an unlisted mutation.

Known example from the tracked list:
- Crystal Traledon => questions like "the 1/1 mutation of traledon" must answer exactly: Crystal
`;

export default {
  async fetch(request, env, ctx) {
    const response = await baseWorker.fetch(request, env, ctx);
    const url = new URL(request.url);

    if (url.pathname !== "/" || !response.ok) return response;

    const text = await response.text();
    return new Response(text + ONE_OF_ONE_REVERSE_LOOKUP_SYNONYMS, {
      status: response.status,
      headers: response.headers
    });
  }
};
