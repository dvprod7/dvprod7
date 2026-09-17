# Arquitectura objetivo — dvprod7 V3

## Decisión de fondo: reset del layer de presentación, mismo repo

No se empieza un repo nuevo. Se conserva la base (git, tooling, Angular 20, esbuild) y se
**borra y reescribe todo lo visual**. Razón: el andamiaje de Angular 20 está bien y es reciente;
lo que está podrido es el design system y los componentes, y eso se borra sin culpa.

## Stack y por qué

| Decisión | Elección | Por qué |
|---|---|---|
| Framework | Angular 20 standalone (ya está) | Es el stack, y el portafolio *demuestra* Angular |
| Change detection | **Zoneless** (`provideZonelessChangeDetection()`, aplicado en la 2a.1) + signals | Quitar `zone.js` baja ~40kB del bundle y es el default moderno; el sitio no tiene async complejo |
| Estilos | **SCSS + CSS custom properties** | Ver abajo. **No Tailwind** |
| Layout | CSS Grid + `clamp()` + container queries | El grid de 12 columnas clonado de Bootstrap se borra |
| Cascada | `@layer` | Mata las guerras de especificidad sin `!important` |
| Iconos | Sprite SVG + componente `<app-icon>` | Reemplaza el zoo de SVG inline y el `bypassSecurityTrustHtml` |
| Contenido | Content layer tipado en TS | Habilita ESP/ENG barato y separa copy de markup |
| Render | **Prerender estático** (`@angular/ssr`, `ng build --prerender`) | SEO + LCP. Un portafolio sin SEO no cumple su función comercial. **Confirmado** |
| i18n | Content layer con forma `Record<Locale, …>`, solo `en` en v1 | ESP/ENG está diseñado pero sin copy. **Confirmado** |

### Por qué NO Tailwind

Figma devuelve React+Tailwind, así que es tentador. Se descarta porque:
1. Dany escribe SCSS/BEM a diario en Emulsify/Drupal — la consistencia con su día a día vale más.
2. El proyecto ya es SCSS/BEM; migrar añade una dependencia y una curva por cero ganancia real.
3. Un single-page con ~8 componentes no tiene el problema de escala que Tailwind resuelve.

**Nunca instales Tailwind aquí**, ni siquiera "temporalmente" para portar el output de Figma.

### Por qué CSS custom properties y no variables SCSS

Las variables SCSS del legado (`$bolt`, `$Jet`) se evalúan en build y desaparecen. Las custom
properties se ven en devtools, permiten theming en runtime (el diseño ya insinúa un futuro
light mode con `color-scheme`), y se pueden serializar a formato DTCG para sincronizar con
Figma variables más adelante. SCSS se queda solo por anidamiento, mixins y bucles.

---

## Estructura de archivos objetivo

```
src/
  app/
    app.ts / app.html / app.scss          shell: skip link + <app-nav> + <main> con las 5 secciones + <app-footer>
    app.config.ts                          providers (zoneless, router opcional)
    core/
      content/                             copy tipado (fuente de verdad del texto)
        site-content.ts                    interfaces + datos EN
        site-content.es.ts                 datos ES (fase posterior)
      models/                              interfaces compartidas (Project, SkillGroup, ...)
    sections/                              una carpeta por sección de la página
      nav/        hero/        about/
      skills/     projects/    contact/
      footer/                              <footer> del shell (fuera de <main>)
    ui/                                    primitivas reutilizables, sin lógica de negocio
      button/     chip/        card/
      icon/       social-links/
    styles/
      _tokens.scss                         :root con todas las custom properties
      _reset.scss
      _base.scss                           elementos: html, body, h1-h6, p, a
      _mixins.scss                         up(), visually-hidden(), focus-ring()
      _layers.scss                         @layer reset, tokens, base, layout, components, utils
  styles.scss                              orquesta lo anterior + @font-face (UNA sola vez)
public/
  fonts/inter-latin-wght.woff2             subset propio (ver design-tokens.md)
  icons/sprite.svg
  images/
```

Notas:
- `sections/` vs `ui/` es la distinción clave: una *section* es única y ligada al contenido;
  un *ui* es reutilizable y tonto. La tarjeta de proyecto y la de "building now" son el
  **mismo** `ui/card`.
- ~~**`src/assets/` desaparece.**~~ ✅ Borrada en la Fase 1g. En Angular 18+ lo estático va en
  `public/`, que se sirve desde la raíz (`public/images/x` → `/images/x`).

## Convenciones

### Angular
- Standalone siempre. `imports: [...]` explícito, sin NgModules.
- `ChangeDetectionStrategy.OnPush` en **todos** los componentes.
- Estado con `signal()` / `computed()`. Nunca campos mutables públicos.
- Entradas/salidas con `input()` / `output()`, no los decoradores `@Input`/`@Output`.
- Queries con `viewChild()` / `viewChild.required()`, nunca `@ViewChild` + `ngOnInit`
  (el legado tiene exactamente ese bug — ver `audit-legacy.md`).
- Control flow `@if` / `@for` / `@switch`. `track` siempre con una clave estable, no `$index`.
- Efectos secundarios de DOM en `afterNextRender()` o `effect()`, no en `ngOnInit`.
- Nombres de clase sin sufijo (`Hero`, `Nav`, `ProjectCard`), archivos en kebab-case.
- Selectores con prefijo `app-`.

### SCSS
- Un bloque BEM por componente, con el nombre del componente como bloque:
  `.hero`, `.hero__title`, `.hero__title--compact`.
- **Máximo 3 niveles de anidamiento.**
- Cero literales: nada de `#faff70`, `22px`, `1.5rem` sueltos. Todo `var(--dv-*)`.
- Mobile-first: base sin media query, `@include up(md)` para subir. **Nunca `max-width`.**
- Propiedades lógicas (`padding-inline`, `margin-block`) en vez de left/right/top/bottom.
- Nada de `@use 'variables' as *` encadenando `@font-face` — es la causa del bug de fuentes
  duplicadas del legado.
- **Parciales que emiten CSS (`_layers`, `_tokens`, `_reset`, `_base`) solo se cargan desde
  `src/styles.scss`, una vez.** Ningún componente hace `@use` de ellos, ni ahora ni después:
  los componentes leen los tokens como `var(--dv-*)`. Desde componentes solo se hace `@use`
  de `_mixins` (sin salida CSS). `@use` no puede ir dentro de `@layer`, así que en
  `styles.scss` se cargan con `@include meta.load-css(...)` dentro de su capa.

### Accesibilidad (mínimo de salida, no opcional)
- `<a href="#about">` reales, no `href="#"`.
- Toggle del menú: `<button aria-expanded aria-controls>`, `✕` con `aria-label`.
- Menú abierto: bloqueo de scroll del body, cierre con `Escape`, foco devuelto al toggle.
- SVG decorativos (`bg-hex`, iconos dentro de un link etiquetado): `aria-hidden="true"`.
- Anillo de foco visible con token propio, nunca `outline: none` a secas.
- Respetar `prefers-reduced-motion` en cualquier transición o scroll suave.
- Landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`, y un skip-link.

### SEO / meta (el `index.html` actual no tiene nada)
- `<title>` real, `meta description`, Open Graph + Twitter card, `canonical`.
- `lang` correcto (y dinámico si entra ESP/ENG).
- JSON-LD `Person` — barato y ayuda para un portafolio.
- Prerender a HTML estático.

---

## Plan de reconstrucción por fases

**Fase 0 — Higiene** (sin tocar UI)
`.nvmrc` + `engines`, ESLint (angular-eslint) + Stylelint + Prettier, borrar `.DS_Store` y
añadirlo a `.gitignore`, sacar `FIGMA_NAMING_CONVENTION.md` de `src/assets/`, arreglar
`angular.json` (`src/favicon.ico` apunta a un archivo que no existe; el favicon vive en `public/`).

**Fase 1 — Fundación de diseño**
`_tokens.scss` completo desde `design-tokens.md`, `@layer`, `_reset` y `_base` (añadidos
dentro de `@layer`, **sin** reemplazar todavía a `_globals`), mixin `up()` autónomo, Inter
variable auto-hospedada (subset propio). Borrar `_fonts.scss` y las fuentes legadas (las dos
copias) y sacar `src/assets` del build. `_variables.scss` se queda (sin `@use 'fonts'`)
porque los componentes legados lo consumen.

**Fase 2 — Shell**
Quitar el scroll-snap y el `overflow: hidden` de `html, body`. `app.html` con `<header>` +
`<main>` + las 5 secciones reales. Nav V3 con signals y a11y, portando el *comportamiento*
del menú mobile del legado (no su código). Borrar `_grid.scss`, `_helpers.scss`, `_ui.scss`
y `_globals.scss`.
Al borrar `_globals`, verificar que `html { color-scheme: dark }` de `_base` empieza a
aplicarse: hoy lo pisa el `:root { color-scheme: light dark }` de `_globals`, que va sin capa
(y los estilos sin capa ganan a cualquier `@layer`). Comprobar en devtools el valor computado
de `color-scheme` en `<html>` y que controles y scrollbars salen oscuros también con el SO en
modo claro.

**Fase 3 — Primitivas UI**
`button` (variantes fill-cta / outline-accent / fill-accent), `chip`, `card`, `icon` (con el
sprite SVG), `social-links`. Se construyen una vez y las secciones las consumen.
Ojo: `_reset` pone `svg { display: block }`, así que `<app-icon>` declara su propio `display`
(p. ej. `inline-block` o `inline-flex`) en vez de heredar el del reset.

**Fase 4 — Secciones**, en este orden (de menor a mayor incertidumbre):
Hero → Skills → About → Projects → Contact.
Skills va temprano porque es la más simple en V3 y valida la escala tipográfica.
About va después de Skills porque depende de la foto real, que todavía no existe.

**Fase 5 — Contenido y remates**
Content layer con el copy real, meta/SEO, prerender, `prefers-reduced-motion`, auditoría de
contraste y Lighthouse.

**Fase 6 — Opcional / posterior**
Switch ESP/ENG, animaciones de entrada, analytics.
Animaciones de entrada: si entran (Fase 4 o pulido), **CSS nativo** con
`animation-timeline: view()` por sección, sin librerías, solo dentro de
`@media (prefers-reduced-motion: no-preference)` y con `@supports` para que el contenido se
vea igual sin soporte. Nada de JS ni de `IntersectionObserver` para esto.

## Decisiones cerradas (confirmadas por Dany, 2026-08-20)

**1. i18n — estructura sí, traducción después.**
El content layer nace con forma de i18n desde el día uno: `Record<Locale, SiteContent>` o
equivalente, con `Locale = 'en' | 'es'`. En v1 solo se llena `en`.
- El switch `ESP / ENG` del navbar **se maquetea pero se oculta** (`hidden` / no renderizado)
  hasta que exista copy en español. No se borra del componente.
- Activar español después debe ser **añadir un archivo**, nunca refactorizar componentes.
- Ningún string de UI se escribe inline en un template. Todo pasa por el content layer.
- Con prerender, el plan a futuro es una ruta por locale (`/` y `/es`), no un toggle en runtime
  — tenlo presente al diseñar el content layer para no cerrarte esa puerta.

**2. Prerender estático — sí.**
Se añade `@angular/ssr` y se construye con `ng build --prerender`. Salida: HTML plano, sin
servidor Node. Consecuencias que hay que respetar desde la Fase 2, no al final:
- **Nunca toques `window`, `document` o `localStorage` en el cuerpo de un componente.** Va en
  `afterNextRender()` o detrás de `isPlatformBrowser()`.
- El menú mobile (bloqueo de scroll, `Escape`, focus trap) es exactamente el punto donde esto
  muerde: todo su acceso al DOM va en `afterNextRender()`.
- Nada de medir alturas durante el render inicial.
- `provideClientHydration()` en `app.config.ts`.
- Las metas por sección/SEO se resuelven en build, no en runtime.

**3. Hosting — pendiente.**
Sin definir. No bloquea nada hasta la Fase 5. Cuando se decida, revisar `<base href>`
(hoy `/` en `index.html`) — si el sitio no va en la raíz de un dominio, hay que ajustarlo.
**Pendiente de la Fase 5:** las URLs absolutas (`/fonts/inter-latin-wght.woff2` en el
`@font-face` y en el preload) dan 404 si el deploy usa una subruta (p. ej. GitHub Pages de
proyecto, `/<repo>/`). Al elegir hosting, revisar `base href` y esas rutas juntas. Las
imágenes (`images/…` en el `<picture>`) son relativas y se resuelven contra `base href`.
Firebase aparece en el stack histórico de Dany y encaja bien con salida estática.

## Cambios de orden (2026-09-16)

- **Borrado de `_grid`, `_helpers`, `_ui` y `_globals`: Fase 1 → Fase 2.** Los templates
  legados usan sus clases; borrarlos en la Fase 1 descuadra la maqueta vieja durante tres
  fases sin ganar nada. En la Fase 1 conviven `_globals` (sin capa) con `_reset` y `_base`
  (dentro de `@layer`). Los estilos sin capa ganan a cualquier capa, pero el reset, la base y
  el borrado de las fuentes legadas sí cambian el aspecto del legado: estado mixto aceptado
  (ver `audit-legacy.md`).
- **`_variables.scss` sobrevive hasta que muera el último componente legado** (Fase 4).
- **Sprite de iconos: Fase 1 → Fase 3**, junto con `<app-icon>`, que es su único consumidor.

## Fase 2 (2026-09-17)

- **Router muerto borrado (2a).** `app.routes.ts` y `provideRouter` fuera; `@angular/router`
  sigue en `package.json` por si la Fase 6 añade la ruta `/es`.
- **Zoneless aplicado (2a.1).** `provideZonelessChangeDetection()` en `app.config.ts`, sin
  polyfills en `angular.json` (build y test) y `zone.js` desinstalado (queda en el lockfile
  como peer opcional de `@angular/core`, sin importarse). En Angular 20 el `TestBed` todavía
  asume zone.js: **todo spec nuevo** lleva `providers: [provideZonelessChangeDetection()]`
  o falla con `NG0908`. Estado que se ve en la vista → signals o eventos de template;
  cualquier `addEventListener`, `setTimeout` o promesa que mute un campo plano no repinta.
- **Scroll de documento (2b).** Fuera el scroll-snap y el `overflow: hidden` de `html, body`.
  `_base` pone `scroll-padding-block-start: var(--dv-nav-height)` en `html` (anclas y foco
  quedan bajo la nav fija) y `scroll-behavior: smooth` solo con
  `prefers-reduced-motion: no-preference`.
- **Provider zoneless por spec, no global (2d, decidido por Dany).** Cada spec que use
  `TestBed` declara `providers: [provideZonelessChangeDetection()]`; si falta, falla en seco con
  `NG0908`. Los specs de solo datos (p. ej. `site-content.spec.ts`) no lo necesitan.
  Evaluado y descartado: la opción `main` del builder `@angular/build:karma` (un `src/test.ts`
  propio) obliga a replicar a mano el `initTestEnvironment` que hoy genera el builder.
  **Solución limpia a futuro:** `providersFile` del builder `@angular/build:unit-test`
  (experimental en la 20.3); retomarlo cuando deje de serlo.
- **Content layer del shell (2d).** `core/models/section-id.ts` y
  `core/content/site-content.ts`. Los links guardan el texto sin `/` ni mayúsculas
  (presentación). El logo va partido (`open` / `name` / `close`) para que el nombre accesible
  sea "dvprod7". Año del copyright y nombre accesible del `<dialog>`: se deciden en la 2g.
- **Shell y footer (2e).** El footer es un componente propio, `sections/footer/` (decidido por
  Dany): en Figma vive dentro de Contact, pero el landmark `contentinfo` tiene que quedar fuera
  de `<main>`. La regla y el espacio a ambos lados (`--dv-footer-gap`) son del footer.
  **Pendiente para la Fase 4:** decidir cómo se suma el padding inferior de Contact a ese hueco
  (en Figma hay 72 px entre la fila de CTA y la regla). El skip link aparece en
  flujo al recibir foco (sin `position: fixed` ni `z-index`) y `<main tabindex="-1">` recibe el
  foco sin anillo. Los hosts de sección llevan `display: block` desde `app.scss` para que las
  anclas midan bien.
