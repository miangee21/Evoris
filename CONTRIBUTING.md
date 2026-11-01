# Contributing to Evoris

Thank you for your interest in contributing to **Evoris**! Evoris is an open-source, fully offline, privacy-first password manager engineered with **Tauri v2**, **React 19**, and **Rust**.

Because Evoris secures people's most critical digital credentials, our codebase adheres to uncompromising standards regarding memory safety, cryptography, architectural boundaries, and performance.

This guide outlines our development philosophy, non-negotiable rules, local setup, and submission workflow.

---

## Table of Contents

- [Core Philosophy](#-core-philosophy)
- [The 8 Non-Negotiable Rules](#-the-8-non-negotiable-rules)
- [Architecture & Mental Model](#-architecture--mental-model)
  - [Frontend: Feature-Driven Modularity](#1-frontend-feature-driven-modularity)
  - [Backend: Rust Security Core](#2-backend-rust-security-core)
  - [IPC & Boundary Validation](#3-ipc--boundary-validation)
- [Development Setup](#-development-setup)
  - [Prerequisites](#prerequisites)
  - [Installation & First Run](#installation--first-run)
- [Coding Standards & Conventions](#-coding-standards--conventions)
  - [TypeScript & React](#typescript--react)
  - [Styling & Design Tokens](#styling--design-tokens)
  - [Rust & Tauri Core](#rust--tauri-core)
- [Verification & Quality Checklist](#-verification--quality-checklist)
- [Git & Commit Hygiene](#-git--commit-hygiene)
- [Submitting a Pull Request](#-submitting-a-pull-request)

---

## 🧭 Core Philosophy

1. **Local-First & Air-Gapped:** Evoris never speaks to the internet. We do not accept PRs that introduce network clients, telemetry, remote font loading, analytics, or background sync daemons.
2. **Zero-Trust Memory Hygiene:** Secrets (passwords, keys, seeds) must exist in memory only when strictly necessary, must be zeroized on drop, and must never cross IPC boundaries unnecessarily.
3. **Deterministic & Resilient:** Data loss is unacceptable. All disk operations must be atomic and crash-resilient.

---

## 🛑 The 8 Non-Negotiable Rules

Every pull request is automatically verified against these 8 architectural constraints:

1. **Zero `any` in TypeScript**
   - No `any` is allowed anywhere in the codebase.
   - Use strict TypeScript types or `unknown` combined with Zod schema validation. Both `tsc --noEmit` and ESLint enforce this.
2. **Nothing Hardcoded (Design Tokens Only)**
   - No hardcoded hex codes (`#10b981`), raw RGB values, or arbitrary pixel measurements (`17px`, `133px`) inside `.tsx` or `.ts` files.
   - All visual attributes (colors, borders, radii, transitions, spacing) must map to CSS custom properties in `src/styles/globals.css` and Tailwind v4 theme tokens.
   - Category colors are user data; default colors reference `--category-default-color`.
3. **Strict 300-Line Limit per File**
   - No file may exceed 300 lines of code.
   - If a module approaches or exceeds this limit, refactor and decompose it into smaller, focused sub-modules within the same feature directory.
4. **100% Typed Everything**
   - Every function argument, return type, React prop, Tauri IPC payload, and store slice must be strictly and explicitly typed.
5. **Universal Boundary Validation**
   - Every external boundary—user form inputs, filesystem reads, imported JSON, and IPC payloads—must pass through strict schema validation:
     - Client side: **Zod** schemas (`src/shared/schemas/` or `feature/schemas/`).
     - Rust side: **Serde** deserialization + explicit invariant assertions.
6. **Strict Feature-Based Structure**
   - Code belongs to the feature that uses it (`src/features/<feature>/`).
   - Shared utilities, generic UI components, and global types live in `src/shared/`.
   - Never duplicate code (types, constants, schemas, helpers)—maintain strict DRY principles.
7. **Zero Network Calls**
   - No `fetch`, `axios`, WebSockets, CDN links, or external telemetry libraries.
   - The only external web actions allowed are the verified external links in the About dialog, which explicitly confirm with the user before delegating to the OS browser via `@tauri-apps/plugin-opener`.
8. **Secrets Never Logged**
   - Never log vault data, master passwords, derived encryption keys, or TOTP seeds via `console.log`, `eprintln!`, or file logs, under any build target or environment mode.

---

## 🏛️ Architecture & Mental Model

### 1. Frontend: Feature-Driven Modularity
The frontend source code is organized into three distinct tiers:
- `src/app/`: Application-level bootstrapping, routing (`react-router-dom`), route guards (`require-unlocked.tsx`, `require-locked.tsx`), layouts, and global providers.
- `src/features/`: Feature domains (e.g., `items`, `categories`, `totp`, `vault-session`, `autolock`, `attachments`, `settings`). Each feature owns its components, hooks, stores, and schemas.
- `src/shared/`: Cross-cutting UI primitives (`shadcn/ui`, `base-ui`), shared hooks, math/sort algorithms, and global IPC types.

### 2. Backend: Rust Security Core
The Rust core (`src-tauri/`) handles cryptographic and file I/O operations:
- `src/crypto/`: Argon2id key derivation (`kdf.rs`), AES-256-GCM authenticated cipher (`cipher.rs`), and CSPRNG randomness (`random.rs`).
- `src/vault/`: Binary container serializer/deserializer (`format.rs`), atomic read/write (`io.rs`), and data validation (`validate.rs`).
- `src/commands/`: Strongly typed Tauri command handlers delegating to the active vault session.
- `src/state.rs`: Application state container managing the thread-safe `Mutex<Option<VaultSession>>`.

### 3. IPC & Boundary Validation
- Frontend invokes Rust commands via typed wrappers (`src/shared/lib/invoke.ts` and feature `api/`).
- Responses always return `Result<T, VaultError>`.
- The derived cryptographic key **never** leaves Rust memory and is never passed to the frontend WebView.

---

## 💻 Development Setup

### Prerequisites
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher
- **Rust**: Latest stable toolchain via [rustup](https://rustup.rs/)
- **C++ Compiler & Platform Tools**:
  - **Windows**: Visual Studio 2022 with "Desktop development with C++" workload
  - **Linux**: Standard build packages:
    ```bash
    sudo apt-get install build-essential libwebkit2gtk-4.1-dev libssl-dev libappindicator3-dev librsvg2-dev
    ```

### Installation & First Run

1. Clone the repository:
   ```bash
   git clone https://github.com/miangee21/Evoris.git
   cd Evoris
   ```
2. Install npm dependencies:
   ```bash
   npm ci
   ```
3. Run the development environment:
   ```bash
   # Starts the Vite web preview
   npm run dev

   # Or launches the complete native desktop app window
   npm run tauri dev
   ```

---

## 🎨 Coding Standards & Conventions

### TypeScript & React
- **React 19:** Use functional components and modern React hooks. Avoid class components.
- **Component File Naming:** `kebab-case.tsx` (e.g., `item-detail-header.tsx`).
- **Store Architecture:** Use lightweight Zustand stores with dedicated selectors to prevent unnecessary re-renders (`session.selectors.ts`).
- **Form Handling:** Always pair `react-hook-form` with `@hookform/resolvers/zod`.

### Styling & Design Tokens
- **Tailwind CSS v4:** Use utility classes linked to our CSS custom properties.
- **Dark/Light Mode:** Styles must look crisp and high-contrast in both dark and light modes. Use semantic tokens (e.g., `bg-background`, `text-foreground`, `border-border`).
- **Animation:** Use `motion` / `framer-motion` for transitions (e.g., modal appearances, circular TOTP countdowns), keeping durations subtle and performant.

### Rust & Tauri Core
- **Unsafe Code:** Unsafe code is forbidden (`#![deny(unsafe_code)]`).
- **Clippy:** Clippy is configured with `-D warnings`. All warnings are treated as build errors.
  - Prefer `.clone_from()` when updating existing allocations instead of reassigning `.clone()`.
  - Use `.map_or_else()` rather than chained `.map().unwrap_or_else()` on `Option` types.
  - Document public methods returning `Result` with an explicit `/// # Errors` doc section.
- **Zeroization:** Sensitive types must derive or implement `zeroize::Zeroize` or `zeroize::ZeroizeOnDrop`.

---

## ✅ Verification & Quality Checklist

Before committing or submitting a PR, run the automated verification suite:

```bash
# 1. Full frontend & backend static analysis:
#    - TypeScript compiler (noEmit)
#    - ESLint
#    - Cargo Clippy (-D warnings)
npm run check:all

# 2. Rust unit tests & formatting check:
cd src-tauri
cargo test
cargo fmt --check
cd ..

# 3. Production release bundle build:
npm run tauri build
```

Every command above must pass cleanly with **zero errors and zero warnings**.

---

## 🌿 Git & Commit Hygiene

### Branch Naming Conventions
- `feat/item-tags` — New features
- `fix/autolock-timer` — Bug fixes
- `refactor/field-engine` — Code restructuring without functional changes
- `docs/security-architecture` — Documentation updates
- `chore/deps-update` — Build scripts and dependency bumps

### Commit Messages
We follow the [Conventional Commits](https://www.conventionalcommits.org/) standard:

```
<type>(<scope>): <short description in present tense>

[optional body with details]

[optional footer(s)]
```

**Examples:**
- `feat(totp): add custom period and digit configurations`
- `fix(cipher): ensure atomic temporary file cleanup on disk write failure`
- `docs(readme): add Linux packaging instructions and installation table`

### Critical Safety Rules
- **Never commit `.evs` vault files:** The `.gitignore` protects against this, but always double check `git status`.
- **Never commit unencrypted JSON exports:** Any file matching `*.export.json` or containing real credentials must never be staged.
- **Never commit environment overrides:** Keep local dev configuration out of git.

---

## 🚀 Submitting a Pull Request

1. **Fork & Branch:** Create your branch from the latest `master` / `main` branch.
2. **Make Focused Changes:** Keep PRs atomic and focused on a single responsibility. Avoid combining large refactorings with new feature additions.
3. **Verify Everything:** Ensure `npm run check:all` passes with zero warnings.
4. **Open Pull Request:**
   - Clearly explain **what** changed and **why**.
   - Reference any related GitHub issue numbers.
   - If UI changes are included, attach before/after screenshots or GIFs.
5. **Code Review:** A maintainer will review your code for adherence to the 8 Non-Negotiable Rules, crypto safety, and design aesthetics.

Thank you for helping keep Evoris private, secure, and sovereign!
