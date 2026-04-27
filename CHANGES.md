# swtclib — Engineering Upgrade, Security Audit & Supply Chain Risk Reduction

> A systematic overhaul of the swtclib monorepo covering three dimensions: security audit, engineering environment upgrade, and elimination of supply chain risks through dependency refactoring. All 11 package test suites pass (`lerna success`, 0 failures).

---

## 1. Security Fixes

### 1.1 Eliminate `new Function()` Dynamic Code Execution

**File**: `packages/transaction/tssrc/transaction.ts` (around L423)

**Problem**: The original code used `new Function(...)` to dynamically execute a string constructed from the `func` parameter. If `func` originates from untrusted input, this is a code injection vulnerability (OWASP A03).

**Fix**: Replaced with explicit property existence check and type guard:

```diff
- new Function("contractInstance", `"use strict"; return contractInstance.${func}`)
+ if (Object.prototype.hasOwnProperty.call(myContractInstance, func) &&
+     typeof myContractInstance[func] === "function") {
+   result = myContractInstance[func]()
+ }
```

### 1.2 Add `npm audit` Script

**File**: `package.json` (root)

```json
"audit": "npm audit --audit-level=moderate"
```

Enables security scanning in CI or manually, blocking moderate-severity and above vulnerabilities.

### 1.3 HTTP Default Endpoint (Pending)

The default endpoint `http://bcapps.ca:5050` in `packages/rpc/tssrc/factory.ts` was attempted to be changed to `https`, but test assertions hard-code the URL and failed after the change. The change was reverted. **Requires coordinated update of both source and tests.**

---

## 2. Engineering Environment Upgrade

### 2.1 Remove Automatic Full Build on `postinstall`

**File**: `package.json` (root)

**Problem**: `postinstall: "npm run lint; npm run compile; npm run build"` triggered a full build on every `npm install` (local, CI, Docker), severely slowing installation.

**Fix**: Removed the `postinstall` field. Moved `compile` to the end of the `bootstrap` script so it only runs on explicit bootstrap:

```json
"bootstrap": "lerna clean --yes && npm install && npm run lint && npm run compile"
```

### 2.2 Update `lerna.json`

**File**: `lerna.json`

| Field | Description |
|-------|-------------|
| `"$schema"` | Added JSON Schema path for editor validation |
| `"npmClient": "npm"` | Explicitly declare the package manager |
| `"useNx": false` | Disable Nx integration to suppress Nx-related warnings |
| `"command.run.stream": true` | Enable real-time streaming output for all `lerna run` |
| `"command.run.sort": true` | Execute tasks in dependency topological order |
| Removed old `command.bootstrap` block | lerna v7+ removed the bootstrap command |

### 2.3 Enable Webpack Persistent Cache

**File**: `packages/lib/webpack.config.js`

```diff
- cache: false
+ cache: { type: "filesystem" }
```

Webpack 5 supports filesystem caching natively. Disabling it forces a full rebuild every time; enabling it significantly speeds up incremental builds.

### 2.4 Remove Legacy ESLint Configs from Sub-packages

**Deleted files (8 total)**:

- `packages/api/.eslintrc.js`
- `packages/lib/.eslintrc.js`
- `packages/rpc/.eslintrc.js`
- `packages/transaction/.eslintrc.js`
- `packages/utils/.eslintrc.js`
- `packages/wallet/.eslintrc.js`
- `packages/common/.eslintrc.js`
- `packages/serializer/.eslintrc.js`

**Reason**: ESLint 9 uses the root-level flat config (`eslint.config.mjs`) which already covers the entire monorepo. Legacy `.eslintrc.js` files in sub-packages are silently ignored or cause config conflict warnings.

---

## 3. Package Metadata Normalization

### 3.1 Add `types` Field to All 10 Library Packages

**Files**: `packages/*/package.json` (address-codec, api, common, keypairs, lib, rpc, serializer, transaction, utils, wallet)

```json
"types": "cjs/index.d.ts"
```

(Exception: `utils` uses `"cjs/utils.d.ts"` since its entry is `utils.ts`)

TypeScript consumers can now resolve types without configuring `typeRoots`.

### 3.2 Add `files` Field to Prevent Over-publishing

**Files**: `packages/{api,lib,rpc,transaction,wallet}/package.json`

```json
"files": ["cjs", "esm", "dist"]
```

Prevents source, tests, and config files from being included in `npm publish`.

### 3.3 Remove Invalid Field from `serializer`

**File**: `packages/serializer/package.json`

Removed `"deprecated": false`. npm only recognizes string values for deprecation notices; a boolean has no effect.

### 3.4 Stop ESM Build from Generating Duplicate Type Declarations

**Files**: All 10 library packages' `tsconfig.esm.json`

```json
"declaration": false,
"declarationMap": false
```

Type declarations (`.d.ts`) are generated exclusively by the CJS build (`tsconfig.cjs.json`). The ESM build no longer produces redundant `.d.ts` files under `esm/`.

---

## 4. Test Configuration Fixes

### 4.1 Fix Jest Coverage Collection Paths

**Files**:
- `packages/address-codec/jest.config.js`
- `packages/keypairs/jest.config.js`

```diff
- collectCoverageFrom: ["src/**/*.ts"]
+ collectCoverageFrom: ["tssrc/**/*.ts"]
```

TypeScript sources for both packages live in `tssrc/`. The original config pointed to a non-existent `src/` directory, resulting in 0% coverage always being reported.

### 4.2 Simplify proxy Test Script

**File**: `packages/proxy/package.json`

```diff
- "test": "jest -i test/function.spec.js test/store.spec.js; jest test/koa.spec.js; jest test/multisign.spec.js"
+ "test": "jest --runInBand"
```

`--runInBand` is equivalent to `-i` (serial execution) and auto-discovers all test files, removing the need to enumerate them manually.

---

## 5. Supply Chain Risk Reduction — Pre-existing Changes

The following changes existed in the working tree before this session. Each was reviewed and confirmed correct; they are included in this commit.

### 5.1 `packages/api/tsconfig.cjs.json`

Added `"skipLibCheck": true` to suppress type errors from third-party `.d.ts` files, resolving dependency chain type compatibility issues.

### 5.2 `packages/api/webpack.config.js`

Added `resolve.fallback` entries to provide browser-compatible polyfills for Node.js built-ins (`crypto`, `stream`, etc.), enabling browser-side bundling.

### 5.3 `packages/lib/tssrc/remote.ts` — Migrate `lru-cache` v6 → v10+

| Before | After |
|--------|-------|
| `import LRU from "lru-cache"` | `import { LRUCache } from "lru-cache"` |
| `new LRU(...)` | `new LRUCache(...)` |
| `maxAge` option | `ttl` option |
| `sha1(...)` | `createHash("sha256")(...)` |

Eliminates dependency on the abandoned v6 API and upgrades the hash algorithm from SHA-1 to SHA-256.

### 5.4 `packages/proxy/tssrc/store/index.ts`

Wrapped the `Remote` instance with `markRaw(new Remote())` to prevent Vue 3's reactivity system from deeply proxying a non-plain object, avoiding potential performance issues and runtime errors.

### 5.5 `packages/proxy/tssrc/web/static-files.ts` — Replace `static-koa-router` with `koa-static`

Replaced the unmaintained `static-koa-router` + `koa-router` with `koa-static` (official Koa ecosystem, actively maintained). URL prefix stripping is implemented manually; the return shape `{ routes: () => middleware }` preserves the existing call interface so no upstream changes are required.

### 5.6 `packages/proxy/tssrc/functions/v2.ts`

Fixed a route parameter name mismatch: `ctx.params.address` → `ctx.params.account`, aligning with the route definition.

### 5.7 `packages/lib/test/tx_data.js`

Replaced test fixture account address `jHdWAmh8AAjhjqG7zEDA5RBgAnQHyd2g5m` with `jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz` (both are public on-chain addresses; no security implications).

### 5.8 `packages/address-codec/tslint.json` — Deleted

tslint was abandoned in 2019. The config file had no practical effect and has been removed.

---

## 6. Verification

All 11 packages (address-codec, api, common, keypairs, lib, proxy, rpc, serializer, transaction, utils, wallet) pass their test suites. `lerna run test` completes with `lerna success`, 0 failures.
