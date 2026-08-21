# Auditoría del código legado (2026-08-20)

Estado del repo en `main` @ `73f301c`. Este documento existe para que nadie —humano o agente—
tome el código actual como referencia, y para saber exactamente qué se borra.

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
| **Comportamiento** del menú mobile (`navbar.ts`) | Solo la idea: toggle overlay fullscreen. El código se reescribe con signals + a11y |
| `src/assets/FIGMA_NAMING_CONVENTION.md` | Se mueve a `docs/`. No debe publicarse con el sitio |

## Qué se borra

- Todo `src/app/styles/` (`_variables`, `_fonts`, `_globals`, `_grid`, `_helpers`, `_ui`).
- Todos los componentes de sección: `hero`, `about`, `skills`, `projects`, `contact`, `socials`.
- El layout de scroll-snap en `app.scss` + `styles.scss`.
- Las fuentes Manrope y Roboto Condensed (ambas copias).
- Los `.spec.ts` — son stubs generados por el CLI, no prueban nada.
- `src/assets/` completa (migra a `public/`).

---

## Hallazgos concretos

### 🔴 Bloqueantes / bugs reales

**1. `@font-face` duplicado 12 veces en el bundle.**
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

**3. `angular.json` referencia un asset inexistente.**
`assets: ["src/favicon.ico", "src/assets"]` — `src/favicon.ico` no existe; el favicon está en
`public/favicon.ico`, que **no** está en la lista. Hoy el build pasa, pero la config está mal
y el favicon no se sirve desde donde se cree.

**4. Fuentes duplicadas en disco.**
Los mismos 4 `.woff2` están en `public/fonts/` y en `src/assets/fonts/`. `_fonts.scss` apunta a
`/assets/fonts/`, así que la copia de `public/` es peso muerto.

**5. Node incompatible.**
El `node` por defecto es v22.11.0 y el CLI de Angular exige ≥ v22.12 — `ng build` falla en seco.
Hay que usar `~/.nvm/versions/node/v22.23.2`. Sin `.nvmrc` ni `engines`, esto vuelve a morder.

### 🟠 Deuda de diseño

**6. Grid clonado de Bootstrap.** `_grid.scss` genera 12 columnas × 5 breakpoints + clases de
orden a mano. `_helpers.scss` reimplementa utilidades de flex. Juntos son ~114 líneas que CSS
Grid nativo resuelve en un puñado. Además `.img-fluid` está declarada **dos veces**.

**7. `map-get` global está deprecado.** `_mixins.scss` usa `map-get($breakpoints, $breakpoint)`.
Dart Sass pide `@use 'sass:map'` + `map.get`. Va a romper en Sass 3.

**8. Números mágicos.** Existe `$navbar-height: 120px`, pero `hero.scss` y `about.scss`
hardcodean `calc(100dvh - 120px)`. La variable y el uso ya divergieron.

**9. La paleta ya divergió del diseño.** `$bolt: #f5f749` en SCSS, pero el SVG del logo en
`navbar.html` trae `stroke="#FAFF70"` hardcodeado — el valor V3. Dos amarillos conviviendo.

**10. `app.html` renderiza `<app-hero>` dos veces** como relleno de la cuarta sección.

**11. `overflow: hidden` en `html, body`** + scroll-snap mandatorio. Es una decisión de la V1
(fullscreen sections) incompatible con la página larga de V3.

### 🟡 Calidad / mantenibilidad

**12. Zoo de SVG inline.** `skills.html` son 189 líneas, casi todas paths SVG dentro de cadenas
`@if ($index === 0)`, `@if ($index === 1)`... Acopla el icono al índice del array. Algunos ni
son los logos reales (el de PHP es un `<circle>` con un `<text>PHP</text>`, el de Docker son
4 rectángulos).

**13. `bypassSecurityTrustHtml` para iconos estáticos.** `socials.ts` mete SVG como strings y
los inyecta con `[innerHTML]`. Innecesario y mal patrón: un sprite lo resuelve sin tocar el
sanitizador.

**14. Sin signals.** `Navbar.isMenuOpen` es un booleano público mutable. Todo el proyecto usa
change detection por defecto, sin `OnPush`.

**15. `Socials.trackByName()` es código muerto** — la plantilla ya usa `@for ... track link.name`.

**16. `@for (i of [0,1,2,3,4]; track i)`** en `skills.html`: literal de array en la plantilla,
se recrea en cada CD, y el conteo está hardcodeado en vez de derivarse de `mainSkills`.

**17. Router muerto.** `app.routes.ts` vacío, `RouterOutlet` comentado, pero `provideRouter([])`
sigue en los providers.

### 🟡 Accesibilidad — no hay nada

- Todos los links de nav son `href="#"`.
- El toggle del menú no tiene `aria-expanded` ni `aria-controls`.
- El overlay no atrapa el foco, no cierra con `Escape`, no bloquea el scroll del body.
- Ningún SVG decorativo tiene `aria-hidden`.
- No hay skip-link, ni landmarks (`<header>`, `<footer>`), ni estilos de `:focus-visible`.
- `.social-links .icon:hover { transform: rotateY(360deg) }` ignora `prefers-reduced-motion`.
- `<h4>dvprod7 © 2025</h4>` usa un heading como texto de pie — jerarquía rota.

### 🟡 SEO — no hay nada

`index.html`: `<title>Dvprod7App</title>`, sin `meta description`, sin Open Graph, sin canonical.
Para una pieza cuyo objetivo es comercial, esto es lo primero a arreglar.

### 🟡 Higiene

- `.DS_Store` commiteados en `src/`, `src/assets/`, `src/assets/fonts/`, `src/assets/images/`.
  `.gitignore` los lista, pero ya estaban trackeados antes.
- `FIGMA_NAMING_CONVENTION.md` se publica en `dist/.../assets/` — es documentación interna
  quedando expuesta.
- Cero linters: sin ESLint, sin Stylelint. Prettier está configurado pero no forzado.
- Sin CI.
- `README.md` es el perfil de GitHub de Dany pegado, no documentación del proyecto.
- `package-lock.json` aparece modificado sin commit desde el inicio de la sesión.

## Comandos de verificación

```bash
export PATH="/Users/danval2/.nvm/versions/node/v22.23.2/bin:$PATH"
npx ng build --configuration development
grep -c '@font-face' dist/dvprod7-app/browser/main.js   # 48 hoy, debe ser 0 en V3
```
