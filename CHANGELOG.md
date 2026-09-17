# Changelog


## v1.2.0

[compare changes](https://github.com/narr07/nuxt-gsheet/compare/v1.1.0...v1.2.0)

### 🚀 Enhancements

- **docs:** Migrate docus to nuxt ui docs template with i18n support ([b93098a](https://github.com/narr07/nuxt-gsheet/commit/b93098a))

### 🩹 Fixes

- Resolve prerender error by removing unused llms modules ([bdb418c](https://github.com/narr07/nuxt-gsheet/commit/bdb418c))
- Add pnpm onlyBuiltDependencies to resolve build block on Cloudflare ([0edce84](https://github.com/narr07/nuxt-gsheet/commit/0edce84))
- Resolve PNPM v10 allowBuilds by moving configuration to pnpm-workspace.yaml ([80e6ede](https://github.com/narr07/nuxt-gsheet/commit/80e6ede))
- Restore valid JSON structure in root package.json ([4898af5](https://github.com/narr07/nuxt-gsheet/commit/4898af5))
- Add root postinstall script to generate typescript stubs for CI/CD ([e5987b0](https://github.com/narr07/nuxt-gsheet/commit/e5987b0))
- **docs:** Add explicit compilerOptions in tsconfig to fix Cloudflare Pages Vite TSCONFIG_ERROR ([db1eaf6](https://github.com/narr07/nuxt-gsheet/commit/db1eaf6))
- **build:** Add nuxt prepare to build script and fix root tsconfig JSON syntax ([14d328e](https://github.com/narr07/nuxt-gsheet/commit/14d328e))
- **docs:** Add app/tsconfig.json for direct Vite OXC lookup in Cloudflare Pages ([d7c3880](https://github.com/narr07/nuxt-gsheet/commit/d7c3880))
- **docs:** Add standalone tsconfig and vite tsconfigRaw fallback for Cloudflare Pages monorepo build ([1f05eac](https://github.com/narr07/nuxt-gsheet/commit/1f05eac))
- **docs:** Add vite.oxc.tsconfigRaw compilerOptions for Vite 8 OXC transformer ([555ae07](https://github.com/narr07/nuxt-gsheet/commit/555ae07))
- **docs:** Standalone tsconfig.json for OXC resolver compatibility on Cloudflare ([266c6ee](https://github.com/narr07/nuxt-gsheet/commit/266c6ee))
- **docs:** Add vite:extendConfig hook to force-inject OXC tsconfigRaw at runtime ([684a514](https://github.com/narr07/nuxt-gsheet/commit/684a514))
- **docs:** Add app/tsconfig.json for OXC resolver — plugin-vue only reads oxc config from devServer (unavailable during build) ([40553b2](https://github.com/narr07/nuxt-gsheet/commit/40553b2))
- **docs:** Pin vite to v7.3.6 via pnpm overrides to bypass Vite 8 OXC bug ([ba2dda0](https://github.com/narr07/nuxt-gsheet/commit/ba2dda0))
- **docs:** Add vite override to docs/pnpm-workspace.yaml because Cloudflare sets docs/ as root directory ([4363bae](https://github.com/narr07/nuxt-gsheet/commit/4363bae))
- **docs:** Disable frozen-lockfile for Cloudflare Pages build to allow Vite override application ([7fca9d5](https://github.com/narr07/nuxt-gsheet/commit/7fca9d5))
- **docs:** Disable Vite 8 OXC transformer to avoid TSCONFIG_ERROR on Cloudflare Pages ([3b4b4f8](https://github.com/narr07/nuxt-gsheet/commit/3b4b4f8))
- **docs:** Add postinstall script to patch plugin-vue and completely disable OXC transformer to bypass Cloudflare bug ([0c5dd4f](https://github.com/narr07/nuxt-gsheet/commit/0c5dd4f))
- **types:** Resolve TypeScript type errors and remove okf folder ([d15ca79](https://github.com/narr07/nuxt-gsheet/commit/d15ca79))

### 💅 Refactors

- **docs:** Restructure content and remove bundled agent skills ([f9913f0](https://github.com/narr07/nuxt-gsheet/commit/f9913f0))

### 📖 Documentation

- Customize root README.md and package.json description for nuxt-gsheet ([270dc2b](https://github.com/narr07/nuxt-gsheet/commit/270dc2b))
- Add StackBlitz demo link and update package.json skills config ([bf0e0f2](https://github.com/narr07/nuxt-gsheet/commit/bf0e0f2))

### 🏡 Chore

- Update repository path to narr07/nuxt-gsheet ([88974ce](https://github.com/narr07/nuxt-gsheet/commit/88974ce))
- **release:** V1.1.1 ([f31008b](https://github.com/narr07/nuxt-gsheet/commit/f31008b))
- Configure Dependabot for automated dependency updates ([b777c82](https://github.com/narr07/nuxt-gsheet/commit/b777c82))
- **docs:** Commit docs-specific pnpm-lock.yaml to satisfy Cloudflare frozen-lockfile check with Vite override ([5f1877d](https://github.com/narr07/nuxt-gsheet/commit/5f1877d))
- **docs:** Revert Vite 7 downgrade since Nuxt 4.5.1 depends on Vite 8 transformWithOxc API ([2484498](https://github.com/narr07/nuxt-gsheet/commit/2484498))
- **lock:** Restore Vite 8 lockfile after revert ([8218bec](https://github.com/narr07/nuxt-gsheet/commit/8218bec))
- **docs:** Remove pnpm lockfile and workspace in favor of bun ([a4bd8b2](https://github.com/narr07/nuxt-gsheet/commit/a4bd8b2))
- Remove docs site and drop docs dependabot config ([78f3fd8](https://github.com/narr07/nuxt-gsheet/commit/78f3fd8))
- Remove googleapis dependency from package.json ([dfdac26](https://github.com/narr07/nuxt-gsheet/commit/dfdac26))

### ❤️ Contributors

- Dinar, Permadi ([@narr07](https://github.com/narr07))

## v1.1.1

[compare changes](https://github.com/narr07/nuxt-gsheet/compare/v1.1.0...v1.1.1)

### 📖 Documentation

- Customize root README.md and package.json description for nuxt-gsheet ([270dc2b](https://github.com/narr07/nuxt-gsheet/commit/270dc2b))

### 🏡 Chore

- Update repository path to narr07/nuxt-gsheet ([88974ce](https://github.com/narr07/nuxt-gsheet/commit/88974ce))

### ❤️ Contributors

- Dinar, Permadi ([@narr07](https://github.com/narr07))

## v1.1.0


### 🚀 Enhancements

- Implement nuxt-gsheet module with multi-auth, locking cache, and devtools dashboard ([f1b8a1e](https://github.com/your-org/my-module/commit/f1b8a1e))

### 🩹 Fixes

- Resolve homepage 404 by querying landing collections directly ([5e10cb1](https://github.com/your-org/my-module/commit/5e10cb1))
- Resolve TS2742 type inference compilation issues in build ([01ba9c8](https://github.com/your-org/my-module/commit/01ba9c8))

### 📖 Documentation

- Implement Nuxt UI template bilingual documentation website ([3a7cd8e](https://github.com/your-org/my-module/commit/3a7cd8e))
- Add bilingual demo pages to sidebar and content database ([185323e](https://github.com/your-org/my-module/commit/185323e))

### 🎨 Styles

- Configure tabs style and fix ESLint errors ([7194123](https://github.com/your-org/my-module/commit/7194123))

### ❤️ Contributors

- Dinar, Permadi <dinarpermadi07@gmail.com>

