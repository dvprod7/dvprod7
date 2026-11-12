---
name: dvprod7
description: Context and working rules for the dvprod7 Angular portfolio during its V3 rebuild. Use this skill for ANY task in this repo — reading, planning, or writing code — because the committed code implements an ABANDONED design and must not be used as a pattern reference. Covers the V3 Figma source of truth, the token-first design system, target architecture, and what is being deliberately deleted. Triggers on: dvprod7, portafolio, portfolio, hero, navbar, skills section, projects section, contact section, design tokens, Figma V3.
---

# dvprod7 — Portafolio Angular (reconstrucción V3)

Portafolio single-page de **Daniel Felipe Valenzuela (Dany)**, frontend/Drupal dev en Bogotá.
Repo: `/Users/danval2/personal/projects/dvprod7`. Angular 20 standalone, SCSS, sin backend.

## ⚠️ Regla número uno

**El código commiteado implementa un diseño MUERTO.** El proyecto estuvo 6 meses parado y el
diseño se rehízo por completo. Lo que está en `src/app/components/` y `src/app/styles/` es
maqueta de una versión anterior (V1/V2) con otra narrativa, otra tipografía, otra paleta y
otro layout.

Por lo tanto:

- **NUNCA** uses el código actual como referencia de patrones, tokens, nombres o estructura.
- **NUNCA** "adaptes" un componente viejo al diseño nuevo. Se reescribe.
- La única fuente de verdad visual es **Figma V3** → ver `references/figma-map.md`.
- La única fuente de verdad de tokens es `references/design-tokens.md`.
- Antes de tocar cualquier cosa del legado, lee `references/audit-legacy.md` para saber qué
  se conserva (muy poco) y qué se borra (casi todo).

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
  `npm run lint:track`, `npm test -- --watch=false` y comparación en navegador contra Figma,
  desktop **y** mobile.
- **Para y pregunta solo si:** el Figma es ambiguo de una forma que cambia la estructura; hay
  que borrar algo que no está en `audit-legacy.md`; o una decisión contradice esta skill.
  Cualquier otra decisión menor: tómala y anótala en la entrada de cierre de la fase en la
  Bitácora (una entrada por fase, para respetar el máximo de 5).
- **Reporte de cierre**, agrupado por subpaso: archivos tocados, qué y por qué, y un mensaje de
  commit sugerido (texto) por subpaso. Más el checkpoint de cierre de fase (abajo).

## Estado actual

> **Última revisión: 2026-11-12 · Fase actual: 3 (Primitivas UI) — Fase 2 cerrada (2a–2h).**
> Alcance recortado a lanzamiento (F3–F5); la F6 es post-lanzamiento. Ver `references/architecture.md`.

**Esta tabla puede estar desactualizada. Verifícala contra el repo antes de confiar en ella**
(protocolo abajo). Cada fila trae cómo comprobarla en 5 segundos.

| Área | Estado | Cómo verificar |
|---|---|---|
| Diseño V3 en Figma | ✅ Completo (desktop + mobile + menú abierto) | `get_screenshot` de `702:10` |
| Fase 0 — Higiene | ✅ Terminada (0a+0b+0c) | ¿existe `.nvmrc`? ¿hay ESLint en `package.json`? |
| Fase 1 — Tokens y fundación | ✅ Terminada (1a–1g) | ¿existe `src/app/styles/_tokens.scss`? |
| Fase 2 — Shell | ✅ Terminada (2a–2h) | `ls src/app/sections/nav/` |
| Fase 3 — Primitivas UI | 🟡 Solo `ui/logo` (adelantado en la 2f) | `ls src/app/ui/` |
| Fase 4 — Secciones | ⬜ No iniciada | ¿existe `src/app/sections/hero/`? |
| Fase 5 — Copy EN, SEO, prerender | ⬜ No iniciada | ¿`index.html` tiene `meta description`? |
| Código legado | 🟡 Quedan 6 componentes y `_variables` (mueren en la F4) | `ls src/app/components/` |
| Assets | ✅ Foto (AVIF+WebP, 524w/400w, sin 2x real) y PDF del CV, servidos desde `public/` | `ls public/images/` |

Leyenda: ⬜ no iniciada · 🟡 en curso · ✅ terminada · 🔴 problema conocido

### Protocolo de orientación (al empezar cualquier sesión de construcción)

```bash
ls src/app/styles/ src/app/ui/ src/app/sections/ src/app/components/ 2>&1 | head -40
```

**El código es la fuente de verdad del progreso, no esta tabla.** Si hay discrepancia,
corrígela aquí antes de seguir; no la reportes y sigas de largo.

Lo que el repo **no** puede contarte —qué quedó a medias, qué se revirtió— vive en la
**Bitácora** al final.

## Requisito de entorno

`.nvmrc` (22.23.2) y `engines.node` **no se aplican solos** y el CLI rechaza el node por
defecto. Antes de cualquier `ng` / `npm run`, en el mismo comando (el shell no persiste):

```bash
export PATH="/Users/danval2/.nvm/versions/node/v22.23.2/bin:$PATH"
```

## Referencias (léelas cuando apliquen)

| Archivo | Cuándo leerlo |
|---|---|
| `references/design-tokens.md` | Siempre que escribas SCSS, elijas un color, tamaño, radio o espaciado |
| `references/figma-map.md` | Antes de construir cualquier sección: **flujo paso a paso**, node IDs, medidas desktop/mobile |
| `references/architecture.md` | Antes de crear archivos, decidir estructura de carpetas o patrones de Angular; fases y alcance |
| `references/audit-legacy.md` | Antes de borrar o modificar algo del código existente |

## Reglas de código no negociables

- **Mobile-first.** Base = mobile, `@include up(md)` hacia arriba. Nunca `max-width`.
- **Tokens, no literales.** Cero hex, cero px mágicos en SCSS de componente.
- **BEM** dentro de cada componente (`.hero`, `.hero__title`, `.hero--compact`). Consistente
  con lo que Dany escribe a diario en Emulsify/Drupal.
- **Signals, no campos mutables.** `signal()`, `computed()`, `input()`, `output()`.
- **`ChangeDetectionStrategy.OnPush`** en todo componente.
- **Contenido como datos.** El copy vive en un content layer tipado con forma
  `Record<Locale, …>` (`'en' | 'es'`), aunque en v1 solo se llene `en`. Cero strings de UI
  inline en templates.
- **El sitio se prerenderiza.** Nunca toques `window` / `document` / `localStorage` en el
  cuerpo de un componente: va en `afterNextRender()` o detrás de `isPlatformBrowser()`.
- **Accesibilidad de entrada, no después.** El legado no tenía nada: `aria-expanded` en el
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
- **Se borró código legado** → tacha la entrada en `audit-legacy.md`.
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

- **2026-11-12** — Cambio de alcance y de modo de trabajo. El sitio es una pieza para
  recruiters (bio, stack, proyectos, CV, contacto); servicios/venta van a otro proyecto. F3
  solo con lo que consuma la F4; Projects con placeholders `TODO` en el content layer; F5 sin
  copy ES; F6 post-lanzamiento. Hosting aplazado (dvprod7.com en la raíz → `base href="/"`
  cerrado). Nuevo modo autónomo: una sesión = una fase.
- **2026-09-17** — Fase 2 cerrada (2a–2h). Zoneless y scroll de documento; nav V3 con menú en
  `<dialog>`; fuera `_grid`/`_helpers`/`_ui`/`_globals`, navbar y router. Aplazado: redes del
  menú y revisar con ellas la posición de sus links (y=132 frente al y=210 de Figma) → F3;
  parches temporales del legado (`min-height` en hero/about, `flex-wrap` en skills) y
  `_variables` → F4; `providersFile` del builder `unit-test`, cuando deje de ser experimental.
- **2026-09-17** — Fase 1 cerrada (1a–1g). Legado mixto: aceptado.
- **2026-09-16** — Fase 0 cerrada (0a–0c). Aplazado: presupuesto de `skills.scss` → F4.
- **2026-08-20** — Auditoría inicial y creación de esta skill. Decisiones cerradas (el detalle
  está en `architecture.md`). Pendiente de Dany: foto de perfil V3.

## Contexto de negocio (por qué el rediseño)

La V1 era un portafolio genérico "Creative Developer" con lorem ipsum. La V3 es una pieza
**recruiter-friendly y sencilla**: bio, stack, proyectos, CV y contacto. Narrativa de web
developer full-stack-ish (front-end + CMS), experiencia real en un equipo SaaS de US y una
sección "BUILDING NOW" que muestra momentum. **Páginas de servicios o venta a clientes no van en
este repo** (serán otro proyecto); no las propongas aquí. Al escribir o ajustar copy, mantén el
tono "Evidence over adjectives": concreto, verificable, sin marketing vacío.
