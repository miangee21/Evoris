# Security Review Findings

The following issues were identified by source review and remain unfixed:

1. **High — Backend vault remains unlocked after UI recovery**  
   `src/app/providers/error-boundary.tsx:29` clears only the frontend session store. It does not invoke the backend `lock_vault` command, so the backend session can remain unlocked after selecting “Lock Vault & Recover.”

2. **Medium — Plaintext export temporary file may remain**  
   `src-tauri/src/commands/transfer_commands.rs:146` returns immediately if the final rename fails. The `.tmp` file written by the export can therefore remain on disk containing unencrypted vault data.

3. **Medium — Import has no input size limit**  
   `src-tauri/src/commands/transfer_commands.rs:98` reads the whole selected file before parsing and cloning its contents. A very large import can exhaust memory and terminate the application.

4. **Medium — Locking does not securely wipe decrypted vault data**  
   `src-tauri/src/state.rs:15-22` clears the category and item collections but does not zeroize their allocated contents. Secret-bearing values may remain recoverable from process memory after locking.

TypeScript checks, ESLint, Rust Clippy, the production frontend build, and all 13 Rust tests passed during this review. The build reported a large JavaScript chunk warning. Passing checks do not resolve the issues above; release readiness should be reassessed after they are addressed.
