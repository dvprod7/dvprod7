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
| Render | **Prerender estático** (`@angular/ssr`, `ng build --prerender`) | SEO + LCP. Un portafolio que los recruiters no encuentran no cumple su función. **Confirmado** |
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
      models/                              interfaces compartidas (SectionId, IconName, breakpoints, ...)
    sections/                              una carpeta por sección de la página
      nav/        hero/        about/
      skills/     projects/    contact/
      footer/                              <footer> del shell (fuera de <main>)
    ui/                                    primitivas reutilizables, sin lógica de negocio
      button/     chip/        card/
      icon/       logo/        social-links/
      copy-pill/                           (F5) pill que copia el email en Contact
    styles/
      _tokens.scss                         :root con todas las custom properties
      _reset.scss
      _base.scss                           elementos: html, body, h1-h6, p, a
      _mixins.scss                         up(), container(), eyebrow(), section-title(), visually-hidden()
      _layers.scss                         @layer reset, tokens, base, layout, components, utils
  styles.scss                              orquesta lo anterior + @font-face (UNA sola vez)
public/
  fonts/inter-latin-wght.woff2             subset propio (ver design-tokens.md)
  icons/sprite.svg + Tabler-Icons-MIT.txt
  images/                                  foto de perfil + bg-hex.svg (sin uso desde la 4.5)
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

> **Alcance recortado (2026-11-12, decidido por Dany).** El objetivo es lanzar una pieza
> recruiter-friendly y sencilla (bio, stack, proyectos, CV, contacto). Lo que no sirve a eso
> sale del camino crítico: las fases que cuentan para el lanzamiento son F3–F5; la F6 es
> post-lanzamiento. Las páginas de servicios/venta a clientes no van en este repo.

**Fase 3 — Primitivas UI** ✅ **Cerrada el 2026-11-12 (3a–3g).** Decisiones abajo, en
"Fase 3 (2026-11-12)". Plan original:
**Solo las primitivas que consuman las secciones de la F4** — nada "por si acaso". Candidatas:
`button` (variantes fill-cta / outline-accent / fill-accent), `chip`, `card`, `icon` (con el
sprite SVG), `social-links`; antes de construir una, confirma en `figma-map.md` qué sección de
la F4 la usa, y si ninguna la usa, no se construye. Se construyen una vez y las secciones las
consumen.
`ui/` ya existe: la 2f adelantó `ui/logo`, que marca el patrón (tonta, con `input.required`, sin
estilos propios).
Pendientes concretos que entran aquí:
- **Sprite de iconos y de dónde salen.** Hacen falta iconos reales para las social pills (en
  Figma son las letras `@`, `GH`, `in`) y para `bg-hex`. Antes de meter `bg-hex` al sprite hay
  que comparar los cuatro SVG que exporta Figma (ver `figma-map.md`): si solo cambian rotación
  u offset, basta un asset.
- **`<app-icon>` declara su propio `display`** (p. ej. `inline-block` o `inline-flex`): `_reset`
  pone `svg { display: block }` y heredarlo rompe la alineación dentro de texto y botones.
- **Social pills del menú mobile.** El `<dialog>` de la 2g dejó su hueco vacío (hay un
  comentario en `nav.html`). Al llenarlo, **revisar la posición vertical de los links del menú**:
  hoy empiezan en y=132 y Figma los pone en y=210; con las pills colocadas se ve el reparto
  completo y se decide si hace falta ajustar (ver `figma-map.md`).

**Fase 4 — Secciones** ✅ **Cerrada el 2026-11-12** (decisiones abajo, en "Fase 4"). Plan original,
en este orden (de menor a mayor incertidumbre):
Hero → Skills → About → Projects → Contact.
Skills va temprano porque es la más simple en V3 y valida la escala tipográfica.
About va después de Skills porque depende de la foto real, que todavía no existe.
La F4 termina **borrando todo el legado** que quede (`src/app/components/` y `_variables.scss`,
según `audit-legacy.md`).
**Projects con datos placeholder:** los proyectos viven en el content layer tipado con datos de
relleno marcados de forma inequívoca — cada proyecto lleva un comentario `// TODO(content):`
encima (y un texto visible que no se pueda confundir con copy real) para que Dany llene el
contenido después **sin tocar componentes**. El componente no sabe si el dato es placeholder.

**Fase 5 — Lanzamiento (recortada)**
Copy real **en inglés** en el content layer, meta/SEO (title, description, Open Graph, canonical,
JSON-LD), prerender, `prefers-reduced-motion` y **una** pasada de Lighthouse (+ contraste)
corrigiendo lo que salga, sin perseguir 100/100. **Fuera de la F5:** el copy en español; la
estructura `Record<Locale, …>` se queda tal cual.

**Fase 6 — Post-lanzamiento (fuera de alcance hasta lanzar)**
- Copy ES y switch ESP/ENG (ruta `/es`).
- Animaciones de entrada.
- Analytics.
- Fondo decorativo animado (figuras difusas que se mueven con el scroll), sustituye al bg-hex
  (retirado en la 4.5).

Animaciones de entrada: cuando entren, **CSS nativo** con
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

**3. Hosting — aplazado hasta tener el sitio funcionando en local (actualizado 2026-11-12).**
Mientras tanto la revisión es local con `ng serve`. Hechos ya conocidos:
- Dominio **dvprod7.com**, con el DNS en **Cloudflare**.
- El Vue v1 en producción sigue en **Firebase** y **no se toca**.
- El sitio nuevo va en la **raíz del dominio** → `<base href="/">` y las URLs absolutas de la
  fuente (`/fonts/inter-latin-wght.woff2` en el `@font-face` y en el preload) son correctas.
  ~~Pendiente de la F5: revisar `base href` y rutas absolutas~~ — **cerrado**.
- Candidato a evaluar cuando toque: **Cloudflare (Pages/Workers)**, por tener ahí el DNS.
  Encaja con la salida estática del prerender.

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
  ~~**Pendiente para la Fase 4:** decidir cómo se suma el padding inferior de Contact a ese hueco
  (en Figma hay 72 px entre la fila de CTA y la regla).~~ ✅ **Resuelto en la F4:** Contact va
  sin padding inferior y el hueco es `--dv-footer-gap` (64; 18 en mobile). El skip link aparece en
  flujo al recibir foco (sin `position: fixed` ni `z-index`) y `<main tabindex="-1">` recibe el
  foco sin anillo. Los hosts de sección llevan `display: block` desde `app.scss` para que las
  anclas midan bien.
- **`ui/` se adelanta con `ui/logo` (2f).** La primitiva nace antes de la Fase 3 porque la nav
  y el footer pintan el mismo `</dvprod7>` y el nombre accesible ("dvprod7", con los símbolos en
  `aria-hidden`) tiene que salir de un solo sitio. Es tonta: recibe el `LogoContent` por
  `input.required` y no trae estilos; quien la usa la estiliza desde su propio bloque BEM.
  El resto de `ui/` (button, chip, card, icon, social-links) sigue en la Fase 3.
- **Nav V3 (2f).** `sections/nav/`, sticky desde el `:host` (un `<header>` sticky dentro de un
  host inline no pega). Grid `1fr auto 1fr`: con el switch ESP/ENG oculto, la tercera columna
  vacía mantiene los links centrados. Por debajo de `lg` el `<nav>` entero se oculta
  (`display: none`), así que no hay landmark de navegación vacío ni links enfocables; el menú
  mobile llega en la 2g. El navbar legado se borró aquí.
- **Menú mobile (2g).** `<dialog>` + `showModal()`: el foco atrapado, el cierre con Escape y la
  devolución del foco al toggle son del navegador, no código nuestro (verificado con teclado y
  con ratón real; un `.click()` sintético no enfoca el botón, así que en tests el foco vuelve al
  `<body>` — no es un fallo del componente). El bloqueo de scroll es CSS en `_base`
  (`html:has(dialog[open])`), con `scrollbar-gutter: stable` siempre para que no salte el ancho.
  El `<dialog>` **no** se oculta con `display: none` en desktop: eso dejaría el fondo inerte con
  el panel invisible; lo cierra el listener de `matchMedia` (`afterNextRender` + `DestroyRef`).
  El año del copyright se calcula al renderizar (`new Date().getFullYear()`), así que con
  prerender queda horneado en el HTML y el content layer solo guarda el texto fijo.

## Fase 3 (2026-11-12)

Cada primitiva se confirmó contra `figma-map.md` antes de crearla; las cinco tienen consumidor en
la F4 (o ya en la nav). Todas son tontas: reciben datos por `input()` y no leen el content layer.

| Primitiva | La consume | API |
|---|---|---|
| `ui/icon` | `social-links` (y quien necesite un icono) | `name: IconName` |
| `ui/button` | Hero (View Projects, Hire me), About (Download CV), Contact (Say hello) | `href`, `variant: cta \| outline \| accent`, `size: md \| sm`, `download` |
| `ui/chip` | `ui/card` | `variant: default \| cta`; texto proyectado |
| `ui/card` | Projects (Selected work y Building now) | `heading`, `description`, `tags`, `status?`, `headingLevel`, `links?` + `newTabHint` (F5) |
| `ui/social-links` | Menú mobile (ya), Hero (`icon`) y Contact (`pill`) en la F4 | `links: SocialLink[]`, `variant: icon \| pill` |

- **Sprite (3a).** `public/icons/sprite.svg`, servido como `/icons/sprite.svg` (`ICON_SPRITE` en
  `core/models/icon.ts`, junto a `ICON_NAMES`; un spec comprueba que cada nombre tiene su
  `<symbol>`). Iconos de **Tabler Icons v3.31.0** (MIT, licencia junto al sprite): `at`,
  `brand-github` → `github`, `brand-linkedin` → `linkedin`. Se eligió un set de trazo (no logos
  oficiales a color) porque van en negro sobre la pill amarilla y tienen que verse de una familia.
  Para añadir uno: el `<symbol>` al sprite primero y luego el nombre a `ICON_NAMES`.
- **`<app-icon>` declara su propio display (3a):** `:host { display: inline-block }` a `1em`
  (sigue al texto); el consumidor fija el tamaño sobre el host. Siempre `aria-hidden`: el nombre
  accesible es del link o botón que lo contiene.
- **`bg-hex` (3a): un solo asset, fuera del sprite.** Los cinco SVG de Figma (hero d/m, skills,
  contact d/m) tienen la misma geometría, degradado, blur y tamaño; **solo cambia la opacidad del
  grupo** (hero .5, skills .26, contact .34; el .3 de contact mobile es deriva). Se guardó una vez
  en `public/images/bg-hex.svg` **sin** esa opacidad, que la pone cada sección en la F4. No va al
  sprite porque lleva degradado y filtro, que por `<use>` externo no son fiables entre
  navegadores; se usa como `<img alt="" aria-hidden>`. Ojo: trae `preserveAspectRatio="none"`.
- **Botón (3b) = `<app-button>` que envuelve un `<a>` real.** Todos los botones del diseño
  navegan (ancla, PDF, mailto). Un selector de atributo (`a[app-button]`) choca con la regla
  `component-selector` (tipo elemento) de ESLint, y no se toca la regla. Los tres variantes llevan
  el mismo borde de `--dv-border-btn` (transparente en los rellenos) para medir igual. Figma no
  dibuja hover; ~~los botones no tienen~~ **resuelto en la 5c** (ver "Fase 5").
- **Card (3d):** `<article>` con `<h3>`; el `status` (texto) pinta el chip `cta` delante de los
  tags y el borde naranja. Los tags hacen de clave de `track`, así que no se repiten en una card.
- **Social links (3e):** los datos viven en `SITE_CONTENT[locale].socialLinks` (id, label, href,
  icono); el label es el texto de la pill y el `aria-label` del link de icono. URLs tomadas del
  legado (`socials.ts`). ~~Mismo tab, sin `target="_blank"`.~~ **Revertido en la 4.0
  (2026-11-12, Dany):** los perfiles externos (`newTab: true` en el dato, no se deduce del href)
  abren en pestaña nueva con `target="_blank" rel="noopener noreferrer"`, y su nombre accesible
  lleva `a11y.newTabHint` ("(opens in a new tab)"): en el `aria-label` del link de icono y en un
  `<span>` visualmente oculto en la pill. El `mailto` no lleva `target`. La primitiva recibe la
  pista por `input.required` (no lee el content layer). Hover solo en `pill` (mismo patrón que
  los links de la nav). 44 px en todos los breakpoints (objetivo táctil); el 37–39 de mobile y el
  45 del menú son deriva.
- **Menú (3f):** las pills van con `margin-block-start: auto`, justo encima del copyright; caen
  donde Figma (y≈736 frente a 740 a 440×900). Los links **se quedan en y=132** (decisión en
  `design-tokens.md`, "Posición de los links del menú").
- **Tests en headless.** `ng test` lanza Chrome visible; con la ventana en segundo plano el evento
  `close` del `<dialog>` llega después de la espera del spec y fallan 4 specs de Nav (pasan en
  `--browsers=ChromeHeadless`, y aislados también fallan con Chrome visible). La verificación usa
  headless.
- ~~**`format:check` en Windows.** Con `core.autocrlf=true` el checkout es CRLF y Prettier exige
  LF: marca casi todos los archivos.~~ **Resuelto en la 4.0:** `.gitattributes` fija
  `* text=auto eol=lf` (manda sobre `core.autocrlf`) y marca como `binary` avif, webp, png, ico,
  woff2 y pdf. `format:check` pasa tal cual en Windows, sin `--end-of-line auto`.

## Fase 4 (2026-11-12) — cerrada

En dos sesiones (decidido por Dany): la 1 hizo 4.0, Hero, Skills y About; la 2, la QA 4.5,
Projects, Contact, el borrado final del legado y el cierre.

- **4.5 — Ajustes de QA (Dany, 2026-11-12). Desviaciones deliberadas de Figma:**
  1. **Sin `bg-hex`.** Fuera el `<img>` del Hero y los tokens `--dv-hex-*`; Contact no lo lleva.
     El SVG se queda en `public/images/`. Sustituto en la F6 (fondo animado).
  2. **Contenedor único.** Mixin `container` (`_mixins`): `padding-inline: max(gutter,
     (100% − content-max) / 2)` sobre el bloque de ancho completo. Nav, menú, secciones y footer
     comparten borde izquierdo (antes, a 1536, el logo iba en x=150 y el contenido en x=190). Las
     secciones ya no llevan `max-inline-size` + `margin-inline: auto` en su `__inner`.
  3. **Contenido hasta 1280.** `--dv-content-max` pasa de un `clamp` (392→1140) a un tope de
     1280. Por debajo de 1580 manda el gutter, así que hasta 1440 nada cambia (1140 a 1440) y de
     1440 a 1580 el contenido crece hasta 1280; después crecen los márgenes. Sin breakpoint nuevo.
  4. **Display sin cambios: tope en 150.** Pedido: que escalara por encima de 1440 (~77 % del
     contenedor). Hacía falta ~168 px, 2.8× el mínimo de mobile, y rompía el límite de zoom de
     `design-tokens.md` (≤ 2.5×). Dany eligió mantener el tope: "DEVELOPER" queda en ~77 % a 1440
     y ~68 % desde 1580.
  Verificado a 440, 800, 1100, 1440, 1536 y 1920.
- **4.0 — EOL y enlaces.** `.gitattributes` con LF y binarios (ver "format:check" arriba);
  email público `dvprod7@gmail.com`; perfiles externos en pestaña nueva (ver "Social links").
- **Secciones = `sections/<nombre>/`, tontas respecto al contenido de otras:** cada una lee solo
  su rama de `SITE_CONTENT` (`hero`, `skills`, `about`) más `socialLinks` / `a11y` si los pinta.
  El `id` del ancla sigue en el host, en `app.html`; dentro, un `<section aria-labelledby>` que
  apunta a su `h1`/`h2`.
- **Eyebrow y h2 de sección son mixins** (`eyebrow`, `section-title` en `_mixins`), no una
  primitiva: es tipografía, sin comportamiento. La `/` va en el template con `aria-hidden`; el
  copy se guarda en caja normal y la mayúscula es CSS donde el diseño la muestra (About, Skills),
  igual que en la nav. El título del hero también (`'Web developer'` + `text-transform`).
- **Emojis decorativos** (`😎`, `💻`): campo `emoji` aparte en el content layer, pintado en un
  `<span aria-hidden>`; no entran en el nombre accesible.
- **Hero.** El título es una sola caja con `max-inline-size: min-content`: mide lo que
  "DEVELOPER" y siempre cae en las dos líneas del diseño, también con el contenedor de 1280 (a
  1920 "WEB DEVELOPER" cabía en una línea). CTAs: `cta` → `#projects`, `outline` → `#contact`.
- **Skills.** 1 columna → 2 desde `md` → 4 desde `lg`. La regla es el `border-block-start` del
  grupo. Grupos `h3` + `ul`.
- **About.** Apilado hasta `lg`, luego grid `35fr 18fr` (= 700 : 360) con
  `--dv-about-columns-gap`. Pillars en 3 columnas desde `md`. Foto: `<picture>` AVIF + WebP
  (400w/524w), `object-fit: cover`, `aspect-ratio` 392/461 en mobile y 360/440 desde `lg`,
  `loading="lazy"`. CV con `app-button` `cta` `sm` y `download`.
- **Alto de sección:** todas con `--dv-section-padding-block`, sin `min-height`. About queda más
  baja que el frame de Figma (820, con el contenido centrado en mucho aire): aceptado por la regla
  de normalización de `design-tokens.md`.
- **Projects.** Dos grids del mismo `ui/card` (1 columna → 2 desde `md`), en `<ul>`. El `<li>` es
  grid para que la tarjeta llene su celda y las de una fila igualen el alto. "/ BUILDING NOW" es
  un `h3` naranja (`--dv-color-cta-text`, tamaño `label`, tracking de eyebrow); por eso
  `ui/card` ganó `headingLevel: 3 | 4` (sus tarjetas son `h4`). El chip de estado sale de
  `buildingNow.status`, no de los tags.
- ~~**Placeholders de Projects.**~~ **Sustituidos por el copy real en la 5b.** Cada proyecto llevaba `// TODO(content):` encima y `[TODO]` visible
  delante del título y de la descripción, conservando el texto de Figma para que Dany edite en
  vez de escribir de cero. Para llenarlos: solo `site-content.ts`. Un spec garantiza títulos
  únicos y tags únicos por tarjeta (son claves de `track`).
- **Contact.** `app-button` `accent` `sm` + `ui/social-links` `pill` en una fila que envuelve
  (en mobile las pills caen debajo del botón como un bloque). "Say hello" apunta al mismo
  `mailto` que el link Email: una constante `EMAIL_HREF` en el content layer, y un spec lo
  comprueba. Sin padding inferior: el hueco hasta la regla es del footer. Sin formulario.
- **Borrado final.** Fuera `components/` (projects, contact), `_variables.scss` y su `@use` en
  `styles.scss`; las tres listas de ignores quedan sin legado y `lint:track` deja de excluir
  `components`. El aviso de presupuesto (`anyComponentStyle`, 4 kB) era del `skills.scss` legado
  y ya no aparece en `ng build` de producción desde la sesión 1.

## Fase 5 (2026-11-12) — en curso

En dos sesiones (decidido por Dany): la 1 hace contenido y ajustes visibles (5a–5e); la 2,
meta/SEO, prerender, reduced motion, Lighthouse y el cierre.

- **5a — Links en `ui/card`.** `links?: CardLink[]` (`label`, `href`, `newTab`) en el dato del
  proyecto; la tarjeta los pinta en un `<ul>` al pie (`margin-block-start: auto`, así se alinean en
  una fila de tarjetas del mismo alto). Mismo contrato que `social-links`: externos con
  `target="_blank" rel="noopener noreferrer"` y `a11y.newTabHint` en un `<span>` visualmente
  oculto; la pista llega por `input` (la card no lee el content layer). Sin links, la tarjeta no
  cambia. Estilo solo con tokens existentes: texto `--dv-color-text` semibold, subrayado en
  `--dv-color-border-accent` con `text-underline-offset: --dv-space-4`; hover/focus = regla de la
  nav (pasa a `--dv-color-accent`). `padding-block: --dv-space-4` sube el objetivo a ≥ 24 px
  (WCAG 2.5.8). Sin token nuevo.
- **5b — Copy real de Projects.** 4 tarjetas en Selected work (grid 2×2) y 1 en Building now (ocupa
  media fila desde `md`). Apóstrofos tipográficos (`’`) como el resto del copy. El link "Code" de
  Dubtoast queda como `TODO(content)` comentado en el dato: **la tarjeta sale solo con "Live
  site"** hasta tener la URL del repo. Intro de Building now: "One client project in progress
  right now." (la anterior hablaba de dos proyectos y de GitHub).
- **5c — Estados de `ui/button`.** Figma no los dibuja. Regla, coherente con nav y pills ("el
  acento toma el control"): `cta` y `outline` → relleno `--dv-color-accent` con
  `--dv-color-accent-contrast`; `accent` (ya amarillo) → se invierte al look outline
  (`--dv-color-surface-inverse`, texto y borde acento). Mismo estado en `:hover` y
  `:focus-visible`; el anillo global sigue fuera del relleno por el offset. Transición 0.2 s solo
  con `prefers-reduced-motion: no-preference`.
- **5d — Accesibilidad.** Los links del logo (nav y menú; el del footer no es link) llevan
  `aria-label` = `shell.logoLinkLabel` ("dvprod7 — home"), que empieza por el nombre visible
  (WCAG 2.5.3; un spec lo comprueba). Emojis decorativos: revisados, ya iban en
  `<span aria-hidden>` (hero, About) desde la F4; sin cambios.
- **5e — Desviaciones de Figma (QA, Dany, 2026-11-12):**
  1. **Nav desktop alineada a la derecha.** Grid `1fr auto`: los links quedan pegados al borde
     derecho del contenedor. El hueco central de Figma era del switch ESP/ENG (post-lanzamiento);
     cuando vuelva, ocupa una tercera columna implícita. El menú mobile no cambia.
  2. **Email de Contact copiable.** Nueva primitiva `ui/copy-pill` (un `<button>`, no un link):
     en reposo muestra "Email"; con `:hover` / `:focus-visible` (o mientras dura "Copied") se
     ensancha y muestra la dirección, animando **solo** su columna (`grid-template-columns: auto
     0fr → auto 1fr`; las pills vecinas se desplazan; con reduced motion no hay transición). Clic,
     tap o Enter copian con `navigator.clipboard.writeText`; "Copied" + icono `check` ~2 s y
     anuncio en un `aria-live="polite"` siempre presente. Sin clipboard o si falla → `mailto`
     (`location.assign`). Clipboard, `location` y el timer solo en el handler (prerender). Nombre
     accesible "Copy email address" (contiene el visible "Email"). Textos en
     `contact.copyEmail`; `fallbackHref` es la misma constante que "Say hello" y el link Email.
     En Contact, `socialLinks` se filtra sin `email`; en el hero y el menú Email sigue siendo link.
  - El estilo de pill pasó a un mixin `pill` en `_mixins` (lo comparten `social-links` y
    `copy-pill`); recibe declaraciones extra por `@content` para evitar el aviso `mixed-decls`
    de Sass. Icono `check` de Tabler v3.31.0 añadido al sprite (el `✓` no está en el subset de
    Inter).
  Verificado a 440, 800, 1100, 1440, 1536 y 1920 (Chrome headless por CDP: capturas, hover,
  copia real con permiso de portapapeles y reset a los 2 s).
