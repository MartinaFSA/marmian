# Next.js docs map (App Router)

Esta versión de Next tiene breaking changes. Antes de escribir/editar código de Next,
abrí la guía relevante de abajo con Read. Rutas relativas a la raíz del repo.
Base: `node_modules/next/dist/docs/`

## Conceptos base (getting-started)
- Estructura de proyecto → `01-app/01-getting-started/02-project-structure.md`
- Layouts y páginas → `01-app/01-getting-started/03-layouts-and-pages.md`
- Linking y navegación → `01-app/01-getting-started/04-linking-and-navigating.md`
- **Server vs Client Components** → `01-app/01-getting-started/05-server-and-client-components.md`
- Fetching de datos → `01-app/01-getting-started/06-fetching-data.md`
- Mutating datos (Server Actions) → `01-app/01-getting-started/07-mutating-data.md`
- Caching → `01-app/01-getting-started/08-caching.md`
- Revalidating → `01-app/01-getting-started/09-revalidating.md`
- Error handling → `01-app/01-getting-started/10-error-handling.md`
- CSS → `01-app/01-getting-started/11-css.md`
- Imágenes / Fonts → `01-app/01-getting-started/12-images.md` · `13-fonts.md`
- Metadata y OG images → `01-app/01-getting-started/14-metadata-and-og-images.md`
- Route handlers (API) → `01-app/01-getting-started/15-route-handlers.md`
- **Upgrading** → `01-app/01-getting-started/18-upgrading.md` · `01-app/02-guides/upgrading/version-16.md`

## Directivas
- `"use client"` → `01-app/03-api-reference/01-directives/use-client.md`
- `"use server"` → `01-app/03-api-reference/01-directives/use-server.md`
- `"use cache"` → `01-app/03-api-reference/01-directives/use-cache.md`

## File conventions (qué exporta cada archivo especial)
- `page` / `layout` / `template` → `01-app/03-api-reference/03-file-conventions/page.md` · `layout.md` · `template.md`
- `loading` / `error` / `not-found` → `.../loading.md` · `error.md` · `not-found.md`
- `route.ts` (route handler) → `01-app/03-api-reference/03-file-conventions/route.md`
- Dynamic / parallel / intercepting routes → `.../dynamic-routes.md` · `parallel-routes.md` · `intercepting-routes.md`
- Route groups / src folder → `.../route-groups.md` · `src-folder.md`
- Route segment config (runtime, dynamicParams…) → `01-app/03-api-reference/03-file-conventions/02-route-segment-config/index.md`

## Funciones / hooks comunes
- `cookies` / `headers` → `01-app/03-api-reference/04-functions/cookies.md` · `headers.md`
- `redirect` / `permanentRedirect` → `.../redirect.md` · `permanentRedirect.md`
- `revalidatePath` / `revalidateTag` → `.../revalidatePath.md` · `revalidateTag.md`
- `generateStaticParams` / `generateMetadata` → `.../generate-static-params.md` · `generate-metadata.md`
- `useRouter` / `usePathname` / `useSearchParams` / `useParams` → `.../use-router.md` · `use-pathname.md` · `use-search-params.md` · `use-params.md`
- Componentes (`<Link>`, `<Image>`, `<Form>`, `<Script>`, `next/font`) → `01-app/03-api-reference/02-components/`

## Config (next.config.js)
- Índice de todas las opciones → `01-app/03-api-reference/05-config/01-next-config-js/index.md`
- TypeScript / ESLint → `01-app/03-api-reference/05-config/02-typescript.md` · `03-eslint.md`

## Guías frecuentes
- Auth → `01-app/02-guides/authentication.md`
- Forms → `01-app/02-guides/forms.md`
- Env vars → `01-app/02-guides/environment-variables.md`
- i18n → `01-app/02-guides/internationalization.md`
- Tailwind / Sass / CSS-in-JS → `01-app/02-guides/tailwind-v3-css.md` · `sass.md` · `css-in-js.md`
- Testing (jest/vitest/playwright/cypress) → `01-app/02-guides/testing/`
- Migrar a cache components → `01-app/02-guides/migrating-to-cache-components.md`

## Otros
- Glosario → `01-app/04-glossary.md`
- Pages Router (legacy) → `02-pages/`
- Arquitectura (compiler, fast refresh, browsers) → `03-architecture/`

> ¿No está acá el tema? Listá `node_modules/next/dist/docs/01-app/` y buscá por nombre.
