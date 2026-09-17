# Auditoría del código legado (2026-08-20)

Estado del repo en `main` @ `73f301c`. Este documento existe para que nadie —humano o agente—
tome el código actual como referencia, y para saber exactamente qué se borra.

## Parches temporales vivos (a fecha de 2026-09-17)

Código legado tocado a propósito para no dejar la página rota mientras se reescribe. **No son
patrones**: ninguno se replica en código nuevo y todos mueren con su componente.

| Parche | Archivo | Por qué | Muere en |
|---|---|---|---|
| `height` → `min-height` | `hero.scss`, `about.scss` | Sin `_grid` (2c), el contenido de About se desbordaba sobre el hero y sobre Skills: texto ilegible a 1440 | Fase 4 |
| Fuera `flex-wrap: nowrap` en `md` | `skills.scss` | Sus 5 iconos no caben hasta ~1280 y la página ganaba scroll horizontal, antes oculto por el `overflow: hidden` que se quitó en la 2b | Fase 4 |

## Veredicto

**~90% se borra.** El andamiaje de Angular 20 está sano; la capa visual completa corresponde a
un diseño abandonado. Reescribir sale más barato y más limpio que adaptar.

## Qué se conserva

| Cosa | Nota |
|---|---|
| Repo, historia de git, rama `main` | — |
| Angular 20.1 + `@angular/build` (esbuild) | Toolchain al día |
| Patrón standalone components | Correcto |
| Config de Prettier en `package.json` | Sirve tal cual |
| `$Flame: #dd6031` | Único color que sobrevive → pasa a ser `--dv-orange-500` |
| ~~**Comportamiento** del menú mobile (`navbar.ts`)~~ | ✅ Portado en la 2g: la idea (toggle + overlay a pantalla completa) vive ahora en `sections/nav` con `<dialog>`, signals y a11y. El componente legado se borró en la 2f |
| ~~`src/assets/FIGMA_NAMING_CONVENTION.md`~~ | ✅ Movido a `docs/` en la Fase 0b; fuera de `dist/` |

## Qué se borra

- Todo el `src/app/styles/` legado (`_variables`, ~~`_fonts`~~, ~~`_globals`~~, ~~`_grid`~~,
  ~~`_helpers`~~, ~~`_ui`~~). `_fonts` ✅ borrado en la Fase 1f; los otros cuatro ✅ en la 2c.
  Solo queda `_variables` (Fase 4).
- Todos los componentes de sección: `hero`, `about`, `skills`, `projects`, `contact`, `socials`.
- ~~El layout de scroll-snap en `app.scss` + `styles.scss`.~~ ✅ Borrado en la Fase 2b.
- ~~Las fuentes Manrope y Roboto Condensed (ambas copias).~~ ✅ Borradas en la Fase 1f.
- Los `.spec.ts` de los componentes — stubs generados por el CLI, no prueban nada.
  (`app.spec.ts` **no** era un stub inocuo: ver Higiene.)
- ~~`src/assets/` completa (migra a `public/`).~~ ✅ Borrada en la Fase 1g; fuera del build.

**Regla de borrado: tres listas de ignores.** El legado está excluido de los linters en tres
sitios: `ignores` de `eslint.config.js`, `ignoreFiles` de `.stylelintrc.json` y
`.prettierignore`. Cada fase que reescriba una parte del legado quita su entrada **de las tres**
y vuelve a correr `lint`, `lint:styles` y `format:check`. Cuando las tres estén vacías de
legado, el legado ya no existe. Nunca se añade código nuevo a esas listas.

**Estado visual mixto aceptado (Dany, 2026-09-16).** Desde la Fase 1f el legado convive con
el reset y la base V3: el texto heredado sale en Inter, los `h1`–`h6` y `p` legados piden
Manrope / Roboto Condensed (ya borradas) y caen a `sans-serif`, y el reset quita márgenes que
`_globals` no fija. **No se corrige**: el sitio Angular no está en uso público (GitHub Pages
activo pero sin uso; el dominio sirve la v1 en Vue desde otro repo) y el legado se reescribe
entero en las fases 2–4. No abras tareas para "arreglar" su aspecto.

---

## Hallazgos concretos

### 🔴 Bloqueantes / bugs reales

**1. ~~`@font-face` duplicado 12 veces en el bundle.~~** ✅ **Resuelto en la Fase 1f**
(`_fonts.scss` borrado; 0 en `main.js` en desarrollo y en producción).
`_variables.scss` hace `@use 'fonts' as *`, y cada SCSS de componente hace `@use 'variables'
as *`. Como `_fonts.scss` contiene reglas `@font-face` (no solo declaraciones), Sass las emite
en **cada** hoja de estilo de componente.
Evidencia: `grep -c '@font-face' dist/dvprod7-app/browser/main.js` → **48** ocurrencias
(4 reglas × 12 contextos), más 4 legítimas en `styles.css`.
Lección para V3: los partials que se `@use`an desde componentes deben contener **solo**
variables, mixins y funciones. Nunca CSS emitido.

**2. `Skills.setupScrollListener()` nunca corre.**
`@ViewChild('mainStack')` sin `{ static: true }` no está resuelto en `ngOnInit`, así que
`if (!this.mainStack) return;` sale siempre. Los indicadores del slider mobile están muertos.
Además el listener nunca se remueve. En V3 la sección Skills es texto plano, así que el
componente entero desaparece — pero el patrón (`viewChild()` signal query + `afterNextRender`)
sí debe corregirse donde haga falta.

**3. ~~`angular.json` referencia un asset inexistente.~~** ✅ **Resuelto en la Fase 0a.**
~~`assets: ["src/favicon.ico", "src/assets"]` — `src/favicon.ico` no existe; el favicon está en
`public/favicon.ico`, que **no** está en la lista. Hoy el build pasa, pero la config está mal
y el favicon no se sirve desde donde se cree.~~
El target `build` ahora usa `{ "glob": "**/*", "input": "public" }`, igual que el target `test`.

**4. ~~Fuentes duplicadas en disco.~~** ✅ **Resuelto en la Fase 1f**: las 8 `.woff2` legadas
borradas; en `public/fonts/` solo queda Inter y su licencia. `src/assets` salió del build y del
disco en la 1g. Historia:
Los mismos 4 `.woff2` están en `public/fonts/` y en `src/assets/fonts/`. `_fonts.scss` apunta a
`/assets/fonts/`. ~~Así que la copia de `public/` es peso muerto.~~ Desde la Fase 0a **las dos
copias se sirven** (`src/assets` sigue en la lista de assets porque `_fonts.scss` y la foto de
perfil aún dependen de ella), así que la duplicación ahora es visible en `dist/`. Desaparece
cuando la Fase 1 migre a Inter y borre `src/assets/`.

**5. ~~Node incompatible.~~** ✅ **Resuelto en la Fase 0a.**
~~El `node` por defecto es v22.11.0 y el CLI de Angular exige ≥ v22.12 — `ng build` falla en seco.
Hay que usar `~/.nvm/versions/node/v22.23.2`. Sin `.nvmrc` ni `engines`, esto vuelve a morder.~~
Hay `.nvmrc` con `22.23.2` y `engines.node` en `package.json`. **Ojo:** `.nvmrc` no se aplica
solo — sigue haciendo falta `nvm use` (o el `export PATH` de la skill) en cada shell nuevo.

### 🟠 Deuda de diseño

**6. ~~Grid clonado de Bootstrap.~~** ✅ **Resuelto en la Fase 2c** (`_grid` y `_helpers`
borrados; las clases `container`, `row`, `col-*`, `img-fluid`, `text-center` y `btn` siguen en
las plantillas legadas, sin estilos, hasta que mueran sus componentes).
~~`_grid.scss` genera 12 columnas × 5 breakpoints + clases de
orden a mano. `_helpers.scss` reimplementa utilidades de flex. Juntos son ~114 líneas que CSS
Grid nativo resuelve en un puñado. Además `.img-fluid` está declarada **dos veces**.~~

**7. ~~`map-get` global está deprecado.~~** ✅ **Resuelto en la Fase 1c:** `_mixins.scss` es
autónomo, usa `@use 'sass:map'` + `map.get` y no queda ningún `map-get` en `src/`.
~~`_mixins.scss` usa `map-get($breakpoints, $breakpoint)`. Dart Sass pide `@use 'sass:map'` +
`map.get`. Va a romper en Sass 3.~~

**8. Números mágicos.** Existe `$navbar-height: 120px`, pero `hero.scss` y `about.scss`
hardcodean `calc(100dvh - 120px)`. La variable y el uso ya divergieron.
Desde la 2b, `$navbar-height` no lo usa nadie; los dos `calc` mueren con hero y about (Fase 4).
**Parche temporal (2c):** al borrar `_grid`, la foto de About perdió `.col-lg-4` y ocupaba todo
el ancho; con `height` fijo y `align-items: center`, el contenido se desbordaba sobre el hero y
sobre Skills (texto ilegible a 1440). En `about.scss` y `hero.scss`, `height` pasó a
`min-height`. No se limitó la foto a propósito. **El parche desaparece al reescribir hero y
about en la Fase 4**; no lo repliques en código nuevo.

**Parche temporal (2f):** `skills.scss` tenía `flex-wrap: nowrap` en el stack auxiliar desde
`md`; sus 5 iconos de 100 px no caben en la columna hasta ~1280, así que la página ganaba scroll
horizontal entre ~768 y ~1200 px. **El desbordamiento ya existía**: lo tapaba el
`overflow: hidden` que se quitó en la 2b. Se quitó el `nowrap` (los iconos envuelven, como en
mobile). **Muere al reescribir Skills en la Fase 4**; en V3 esa sección es texto plano sin
iconos.

**9. La paleta ya divergió del diseño.** `$bolt: #f5f749` en SCSS, contra el `#FAFF70` de V3.
~~El SVG del logo en `navbar.html` trae `stroke="#FAFF70"` hardcodeado.~~ ✅ Ese SVG murió con el
navbar en la 2f; el amarillo viejo sigue en hero, skills y socials hasta la Fase 4.

**10. ~~`app.html` renderiza `<app-hero>` dos veces~~** como relleno de la cuarta sección.
✅ **Resuelto en la Fase 2b.**

**11. ~~`overflow: hidden` en `html, body`~~** + scroll-snap mandatorio. ✅ **Resuelto en la
Fase 2b**: el documento hace scroll. ~~Es una decisión de la V1 (fullscreen sections)
incompatible con la página larga de V3.~~

### 🟡 Calidad / mantenibilidad

**12. Zoo de SVG inline.** `skills.html` son 189 líneas, casi todas paths SVG dentro de cadenas
`@if ($index === 0)`, `@if ($index === 1)`... Acopla el icono al índice del array. Algunos ni
son los logos reales (el de PHP es un `<circle>` con un `<text>PHP</text>`, el de Docker son
4 rectángulos).

**13. `bypassSecurityTrustHtml` para iconos estáticos.** `socials.ts` mete SVG como strings y
los inyecta con `[innerHTML]`. Innecesario y mal patrón: un sprite lo resuelve sin tocar el
sanitizador.

**14. Sin signals.** ~~`Navbar.isMenuOpen` es un booleano público mutable.~~ ✅ Resuelto en la
2f/2g: ese componente ya no existe y el menú usa un signal. Desde la 2a.1 la app es **zoneless**
y todo lo nuevo lleva `OnPush`; los componentes legados siguen sin `OnPush` hasta la Fase 4.

**15. `Socials.trackByName()` es código muerto** — la plantilla ya usa `@for ... track link.name`.

**16. `@for (i of [0,1,2,3,4]; track i)`** en `skills.html`: literal de array en la plantilla,
se recrea en cada CD, y el conteo está hardcodeado en vez de derivarse de `mainSkills`.

**17. ~~Router muerto.~~** ✅ **Resuelto en la Fase 2a** (`app.routes.ts` y `provideRouter`
borrados). Quedan dos comentarios `RouterOutlet` en `app.ts`, que se reescribe en la 2e.
~~`app.routes.ts` vacío, `RouterOutlet` comentado, pero `provideRouter([])`
sigue en los providers.~~

### 🟡 Accesibilidad — no hay nada

- ~~Todos los links de nav son `href="#"`.~~ ✅ 2f: anclas reales a las cuatro secciones.
- ~~El toggle del menú no tiene `aria-expanded` ni `aria-controls`.~~ ✅ 2g.
- ~~El overlay no atrapa el foco, no cierra con `Escape`, no bloquea el scroll del body.~~
  ✅ 2g, con `<dialog>` modal y bloqueo de scroll en `_base`.
- Ningún SVG decorativo tiene `aria-hidden` (queda en el legado; lo nuevo sí lo marca).
- ~~No hay skip-link, ni landmarks (`<header>`, `<footer>`), ni estilos de `:focus-visible`.~~
  ✅ 2e/2f: skip link, `banner` / `main` / `contentinfo` / `navigation` y anillo de foco global.
- `.social-links .icon:hover { transform: rotateY(360deg) }` ignora `prefers-reduced-motion`.
- `<h4>dvprod7 © 2025</h4>` usa un heading como texto de pie — jerarquía rota.

### 🟡 SEO — no hay nada

`index.html`: `<title>Dvprod7App</title>`, sin `meta description`, sin Open Graph, sin canonical.
Para una pieza cuyo objetivo es comercial, esto es lo primero a arreglar.

### 🟡 Higiene

- **Corrección (2026-09-15):** hay `.DS_Store` sueltos en `src/`, `src/assets/`,
  `src/assets/fonts/` y `src/assets/images/`, pero **no están trackeados** —
  `git ls-files -- '*.DS_Store'` no devuelve nada, y `.gitignore` ya los cubre. No hay nada
  que borrar del índice. (La versión original de esta entrada decía que estaban commiteados;
  era falso.)
- ~~`FIGMA_NAMING_CONVENTION.md` se publica en `dist/.../assets/` — es documentación interna
  quedando expuesta.~~ ✅ **Resuelto en la Fase 0b:** movido a `docs/`, verificado ausente de `dist/`.
- ~~Cero linters: sin ESLint, sin Stylelint. Prettier está configurado pero no forzado.~~
  ✅ **Resuelto en la Fase 0c:** ESLint (angular-eslint), Stylelint, Prettier y `lint:track`.
- Sin CI.
- `README.md` es el perfil de GitHub de Dany pegado, no documentación del proyecto.
- **Corrección (2026-09-15):** `package-lock.json` **no** está modificado; el working tree está
  limpio. (La entrada original decía lo contrario.)
- ~~**Corrección (2026-09-15) — `app.spec.ts` no es un stub inocuo: la suite está en rojo.**~~
  ✅ **Resuelto en la Fase 0b.** Eran dos bugs encadenados: (1) `app.spec.ts` afirmaba
  `toContain('Hello, dvprod7-app')` sobre un `<h1>` inexistente, y (2) el target `test` de
  `angular.json` no tenía `stylePreprocessorOptions.includePaths`, que el `build` sí tenía, así
  que los 6 SCSS con `@use 'variables'` fallaban con *Can't find stylesheet to import* y la
  suite **ni compilaba**. Ambos arreglados: `ng test --watch=false --browsers=ChromeHeadless`
  → **8 de 8 SUCCESS, exit 0**.
  **Patrón a vigilar:** los targets `build` y `test` de `angular.json` se han desincronizado ya
  dos veces (assets en la 0a, `stylePreprocessorOptions` en la 0b). Al tocar uno, revisa el otro.
  ~~Queda un resto menor: el servidor de Karma devuelve `404 /assets/images/profile-img-dv.jpg`
  porque el target `test` solo sirve `public/`. No rompe ningún test y muere con el legado.~~
  ✅ **Resuelto en la Fase 1g:** la foto sale de `public/images/` y no queda ninguna
  referencia a `/assets/`. (Con la config actual, `ng test` no imprime los 404 del servidor de
  Karma, así que esto se verifica por ausencia de referencias, no por el log.)

## Comandos de verificación

```bash
export PATH="/Users/danval2/.nvm/versions/node/v22.23.2/bin:$PATH"
npx ng build --configuration development
grep -o '@font-face' dist/dvprod7-app/browser/main.js | wc -l   # 0 desde la Fase 1f
# Antes de la 1f: 48 en desarrollo (12 hojas × 4 reglas) y 24 en producción (main-*.js).
# `grep -c` cuenta líneas, no ocurrencias: no sirve para esto.
```
