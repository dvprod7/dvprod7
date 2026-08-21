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

Al cerrar un bloque: **di qué archivos cambiaron y por qué, y para ahí.** Puedes ofrecer un
mensaje de commit *como texto para copiar*, nunca ejecutarlo.

## Estado actual

> **Última revisión: 2026-08-20 · Fase actual: 0 (Higiene) — no iniciada.**
> Las fases están descritas en `references/architecture.md`.

**Esta tabla puede estar desactualizada. Verifícala contra el repo antes de confiar en ella**
(protocolo abajo). Cada fila trae cómo comprobarla en 5 segundos.

| Área | Estado | Cómo verificar |
|---|---|---|
| Diseño V3 en Figma | ✅ Completo (desktop + mobile + menú abierto) | `get_screenshot` de `702:10` |
| Fase 0 — Higiene | ⬜ No iniciada | ¿existe `.nvmrc`? ¿hay ESLint en `package.json`? |
| Fase 1 — Tokens y fundación | ⬜ No iniciada | ¿existe `src/app/styles/_tokens.scss`? |
| Fase 2 — Shell | ⬜ No iniciada | ¿sigue el `overflow: hidden` en `styles.scss`? |
| Fase 3 — Primitivas UI | ⬜ No iniciada | ¿existe `src/app/ui/`? |
| Fase 4 — Secciones | ⬜ No iniciada | `ls src/app/sections/` |
| Fase 5 — Contenido y SEO | ⬜ No iniciada | ¿`index.html` tiene `meta description`? |
| Código legado | 🔴 Intacto, ~90% pendiente de borrar | `ls src/app/components/` |
| Contenido real (copy) | ✅ Escrito en Figma, sin lorem ipsum | — |
| Foto de perfil V3 | 🟡 Lista en Figma (`753:797`), falta exportar al repo | `ls public/images/` |
| PDF del CV | 🟡 En `public/`, pero `public/` aún no se sirve (lo arregla la Fase 0) | `ls public/*.pdf` |

Leyenda: ⬜ no iniciada · 🟡 en curso · ✅ terminada · 🔴 problema conocido

### Protocolo de orientación (al empezar cualquier sesión de construcción)

```bash
ls src/app/styles/ src/app/ui/ src/app/sections/ src/app/components/ 2>&1 | head -40
```

**El código es la fuente de verdad del progreso, no esta tabla.** Si existe
`src/app/sections/hero/`, el Hero está hecho, diga lo que diga aquí — y si hay discrepancia,
corrígela en este archivo antes de seguir, no la reportes y sigas de largo.

Lo que el repo **no** puede contarte —por qué algo quedó a medias, qué se revirtió, qué está
bloqueado— vive en la **Bitácora** al final.

## Requisito de entorno

El `node` por defecto es **v22.11.0 y el CLI de Angular lo rechaza** (pide ≥ v22.12). Antes de
cualquier `ng` / `npm run` — en el mismo comando, el shell no persiste entre llamadas:

```bash
export PATH="/Users/danval2/.nvm/versions/node/v22.23.2/bin:$PATH"
```

Arreglo de raíz (Fase 0): `.nvmrc` con `22.23.2` + `engines.node` en `package.json`.

## Referencias (léelas cuando apliquen)

| Archivo | Cuándo leerlo |
|---|---|
| `references/design-tokens.md` | Siempre que escribas SCSS, elijas un color, tamaño, radio o espaciado |
| `references/figma-map.md` | Antes de construir cualquier sección: node IDs, medidas, estructura desktop/mobile |
| `references/architecture.md` | Antes de crear archivos, decidir estructura de carpetas o patrones de Angular |
| `references/audit-legacy.md` | Antes de borrar o modificar algo del código existente |

## Flujo para construir una sección

1. Lee la sección en `references/figma-map.md` (node ID desktop + node ID mobile).
2. Llama `get_design_context` con **ambos** node IDs (desktop y mobile) — el diseño solo tiene
   dos breakpoints diseñados, todo lo intermedio se interpola con `clamp()`.
3. Traduce el output React+Tailwind a **Angular + SCSS con tokens**. Nunca instales Tailwind.
4. Mapea cada valor crudo (hex, px) a su token en `references/design-tokens.md`.
   Si un valor no tiene token, **propón el token primero**, no lo hardcodees.
5. Mobile-first: escribe el estilo mobile y sube con el mixin `up()`.
6. Verifica en navegador (`ng serve` + browser tools) contra el screenshot de Figma.

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

Una skill que miente es peor que no tener skill. Estas son las reglas para que no se pudra.

**Checkpoint de cierre de fase (obligatorio, sin pedir permiso).** Al terminar una fase, antes
de darla por cerrada: marca la fase ✅ en la tabla, mueve "Fase actual", actualiza la fecha,
añade entrada a la Bitácora si hubo algo no obvio, y arregla la referencia que haya quedado
desfasada. Es parte de terminar, como compilar.

**Disparadores de actualización:**

- **Dany tocó Figma** → relee los nodos afectados y actualiza `design-tokens.md` / `figma-map.md`
  **antes** de tocar código. Si ajustas el código primero, el token queda documentado con el
  valor viejo y la referencia empieza a mentir.
- **Decisión de arquitectura tomada o revertida** → `architecture.md`, con fecha y el porqué.
- **Se borró código legado** → tacha la entrada en `audit-legacy.md`. Ese archivo se encoge solo;
  al terminar la Fase 2 será casi todo histórico y se puede archivar.
- **Dany dio una instrucción nueva de cómo trabajar** → va al `SKILL.md`, no a un comentario en
  el código.

**Estado volátil nunca va en las referencias.** `design-tokens.md` dice cuál es el token, no
quién lo usa. Mezclarlos obliga a releer archivos largos para saber algo que responde un `ls`.

**Higiene.** El `SKILL.md` se paga en contexto cada vez que la skill se activa: **techo de 180
líneas** (hoy está justo ahí). Si algo tiene que entrar, algo tiene que salir — muda a
`references/` o borra. Si una regla no aplicó en varias fases, bórrala.
Si explicas lo mismo en chat dos veces, esa explicación va a la skill.

---

## Bitácora

Solo lo que el código **no** puede contar por sí solo: decisiones tomadas sobre la marcha, cosas
aplazadas a propósito, callejones sin salida ya explorados. Si se deduce con un `ls` o un
`git log`, no va aquí. Entradas cortas, con fecha, más reciente arriba.

**Máximo 5 entradas.** Al añadir la sexta, borra la más vieja — si algo de ahí sigue importando,
ya debería ser una regla o una decisión cerrada, no una nota histórica.

- **2026-08-20** — Auditoría inicial y creación de esta skill. Sin cambios en código de la app.
  Decisiones cerradas: reset del layer de presentación en el mismo repo (no repo nuevo);
  SCSS + custom properties, **Tailwind descartado**; prerender estático confirmado; i18n con
  estructura desde el día uno pero solo `en` en v1; hosting pendiente.
  Pendientes de Dany: foto de perfil V3 y PDF del CV.

## Contexto de negocio (por qué el rediseño)

La V1 era un portafolio genérico "Creative Developer" con lorem ipsum. La V3 es una
**pieza comercial**: narrativa de web developer full-stack-ish (front-end + CMS), prueba con
evidencia en vez de adjetivos ("Evidence over adjectives"), experiencia real en un equipo SaaS
de US, y una sección "BUILDING NOW" que muestra momentum. Al escribir o ajustar copy, mantén
ese tono: concreto, verificable, sin marketing vacío.
