import baseWorker from "./worker-v14.js";

const ONE_OF_ONE_MUTATION_ONLY_OUTPUT = String.raw`

1/1 REVERSE-LOOKUP OUTPUT FORMAT — V15
======================================
For any question asking for the 1/1 mutation of a Brainrot/entity, reply with ONLY the mutation name.

Examples:
- the 1/1 mutation of Traledon => Crystal
- what is the 1/1 mutation of Traledon => Crystal
- Traledon's 1/1 mutation => Crystal
- which mutation is the 1/1 for Traledon => Crystal

STRICT OUTPUT RULE:
- Return only the mutation name.
- Do NOT return the Brainrot/entity name.
- Do NOT return the full tracked entry.
- Do NOT return labels such as "Mutation:", "1/1 mutation:", or "Answer:".
- Do NOT explain the answer.
- Do NOT add punctuation unless it is part of the mutation's canonical name.
- Do NOT wrap the answer in quotes, markdown, parentheses, or code formatting.
- Preserve the canonical mutation spelling from the Info Book.

For example, if the tracked entry is:
- Crystal Traledon
then the answer to a reverse-lookup question must be exactly:
Crystal

If multiple tracked 1/1 mutations exist for the same Brainrot/entity:
- Return only the mutation names, without the Brainrot/entity name or explanation.
- Preserve their stored order.
- Separate multiple mutation names with a single comma and space unless the riddle explicitly requires concatenation/no spaces.
`;

export default {
  async fetch(request, env, ctx) {
    const response = await baseWorker.fetch(request, env, ctx);
    const url = new URL(request.url);

    if (url.pathname !== "/" || !response.ok) return response;

    const text = await response.text();
    return new Response(text + ONE_OF_ONE_MUTATION_ONLY_OUTPUT, {
      status: response.status,
      headers: response.headers
    });
  }
};
