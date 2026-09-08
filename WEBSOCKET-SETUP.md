# Exist count WebSocket relay

## Automatic Info Book updates

After an authenticated completed scan is saved, the next request to `/` includes a LIVE INDEX EXIST COUNTS section. `/exist/counts` provides the same facts as JSON for wiki clients. No GitHub commit or redeploy is required for each scan. Existing already-open pages or clients with their own caches must fetch again to see new data.

These public read routes publish only Brainrot names, mutations, counts and the server save timestamp. Player/server identifiers and raw scanner text remain excluded. Missing counts stay unknown; zero stays zero. The existing `.txt` scanner needs no additional changes for this integration. Worker deployment and the matching ETERNAL_TOKEN configuration are still required.

Wrangler now loads worker-v18.js. All existing Info Book URLs delegate to v17 unchanged.

Deploy using your existing Cloudflare Workers Builds connection (build: none; deploy: npx wrangler deploy), or run `npx wrangler deploy` from an authenticated checkout. The SQLite Durable Object migration is included.

In the Cloudflare Worker settings add a secret named ETERNAL_TOKEN with a long random value. Use that same value in the Lua script and extension token field. Never commit it to this public repository. Until set, /ws intentionally returns 503.

Use wss://YOUR-WORKER-HOST/ws in both clients and room eternal. /exist/health reports version 18 and whether the secret is configured. The existing Node relay is no longer needed after deployment.

Completed snapshots are stored without a TTL and atomically replace the previous snapshot. Refreshes or interrupted uploads do not erase saved data. A disconnected producer cannot refresh; viewers can still retrieve the latest saved snapshot. This is latest-snapshot storage, not historical backups. Never delete the Durable Object namespace if you want to retain its data.

The shared token authorizes both viewing and publishing. Only give it to trusted users. Clients must send hello with role producer or viewer, room eternal and token first. Snapshot messages follow the accompanying Lua/extension protocol.
