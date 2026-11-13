---
name: dvprod7
description: Context and working rules for the dvprod7 Angular portfolio, rebuilt to the V3 design. Use this skill for ANY task in this repo — reading, planning, or writing code. Covers the V3 Figma source of truth, the token-first design system, the architecture and its decisions, and the history of the deleted V1/V2 code (never a pattern reference). Triggers on: dvprod7, portafolio, portfolio, hero, navbar, skills section, projects section, contact section, design tokens, Figma V3.
---

# dvprod7 — Portafolio Angular (reconstrucción V3)

Portafolio single-page de **Daniel Felipe Valenzuela (Dany)**, frontend/Drupal dev en Bogotá.
Repo: la raíz del repo (rutas relativas a ella). Angular 20 standalone, SCSS, sin backend.

## ⚠️ Regla número uno

**El legado V1/V2 ya no existe** (borrado al cerrar la F4). El código de `src/` es V3. Pero el
historial de git anterior a la F4 implementa un diseño **muerto**: nunca saques de ahí patrones,
tokens ni nombres, y no recuperes componentes viejos.

- La única fuente de verdad visual es **Figma V3** → `references/figma-map.md`. Las desviaciones
  deliberadas de Figma (QA 4.5: sin `bg-hex`, contenedor único) están en `architecture.md`.
- La única fuente de verdad de tokens es `references/design-tokens.md`.

## Idioma

Dany conversa en **español**. Todo lo que va al repo o es público va en **inglés**:
código, comentarios, nombres de clases/archivos, mensajes de commit, copy del sitio, README.
Las explicaciones y el razonamiento en chat, en español.

## Límites: git, CI y deploy son de Dany

**Dany maneja manualmente todo lo que sale del working tree** — es su repo y su historial
público. No hagas, ni ofrezcas, ni sugieras como "siguiente paso": `git add/commit/push/merge/
rebase/tag`, crear ramas, PRs o releases, nada de `gh`, nada de CI, ningún deploy.

Sí puedes: git en **lectura** (`status`, `diff`, `log`, `show`), y `ng build` / `ng serve` para
verificar tu trabajo — compilar no es publicar.

Al cerrar una fase: **di qué archivos cambiaron y por qué, y para ahí.** Puedes ofrecer
mensajes de commit *como texto para copiar*, nunca ejecutarlos.

## Modo de trabajo: una sesión = una fase completa

- Ejecuta todos los subpasos (3a, 3b…) seguidos, **sin pedir permiso entre ellos**. El working
  tree puede quedar con cambios acumulados: Dany commitea por grupos al final.
- **Verificación obligatoria por subpaso:** `ng build`, `npm run lint`, `npm run lint:styles`,
  `lint:track`, `npm test -- --watch=false --browsers=ChromeHeadless` y comparación con Figma,
  desktop **y** mobile.
- **Para y pregunta solo si:** el Figma es ambiguo de una forma que cambia la estructura; hay
  que borrar algo que no está en `audit-legacy.md`; o una decisión contradice esta skill.
  Cualquier otra decisión menor: tómala y anótala en la entrada de cierre de la fase en la
  Bitácora (una entrada por fase, para respetar el máximo de 5).
- **Reporte de cierre**, agrupado por subpaso: archivos tocados, qué y por qué, y un mensaje de
  commit sugerido (texto) por subpaso. Más el checkpoint de cierre de fase (abajo).

## Estado actual

> **Última revisión: 2026-11-12 · Fase actual: Lanzamiento / deploy — Fase 5 cerrada (5a–5k); el build es estático.**
> Alcance recortado a lanzamiento (F3–F5); la F6 es post-lanzamiento. Ver `references/architecture.md`.

**Esta tabla puede estar desactualizada. Verifícala contra el repo antes de confiar en ella**
(protocolo abajo). Cada fila trae cómo comprobarla en 5 segundos.

| Área | Estado | Cómo verificar |
|---|---|---|
| Diseño V3 en Figma | ✅ Completo (desktop + mobile + menú abierto) | `get_screenshot` de `702:10` |
| Fase 0 — Higiene | ✅ Terminada (0a+0b+0c) | ¿existe `.nvmrc`? ¿hay ESLint en `package.json`? |
| Fase 1 — Tokens y fundación | ✅ Terminada (1a–1g) | ¿existe `src/app/styles/_tokens.scss`? |
| Fase 2 — Shell | ✅ Terminada (2a–2h) | `ls src/app/sections/nav/` |
| Fase 3 — Primitivas UI | ✅ Terminada (3a–3g); `copy-pill` llegó en la 5e | `ls src/app/ui/` |
| Fase 4 — Secciones | ✅ Terminada (4.0, 4.5 y las 5 secciones) | `ls src/app/sections/` |
| Fase 5 — Lanzamiento | ✅ Terminada (5a–5k): copy real, SEO, prerender estático, reduced motion, Lighthouse | `ng build` → "Prerendered 1 static route" |
| Deploy | ⬜ Hosting sin elegir (aplazado, ver `architecture.md`) | — |
| Código legado | ✅ Eliminado (F4): sin `components/` ni `_variables` | `ls src/app/components/` → no existe |
| Assets | ✅ Foto (AVIF+WebP, 524w/400w, sin 2x real) y PDF del CV, servidos desde `public/` | `ls public/images/` |

Leyenda: ⬜ no iniciada · 🟡 en curso · ✅ terminada · 🔴 problema conocido

### Protocolo de orientación (al empezar cualquier sesión de construcción)

```bash
ls src/app/styles/ src/app/ui/ src/app/sections/ 2>&1 | head -40
```

**El código es la fuente de verdad del progreso, no esta tabla.** Si hay discrepancia,
corrígela aquí antes de seguir; no la reportes y sigas de largo.

Lo que el repo **no** puede contarte —qué quedó a medias, qué se revirtió— vive en la
**Bitácora** al final.

## Requisito de entorno

**Node según `.nvmrc`; verifica `node -v` antes de cualquier `ng`.** No se aplica solo; si falta
la versión exacta, vale una que cumpla `engines.node`. No instales Node.
- macOS (nvm): `export PATH="$HOME/.nvm/versions/node/v22.23.2/bin:$PATH"` en el mismo comando.
- Windows (nvm-windows): `nvm use 22.23.2`. EOL: LF por `.gitattributes`, `format:check` tal cual.
  `lint:track` es POSIX: añade `--script-shell="C:\Program Files\Git\bin\bash.exe"`.

## Referencias (léelas cuando apliquen)

| Archivo | Cuándo leerlo |
|---|---|
| `references/design-tokens.md` | Siempre que escribas SCSS, elijas un color, tamaño, radio o espaciado |
| `references/figma-map.md` | Antes de construir cualquier sección: **flujo paso a paso**, node IDs, medidas desktop/mobile |
| `references/architecture.md` | Antes de crear archivos, decidir estructura de carpetas o patrones de Angular; fases y alcance |
| `references/audit-legacy.md` | Historia: qué tenía el legado y por qué se borró (antes de recuperar algo de git) |

## Reglas de código no negociables

- **Mobile-first.** Base = mobile, `@include up(md)` hacia arriba. Nunca `max-width`.
- **Tokens, no literales.** Cero hex, cero px mágicos en SCSS de componente.
- **BEM** dentro de cada componente (`.hero`, `.hero__title`, `.hero--compact`).
- **Signals, no campos mutables.** `signal()`, `computed()`, `input()`, `output()`.
- **`ChangeDetectionStrategy.OnPush`** en todo componente.
- **Contenido como datos.** El copy vive en un content layer tipado con forma
  `Record<Locale, …>` (`'en' | 'es'`), aunque en v1 solo se llene `en`. Cero strings de UI
  inline en templates.
- **El sitio se prerenderiza.** Nunca toques `window` / `document` / `localStorage` en el
  cuerpo de un componente: va en `afterNextRender()` o detrás de `isPlatformBrowser()`.
- **Accesibilidad de entrada, no después.** `aria-expanded` en el
  toggle, foco visible, `aria-hidden` en SVG decorativos, anchors reales (`#about`, no `#`).
- **SVG por sprite**, nunca inline en template ni `bypassSecurityTrustHtml`.

## Mantener esta skill viva

**Checkpoint de cierre de fase (obligatorio, sin pedir permiso).** Al terminar una fase, antes
de darla por cerrada: marca la fase ✅ en la tabla, mueve "Fase actual", actualiza la fecha,
añade entrada a la Bitácora si hubo algo no obvio, y arregla la referencia que haya quedado
desfasada. Es parte de terminar, como compilar.

**Disparadores de actualización:**

- **Dany tocó Figma** → relee los nodos y actualiza `design-tokens.md` / `figma-map.md` **antes**
  del código; si no, el token queda documentado con el valor viejo.
- **Decisión de arquitectura tomada o revertida** → `architecture.md`, con fecha y el porqué.
- **Instrucción nueva de Dany sobre cómo trabajar** → `SKILL.md`, no un comentario en el código.

**Estado volátil nunca va en las referencias:** `design-tokens.md` dice cuál es el token, no quién lo usa.

**Higiene.** El `SKILL.md` se paga en contexto cada vez que la skill se activa: **techo de 180
líneas**. Si algo tiene que entrar, algo tiene que salir — muda a `references/` o borra. Si una
regla no aplicó en varias fases, bórrala. Si explicas lo mismo en chat dos veces, eso va a la skill.

---

## Bitácora

Solo lo que el código **no** puede contar: decisiones sobre la marcha, cosas aplazadas a
propósito, callejones sin salida. Si se deduce con un `ls` o un `git log`, no va aquí. Entradas
cortas, con fecha, más reciente arriba. **Máximo 5 entradas**: al añadir la sexta, borra la más
vieja — si algo de ahí sigue importando, ya debería ser una regla o una decisión cerrada.

- **2026-11-12** — Fase 5 cerrada, en dos sesiones. Prerender 100 % estático (`outputMode:
  "static"`, sin Express); `@angular/ssr` 20.3.9 a mano (`ng add` chocaba con el lockfile).
  `<head>` por `applySeo()` idempotente. Lighthouse en localhost no ve el gzip: el 93 de Perf
  mobile es pesimista. Post-lanzamiento: OG image, favicon propio, parche de `@angular/*`.
- **2026-11-12** — Fase 4 cerrada, en dos sesiones. QA 4.5 (Dany), desviaciones de Figma: sin
  `bg-hex` (sustituto animado en la F6), contenedor único (mixin `container`, tope 1280). El
  display **no** crece por encima de 1440 (rompía el límite de zoom 2.5×): tope en 150. Contact
  sin padding inferior: el hueco a la regla es `--dv-footer-gap`. Legado borrado entero.
- **2026-11-12** — Fase 3 cerrada (3a–3g). Botón = `<app-button>` que envuelve un `<a>` (ESLint
  exige selector de elemento); `bg-hex` = un SVG en `public/images/`, no en el sprite (las 5
  instancias solo difieren en opacidad → CSS en la F4); iconos de Tabler (MIT). Links del menú
  siguen en y=132. Tests en headless: con Chrome visible y en segundo plano el `close` del
  `<dialog>` llega tarde y fallan 4 specs de Nav. Detalle en `architecture.md`.
- **2026-11-12** — Cambio de alcance y de modo de trabajo. El sitio es una pieza para
  recruiters (bio, stack, proyectos, CV, contacto); servicios/venta van a otro proyecto. F3
  solo con lo que consuma la F4; Projects con placeholders `TODO` en el content layer; F5 sin
  copy ES; F6 post-lanzamiento. Hosting aplazado (dvprod7.com en la raíz → `base href="/"`
  cerrado). Nuevo modo autónomo: una sesión = una fase.
- **2026-09-17** — Fase 2 cerrada (2a–2h). Zoneless y scroll de documento; nav V3 con menú en
  `<dialog>`; fuera `_grid`/`_helpers`/`_ui`/`_globals`, navbar y router. Aplazado a la F4:
  parches del legado (`min-height` en hero/about, `flex-wrap` en skills) y `_variables`;
  `providersFile` del builder `unit-test`, cuando deje de ser experimental.

## Contexto de negocio (por qué el rediseño)

La V1 era un portafolio genérico "Creative Developer" con lorem ipsum. La V3 es una pieza
**recruiter-friendly y sencilla**: bio, stack, proyectos, CV y contacto. Narrativa de web
developer full-stack-ish (front-end + CMS), experiencia real en un equipo SaaS de US y una
sección "BUILDING NOW" que muestra momentum. **Páginas de servicios o venta a clientes no van en
este repo** (serán otro proyecto); no las propongas aquí. Al escribir o ajustar copy, mantén el
tono "Evidence over adjectives": concreto, verificable, sin marketing vacío.
