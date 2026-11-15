# Temporary feedback storage

The authenticated Next.js `/api/feedback` route stores one JSON record per Clerk
account and survey version here. Filenames hash the account/version; the private
record holds successful-action IDs, snooze state, and the submitted rating/comment.
Runtime JSON, lock and temporary files are ignored by Git and are never public assets.

Writes are serialized with a per-record exclusive lock and committed by atomic
rename. Submissions are accepted only after the file is saved. Reading a record
does not create a popup or increment a count. Do not edit files while the app runs.

Browsers and devices using the same Node server/filesystem share this state.
This folder is temporary storage, not a distributed database: it does not synchronize
separate deployments and must be migrated when the backend endpoint is introduced.
Use a persistent writable filesystem to retain data across server restarts.

If the Node process crashes while holding a lock, that account's requests fail
closed until the stale `.json.lock` file is removed with the app stopped. Keep
the corresponding JSON record; deleting it loses submission and snooze history.
