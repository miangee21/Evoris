# Evoris

![MIT License](https://img.shields.io/badge/License-MIT-green.svg)

Evoris is a fully offline, open-source password manager. It stores all data
inside a single encrypted vault file (`.evs`) on your own device. There is no
cloud account, no sync server, no telemetry, and no network access from the
app itself.

## Features

- One encrypted `.evs` vault file per vault, protected by a master password
- Items with dynamic custom fields: text, password, email, URL, notes
  (plain or Markdown), and section headings, with per-field masking,
  reordering by drag or arrows, copy, and reveal controls
- Per-item TOTP / 2FA codes (SHA-1, 6 digits, 30 seconds) with a countdown ring
- Categories with icons and colours, item search (by name only) and
  category filtering, and a grid view of items
- Trash with restore, permanent delete, and empty-trash actions
- Plain-JSON export and import (export is **not** encrypted; see below)
- Auto-lock on idle with an Off option (default 30 seconds), manual lock,
  and a password generator
- Light / dark themes and six accent colours (theme and accent are stored
  locally in the app, not in the vault, so locking a vault never changes
  the theme)

## Security design

- Key derivation: **Argon2id**, 64 MiB memory, 3 iterations, parallelism 4,
  producing a 256-bit key
- Encryption: **AES-256-GCM**, with the 33-byte file header (magic, version,
  salt, nonce) used as authenticated additional data (AAD)
- Every vault write is atomic: write to a temporary file, fsync, then rename
- The derived key never crosses the Tauri IPC boundary, is zeroized on lock,
  and decrypted vault data is scrubbed from memory on lock
- The clipboard is cleared automatically 60 seconds after a copy, and
  immediately on lock
- Notes Markdown never renders raw HTML, never renders a live link, and
  never loads an image; external URLs are opened only after a confirmation
  dialog, through the Tauri opener plugin (the only outbound action)
- Search only matches item names, never field values or notes
- The app makes no network requests. The only external URLs are the two
  About links (GitHub and Discord), opened in the browser via the opener
  plugin. Those links are defined in `src/shared/constants/links.ts`.

## The `.evs` file layout

```
[4 bytes]  magic "EVOR"
[1 byte]   format version (0x01)
[16 bytes] salt (Argon2id)
[12 bytes] nonce (AES-256-GCM)
[rest]     AES-256-GCM ciphertext of the JSON vault data
```

The JSON vault data contains settings (navigation mode and auto-lock only),
categories, and items (including trashed items, marked with `in_trash` and
`deleted_at`). Theme and accent are not in the vault file.

## Export and import

Export produces a **plain, unencrypted JSON** file on purpose: an encrypted
backup is simply a copy of the `.evs` file itself. The export shape is:

```json
{
  "format": "evoris-export",
  "formatVersion": 1,
  "exportedAt": "<ISO 8601>",
  "vaultName": "<name>",
  "categories": [],
  "items": [],
  "trash": []
}
```

Settings are not exported. To import, choose an Evoris export file, then
choose a new vault name and a new master password; everything is imported
into a brand-new vault with freshly generated ids. Only Evoris's own export
format is accepted — no KeePass, Bitwarden, 1Password, or CSV import, and
no partial import: any structural mismatch rejects the whole file.

> **Warning:** an exported JSON file is not encrypted. Anyone who opens it
> can read every password. Store it somewhere safe and delete it when you
> are done.

## Build from source

Prerequisites: Node.js, npm, and a Rust toolchain (see the
[Tauri prerequisites](https://v2.tauri.app/start/prerequisites/)).

```bash
npm ci
npm run check:all
cd src-tauri && cargo test && cargo fmt --check && cd ..
npm run tauri dev
npm run tauri build
```

Build artifacts appear under `src-tauri/target/release/bundle/`
(Windows `.msi` / `.exe`, Linux `.deb` / `.rpm` / `.AppImage`, depending
on the host platform).

## Screenshots

Screenshots are to be added by the maintainer. No screenshot files are
included in this repository yet, and no image paths in this README are
placeholders for files that do not exist.

## Privacy

Evoris is fully offline. It performs no autofill, keeps no telemetry, no
recent-files history, and no tray icon. Vault paths are never written to
disk by the app (the path is remembered in memory only while the app is
running, so the unlock screen can name the locked vault).

## License

[MIT License](LICENSE)
