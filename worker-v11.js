import baseWorker from "./worker-v10.js";

const ANTICHEAT_DEV_SYNONYMS = String.raw`

ANTI-CHEAT DEVELOPER SYNONYMS — V11
===================================
Canonical answer: Adam

Treat all of the following as asking for Adam:
- anticheat dev
- anti cheat dev
- anti-cheat dev
- anticheat developer
- anti cheat developer
- anti-cheat developer
- anticheat coder
- anti cheat coder
- anti-cheat coder
- anticheat programmer
- anti cheat programmer
- anti-cheat programmer
- anticheat creator
- anti cheat creator
- anti-cheat creator
- anticheat maker
- anti cheat maker
- anti-cheat maker
- anticheat engineer
- anti cheat engineer
- anti-cheat engineer
- AC dev
- AC developer
- AC coder
- AC programmer
- AC creator
- AC maker
- AC engineer
- cheat detection dev
- cheat detection developer
- exploit detection dev
- exploit detection developer
- security dev for the anticheat
- security developer for the anticheat
- dev of the anticheat
- developer of the anticheat
- coder of the anticheat
- programmer of the anticheat
- creator of the anticheat
- maker of the anticheat
- engineer of the anticheat
- who made the anticheat
- who made anti cheat
- who made the anti-cheat
- who created the anticheat
- who created anti cheat
- who created the anti-cheat
- who coded the anticheat
- who coded anti cheat
- who coded the anti-cheat
- who programmed the anticheat
- who programmed anti cheat
- who programmed the anti-cheat
- who developed the anticheat
- who developed anti cheat
- who developed the anti-cheat
- who built the anticheat
- who built anti cheat
- who built the anti-cheat
- who works on the anticheat
- who works on anti cheat
- who works on the anti-cheat
- who is the anticheat dev
- who is the anti cheat dev
- who is the anti-cheat dev
- who is the anticheat developer
- who is the anti cheat developer
- who is the anti-cheat developer
- name the anticheat dev
- name the anti cheat dev
- name the anti-cheat dev
- anticheat guy
- anti cheat guy
- anti-cheat guy

Normalization rules:
- anticheat = anti cheat = anti-cheat = AC when developer/security context makes the meaning unambiguous.
- dev = developer = coder = programmer = creator = maker = engineer when asking who built or maintains the anti-cheat.
- made = created = coded = programmed = developed = built = wrote = authored when asking who is responsible for the anti-cheat.
- Canonical output must be exactly: Adam
`;

export default {
  async fetch(request, env, ctx) {
    const response = await baseWorker.fetch(request, env, ctx);
    const url = new URL(request.url);

    if (url.pathname !== "/" || !response.ok) {
      return response;
    }

    const text = await response.text();
    return new Response(text + ANTICHEAT_DEV_SYNONYMS, {
      status: response.status,
      headers: response.headers
    });
  }
};
