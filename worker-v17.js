import baseWorker from "./worker-v16.js";

const EXIST_COUNT_QUESTION_SUPPORT = String.raw`

EXIST COUNT QUESTION SUPPORT — V17
=================================
This section defines how to answer questions using the LIVE Index scanner/cache.

DATA SOURCE RULES
- (mutation) means any mutation currently found by the live Index scanner.
- (brainrot name) means any Brainrot currently captured by the live Index scanner.
- Use the current live/cached Index-scanner values, not old hardcoded example counts.
- If a requested Brainrot or mutation is not present in the live cache, do not invent a value.

DEFAULT BEHAVIOR
- If a Brainrot is named but no mutation is given, use Normal/Default.
- Normal and Default mean the same unmutated mutation.
- If the question explicitly names a mutation, use that mutation instead of Default.

DIRECT EXIST COUNT — RETURN COUNT ONLY
Support these forms and close natural equivalents:
- the exist count of (brainrot name)
- the exist count of (mutation) (brainrot name)
- exist count of (brainrot name)
- exist count of (mutation) (brainrot name)
- (brainrot name) exist count
- (mutation) (brainrot name) exist count
- how many (brainrot name) exist
- how many (mutation) (brainrot name) exist
- how many copies of (brainrot name) are there
- how many copies of (mutation) (brainrot name) are there
- number of (mutation) (brainrot name)
- count of (brainrot name)
- count of (mutation) (brainrot name)
- copies of (brainrot name)
- copies of (mutation) (brainrot name)
- how many of (brainrot name) exist
- how many of (mutation) (brainrot name) exist

Output rule for direct exist-count questions:
- Return ONLY the numeric exist count unless the riddle explicitly asks for other text.
- Do not include the Brainrot name, mutation name, labels, commas-as-explanation, or extra wording unless formatting is explicitly requested.

BRAINROT ACROSS MUTATIONS — RETURN MUTATION ONLY
Support these forms and close natural equivalents:
- the rarest mutation of (brainrot name)
- rarest mutation of (brainrot name)
- the most rare mutation of (brainrot name)
- the least common mutation of (brainrot name)
- the lowest mutation of (brainrot name)
- which mutation has the least (brainrot name)
- which mutation has the fewest (brainrot name)
- which mutation has the lowest exist count for (brainrot name)
- which mutation has the smallest exist count for (brainrot name)
- which mutation is rarest for (brainrot name)
- what mutation is rarest for (brainrot name)
- the most common mutation of (brainrot name)
- the commonest mutation of (brainrot name)
- the highest mutation of (brainrot name)
- which mutation has the most (brainrot name)
- which mutation has the highest exist count for (brainrot name)
- which mutation has the largest exist count for (brainrot name)
- which mutation is most common for (brainrot name)
- what mutation is most common for (brainrot name)
- rarest variant of (brainrot name)
- rarest version of (brainrot name)
- most common variant of (brainrot name)
- most common version of (brainrot name)

Resolution:
- Compare all currently scanned/cached mutations available for that Brainrot.
- Rarest means the mutation with the lowest exist count.
- Most common means the mutation with the highest exist count.
- Return ONLY the mutation name.
- If multiple mutations tie, return all tied mutation names in scanner/cache order, separated by a comma and space unless the riddle requests concatenation.

BRAINROT ACROSS MUTATIONS — RETURN COUNT ONLY
Support:
- rarest exist count of (brainrot name)
- lowest exist count of (brainrot name)
- smallest exist count of (brainrot name)
- minimum exist count of (brainrot name)
- fewest copies of (brainrot name)
- least copies of (brainrot name)
- highest exist count of (brainrot name)
- largest exist count of (brainrot name)
- maximum exist count of (brainrot name)
- most copies of (brainrot name)
- commonest exist count of (brainrot name)
- rarest count of (brainrot name)
- most common count of (brainrot name)

Resolution:
- Compare that Brainrot across all currently scanned/cached mutations.
- Return ONLY the requested lowest/highest numeric exist count.

INSIDE A MUTATION — RETURN BRAINROT ONLY
Support:
- rarest brainrot in (mutation)
- most rare brainrot in (mutation)
- least common brainrot in (mutation)
- lowest brainrot in (mutation)
- which brainrot has the least exists in (mutation)
- which brainrot has the least exist in (mutation)
- which brainrot has the fewest copies in (mutation)
- which brainrot has the lowest exist count in (mutation)
- which brainrot has the smallest exist count in (mutation)
- what brainrot is rarest in (mutation)
- most common brainrot in (mutation)
- commonest brainrot in (mutation)
- highest brainrot in (mutation)
- which brainrot has the most exists in (mutation)
- which brainrot has the most exist in (mutation)
- which brainrot has the most copies in (mutation)
- which brainrot has the highest exist count in (mutation)
- which brainrot has the largest exist count in (mutation)
- what brainrot is most common in (mutation)

Resolution:
- Compare all Brainrots currently scanned/cached inside the requested mutation.
- Return ONLY the Brainrot name.
- If tied, return all tied Brainrot names in scanner/cache order, separated by a comma and space unless the riddle requests another format.

INSIDE A MUTATION — RETURN COUNT ONLY
Support:
- lowest exist count in (mutation)
- smallest exist count in (mutation)
- least exist in (mutation)
- fewest copies in (mutation)
- minimum exist count in (mutation)
- rarest exist count in (mutation)
- highest exist count in (mutation)
- largest exist count in (mutation)
- most exist in (mutation)
- most copies in (mutation)
- maximum exist count in (mutation)
- commonest exist count in (mutation)

Resolution:
- Compare all currently scanned/cached Brainrots inside that mutation.
- Return ONLY the requested numeric count.

MUTATION TOTALS — RETURN TOTAL COUNT ONLY
Support:
- total exist count of (mutation)
- total (mutation) exist count
- combined exist count of (mutation)
- sum of exist counts in (mutation)
- how many brainrots exist in (mutation)
- how many brainrots are there in (mutation)
- all brainrots exist in (mutation)
- exist count altogether in (mutation)
- total copies in (mutation)
- combined copies in (mutation)
- sum of all exists in (mutation)
- total exists in (mutation)

Resolution:
- Sum the exist counts for all Brainrots currently scanned/cached under that mutation.
- Return ONLY the numeric total.

INDEX / SCANNER SUMMARY QUESTIONS
Support:
- total brainrots in the index
- how many brainrots are in the index
- number of brainrots in the index
- index brainrot count
- index total
- total index
- cached exist
- exist counts cached
- cached exist counts
- exist cache count
- mutations scanned
- scanned mutations
- mutation scan count
- how many mutations were scanned
- how many mutations are cached
- cached mutation count
- total cached exist counts

Resolution:
- Questions about total Brainrots/index count return the current live Index Brainrot total.
- Questions about cached exist/exist cache count return the current number of cached exist-count entries when that metric is available from the scanner.
- Questions about mutations scanned return the current number of mutations scanned/cached.
- Return ONLY the requested number unless additional wording is explicitly requested.

RANKING MEANINGS
For EXIST-COUNT context only:
- rarest = most rare = least common = scarcest = lowest = smallest = fewest = minimum = lowest exist count.
- most common = commonest = most populated = most abundant = highest = largest = most copies = maximum = highest exist count.
- rarer = lower exist count.
- more common = higher exist count.
- least = lowest exist count when the object being compared is copies/exists/count.
- most = highest exist count when the object being compared is copies/exists/count.

NORMALIZATION / SYNONYMS
- exist count = exists = existence count = copy count = copies = amount existing = number existing = how many exist.
- mutation = mut = variant = version when Index mutation context is clear.
- brainrot = brain rot = animal = character = unit when the live Index entity context is clear.
- Normal = Default = unmutated = no mutation = base mutation when referring to the Index's unmutated entry.
- total = combined = altogether = sum when asking for aggregate counts.
- cache = cached data = scanner cache = Index cache when referring to current scanner-captured values.
- scanner = Index scanner = live Index = Index when context is exist-count scanning.
- Ignore capitalization, harmless punctuation, apostrophe differences, repeated spaces, and harmless word-order changes when intent is unambiguous.

IMPORTANT DISAMBIGUATION
- If a Brainrot name contains a word that is also a mutation-like/common word, prefer the longest exact live Index Brainrot-name match.
- If an explicit leading token matches a currently scanned mutation and the remainder matches a Brainrot, interpret it as (mutation) + (brainrot name).
- Without an explicit mutation, use Normal/Default.
- Ranking questions that say "return mutation" conceptually must answer the mutation name, not the count.
- Ranking questions that ask for "exist count", "count", "copies", "minimum", or "maximum" must answer the numeric count, not the mutation or Brainrot name.
- Do not substitute static Info Book counts for live Index scanner values.
`;

export default {
  async fetch(request, env, ctx) {
    const response = await baseWorker.fetch(request, env, ctx);
    const url = new URL(request.url);

    if (url.pathname !== "/" || !response.ok) return response;

    const text = await response.text();
    return new Response(text + EXIST_COUNT_QUESTION_SUPPORT, {
      status: response.status,
      headers: response.headers
    });
  }
};
