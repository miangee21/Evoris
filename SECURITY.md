# Security Policy

At **Evoris**, security is not a feature—it is the foundational reason for the project's existence. As an offline, sovereign password manager, our primary objective is to safeguard your sensitive credentials against both offline extraction and runtime memory compromise.

This document describes our security architecture, vulnerability reporting procedures, threat model, and scope.

---

## Table of Contents

- [Reporting a Vulnerability](#-reporting-a-vulnerability)
- [Response Timeline & SLA](#-response-timeline--sla)
- [Security Architecture & Defensive Measures](#-security-architecture--defensive-measures)
  - [1. Cryptographic Primitives & Storage](#1-cryptographic-primitives--storage)
  - [2. Authenticated Additional Data (AAD)](#2-authenticated-additional-data-aad)
  - [3. Memory Protection & Key Hygiene](#3-memory-protection--key-hygiene)
  - [4. Attack Surface Minimization](#4-attack-surface-minimization)
  - [5. Resilient File I/O & Atomic Writes](#5-resilient-file-io--atomic-writes)
- [Threat Model: In Scope vs. Out of Scope](#-threat-model-in-scope-vs-out-of-scope)
  - [In Scope (Eligible for Advisories & Fixes)](#in-scope)
  - [Out of Scope (Deliberate Design Decisions)](#out-of-scope)
- [Supported Versions](#-supported-versions)
- [Security Best Practices for Users](#-security-best-practices-for-users)

---

## 🚨 Reporting a Vulnerability

If you have identified a potential security vulnerability in Evoris, please **do not open a public GitHub issue, discussion thread, or pull request**. Publicly disclosing an unpatched flaw puts users at risk.

Instead, please report vulnerabilities through our private channels:

1. **GitHub Security Advisories (Preferred):**
   Submit a report via [GitHub Private Vulnerability Reporting](https://github.com/miangee21/Evoris/security/advisories/new).
2. **Direct Contact:**
   If GitHub Advisories is inaccessible, contact the maintainer directly through the repository owner's profile on GitHub.

### What to Include in Your Report
To help us triage and reproduce the issue rapidly, please provide:
- **Summary:** A clear description of the vulnerability and its potential impact.
- **Attack Vector:** An explanation of prerequisites (e.g., local filesystem access, crafted `.evs` container, malicious export file).
- **Proof of Concept:** Step-by-step instructions, minimal sample files, or reproduction scripts.
- **Affected Target:** Version, commit hash, operating system (Windows/Linux), and architecture.
- **Suggested Remediation:** Any initial thoughts on how the issue might be resolved.

---

## ⏱️ Response Timeline & SLA

We take all reported vulnerabilities seriously and adhere to a coordinated vulnerability disclosure workflow:

| Phase | Target Timeline | Details |
|---|---|---|
| **Initial Acknowledgment** | Within **48 hours** | We confirm receipt and begin initial assessment. |
| **Triage & Validation** | Within **5 business days** | We reproduce the issue and determine severity. |
| **Patch Development** | Within **14 business days** | A fix is created and validated in a private fork. |
| **Public Release & Advisory** | Coordinated Release | A patched release is published along with a CVE/Advisory credit. |

---

## 🛡️ Security Architecture & Defensive Measures

### 1. Cryptographic Primitives & Storage
- **Key Derivation (Argon2id):**
  - Standard: RFC 9106.
  - Memory: `64 MiB` (`65,536 KiB`).
  - Iterations: `3`.
  - Parallelism: `4` lanes.
  - Salt: 128-bit (`16 bytes`) generated using OS CSPRNG (`rand_core` / `getrandom`).
- **Authenticated Cipher (AES-256-GCM):**
  - Standard: NIST SP 800-38D.
  - Key: 256-bit (`32 bytes`) derived strictly via Argon2id.
  - Nonce: 96-bit (`12 bytes`) unique CSPRNG nonce generated per write operation. Nonces are never reused.
  - Tag: 128-bit (`16 bytes`) Galois authentication tag ensuring data integrity and authenticity.

### 2. Authenticated Additional Data (AAD)
The `.evs` binary file begins with a 33-byte header:
```
[4 bytes: Magic "EVOR"] + [1 byte: Version 0x01] + [16 bytes: Salt] + [12 bytes: Nonce]
```
During encryption and decryption, this exact 33-byte header is fed as **Authenticated Additional Data (AAD)** into AES-256-GCM. 
- Any offline tampering with the magic bytes, version identifier, salt, or nonce immediately causes decryption to fail.
- Cryptographic integrity is validated before any JSON deserialization occurs.

### 3. Memory Protection & Key Hygiene
- **Zeroization:** The `DerivedKey` type implements `zeroize::ZeroizeOnDrop`. Whenever a key leaves scope or a vault is locked, the underlying byte array is scrubbed with zeroes to mitigate cold-boot or memory-dump attacks.
- **Session Dropping:** When the vault is locked:
  - The derived key is dropped and zeroized.
  - The salt is explicitly zeroized.
  - All decrypted in-memory `VaultData` collections (`categories`, `items`, attachments) are emptied via `.clear()`.
- **IPC Boundary Isolation:** The derived cryptographic key is retained exclusively within compiled Rust memory. It is **never** transmitted across the Tauri IPC bridge to the JavaScript WebView runtime.
- **Clipboard Scrubbing:** Plaintext secrets copied to the operating system clipboard are automatically cleared after 60 seconds, or immediately upon manual/automatic vault lock.

### 4. Attack Surface Minimization
- **Strictly Offline:** The application includes zero HTTP clients, analytics packages, telemetry reporting, or auto-update network hooks.
- **Safe Markdown Rendering:** Item notes rendered in Markdown enforce strict constraints:
  - Raw HTML injection is completely disabled.
  - Inline image rendering from remote URLs is blocked.
  - Hyperlinks cannot be executed inline; clicking an external link triggers an explicit user confirmation dialog, which delegates to the default OS browser via `@tauri-apps/plugin-opener`.
- **Privacy-Preserving Search:** Search indexes operate only on item titles and categories. Sensitive field contents (passwords, notes, TOTP seeds) are never indexed, protecting against timing attacks and fuzzy match leaks.

### 5. Resilient File I/O & Atomic Writes
- All vault updates write to a temporary file (`.evs.tmp`), execute an OS hardware sync (`sync_all` / `fsync`) to flush physical drive caches, and atomically rename the temporary file over the target vault file.
- This prevents vault corruption caused by system crashes, power loss, or interrupted disk writes.

---

## 🎯 Threat Model: In Scope vs. Out of Scope

### In Scope
The following areas are considered valid security issues and eligible for investigation:
- Flaws in the Argon2id key derivation or AES-256-GCM cipher implementations.
- Failures in Authenticated Additional Data (AAD) verification or header parsing logic.
- Vulnerabilities in `.evs` binary container parsing or memory corruption during deserialization.
- Leakage of master passwords, derived keys, or plaintext secrets across the Tauri IPC layer or remaining in memory after vault locking.
- Clipboard clearing failures where sensitive copied items remain accessible indefinitely.
- Cross-Site Scripting (XSS), script injection, or remote code execution via Markdown notes or dynamic field inputs.
- IPC command injection or privilege escalation within Tauri commands.

### Out of Scope
The following scenarios are explicitly excluded from our threat model:
- **Forgotten Master Passwords:** Evoris has zero backdoors, master recovery keys, or escrow servers. If a master password is lost, data recovery is mathematically impossible.
- **Plaintext JSON Exports:** Exports generated by the user are unencrypted by design for transparent data portability. Protecting exported JSON files is the user's responsibility.
- **Compromised Host Operating System:** If an attacker has administrative, root, or kernel-level access to the machine, malware keyloggers, hardware DMA attacks, or debugger attachment can compromise secrets. Protecting the host environment is an operating-system level responsibility.
- **Physical Access to an Unlocked Device:** Evoris provides configurable auto-lock (down to 10 seconds) and manual lock. An unlocked vault left unattended on an accessible machine is out of scope.
- **Weak Master Passwords:** Brute-force attacks against trivial master passwords (e.g., "123456", "password"). Users must choose strong, high-entropy master passphrases.

---

## 📦 Supported Versions

Security updates are released for the latest stable version of Evoris.

| Version | Supported | Notes |
|---|---|---|
| `0.1.x` (Latest) | ✅ Yes | Actively maintained; all security patches apply here. |
| `< 0.1.0` | ❌ No | Pre-release / early alpha versions are unsupported. |

---

## 💡 Security Best Practices for Users

1. **Choose a Strong Master Password:** Use a passphrase with at least 4-5 random words (e.g., Diceware) or 16+ high-entropy characters.
2. **Keep Backups of Your `.evs` File:** Store encrypted `.evs` backups on secure, disconnected offline media (e.g., an encrypted USB drive).
3. **Configure Idle Auto-Lock:** Set the auto-lock timeout in Settings according to your risk environment (default is 30 seconds).
4. **Handle Exports with Caution:** If you export your vault as JSON for migration, store it on an encrypted volume and securely shred/delete the file once finished.
