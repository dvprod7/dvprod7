# Design tokens — dvprod7 V3

Extraídos de Figma `GM6xY3UmOdg6OVEWR7HXYR`, página **V3**, el 2026-08-20.
Verificados contra `get_design_context` y muestreo de píxel del render real.

> El archivo de Figma **casi no tiene variables definidas** (solo `Jet`). Todo lo demás está
> como hex crudo en las capas. Por eso el **código es la fuente de verdad de tokens**, y Figma
> es la fuente de verdad *visual*. Si algún día se sincronizan, la dirección correcta es
> código → Figma variables, no al revés.

## Arquitectura de tokens (2 niveles)

Custom properties de CSS, no variables SCSS. Razón: inspeccionables en devtools, sirven para
theming en runtime, y se pueden exportar a formato DTCG (W3C Design Tokens) si algún día
quieres generarlas desde Figma.

```
--dv-<primitivo>          →  valor crudo, sin significado    (--dv-yellow-400)
--dv-color-<semántico>    →  rol en la UI                    (--dv-color-accent)
```

**Los componentes SOLO consumen tokens semánticos.** Nunca un primitivo directo.
SCSS se usa únicamente para anidamiento, mixins y bucles de build-time.

---

## 1. Color

### Primitivos

| Token | Valor | Nota |
|---|---|---|
| `--dv-yellow-400` | `#FAFF70` | Acento principal. **Ojo: NO es el `$bolt: #f5f749` del legado.** |
| `--dv-orange-500` | `#DD6031` | CTA primario. Único color que sobrevive intacto del legado (`$Flame`). |
| `--dv-grey-800` | `#333333` | Fondo de página. Es la variable `Jet` de Figma. |
| `--dv-grey-900` | `#1F1F1F` | Superficie de tarjeta (**más oscura que el fondo**). |
| `--dv-black-950` | `#0D160B` | Negro verdoso. Fondo de botón outline y texto sobre amarillo. |
| `--dv-white-50` | `#ECEBF3` | Texto base. |

### Semánticos

| Token | Valor | Uso |
|---|---|---|
| `--dv-color-bg` | `var(--dv-grey-800)` | Fondo de página y de todas las secciones |
| `--dv-color-surface-sunken` | `var(--dv-grey-900)` | Tarjetas de proyecto y roadmap |
| `--dv-color-surface-inverse` | `var(--dv-black-950)` | Botón outline, chip sobre amarillo |
| `--dv-color-accent` | `var(--dv-yellow-400)` | Títulos, eyebrows, bordes de chip, social pills |
| `--dv-color-accent-contrast` | `var(--dv-black-950)` | Texto sobre `--dv-color-accent` |
| `--dv-color-cta` | `var(--dv-orange-500)` | Botón primario, switch de idioma |
| `--dv-color-cta-contrast` | `#FFFFFF` | Texto sobre `--dv-color-cta` |
| `--dv-color-text` | `var(--dv-white-50)` | Cuerpo, títulos de tarjeta |
| `--dv-color-text-strong` | `rgb(236 235 243 / 0.85)` | Ítems de lista en Skills |
| `--dv-color-text-muted` | `rgb(236 235 243 / 0.72)` | Descripción de tarjeta, footer |
| `--dv-color-border` | `rgb(236 235 243 / 0.14)` | Borde de tarjeta |
| `--dv-color-rule` | `rgb(236 235 243 / 0.16)` | Regla superior de columna de Skills, divisores |
| `--dv-color-border-accent` | `rgb(250 255 112 / 0.55)` | Borde de chip / tag |

> **Rampa de alfa del texto:** `1 → .85 → .72`, y de líneas: `.16 → .14`.
> Cualquier opacidad nueva debe caer en esa rampa, no inventar una.

### Contraste (revisar al implementar)
`--dv-color-text-muted` (#ECEBF3 al 72%) sobre `--dv-color-surface-sunken` (#1F1F1F) queda
cerca del límite AA para texto de 15px. Verificar con la herramienta antes de dar por cerrada
la sección Projects; si falla, subir a `.80` y actualizar el token, no el componente.

---

## 2. Tipografía

**Inter** reemplaza por completo a Manrope + Roboto Condensed. **No hay itálicas en V3** —
el legado usaba `font-style: italic` en todos los headings; eso desaparece.

Pesos usados: `400` Regular · `600` SemiBold · `700` Bold · `800` ExtraBold.

Recomendación de implementación: **una sola variable font** (`Inter-Variable.woff2`, subset
latin) auto-hospedada, `font-display: swap`, con `<link rel="preload">`. Reemplaza los 4
archivos woff2 del legado.

### Escala (desktop → mobile, fluida con `clamp()`)

| Token | Desktop | Mobile | Peso | Uso |
|---|---|---|---|---|
| `--dv-text-display` | 150px / 0.95 / -2px | ~48px / 1.0 | 800 | "WEB DEVELOPER" |
| `--dv-text-h2` | 44px | 34px | 700 | "I like to code", "Selected work", "Ready to start?" |
| `--dv-text-h3` | 22px | 20px | 700 | Título de tarjeta |
| `--dv-text-lead` | 22px / 1.5 | 16px / 1.5 | 400 | Párrafo bajo el hero |
| `--dv-text-eyebrow` | 20px / +1px tracking | 15px | 600 | "/ Hi, I'm Daniel Valenzuela" |
| `--dv-text-label` | 17px | 15px | 600 | Título de columna de Skills, título de pillar (16px) |
| `--dv-text-body` | 15px | 14px | 400 | Ítems de lista, descripción de tarjeta |
| `--dv-text-nav` | 15px / +0.5px tracking | — | 600 | Links del navbar |
| `--dv-text-btn` | 17px | 16px | 600 | Texto de botón |
| `--dv-text-chip` | 12px | 12px | 600 | Tags |
| `--dv-text-meta` | 14px | 13px | 400/600 | Footer, switch de idioma |

`line-height`: `normal` en headings y UI; `1.5` en párrafos largos; `0.95` solo en el display.

---

## 3. Espaciado

Escala base **4px**. Los valores que realmente aparecen en el diseño:

`4 · 8 · 9 · 12 · 14 · 16 · 24 · 26 · 30 · 44 · 58` (px)

| Token | Valor | Uso |
|---|---|---|
| `--dv-space-2` | 8px | gap entre chips |
| `--dv-space-3` | 12px | gap entre social pills |
| `--dv-space-4` | 14px | gap interno de tarjeta / columna de skills |
| `--dv-space-4-5` | 16px | gap entre botones del CTA, padding-top de pillar |
| `--dv-space-6` | 24px | gap entre pillars; **padding lateral mobile** |
| `--dv-space-6-5` | 26px | gap vertical entre bloques del hero |
| `--dv-space-7` | 30px | padding interno de tarjeta; gap entre links del navbar |
| `--dv-space-11` | 44px | alto/ancho de social pill |

### Layout / gutters

| Token | Desktop | Mobile |
|---|---|---|
| `--dv-gutter` | `150px` | `24px` |
| `--dv-content-max` | `1140px` | `392px` |
| `--dv-nav-height` | `90px` | `80px` |

> Desktop: frame de 1440 con 150px a cada lado → contenido de **1140px**.
> Mobile: frame de 440 con 24px a cada lado → contenido de **392px**.
> Grid de proyectos: 2 columnas de 556px con gap de 28px (= 1140).
> Grid de skills: 4 columnas de 264px con gap de 28px (= 1140).

---

## 4. Radios

| Token | Valor | Uso |
|---|---|---|
| `--dv-radius-sm` | `8px` | Botones, logo |
| `--dv-radius-md` | `14px` | Tarjetas |
| `--dv-radius-full` | `999px` | Chips (100px en Figma), social pills |

## 5. Bordes

| Token | Valor | Uso |
|---|---|---|
| `--dv-border-hairline` | `1px solid var(--dv-color-border)` | Tarjeta |
| `--dv-border-chip` | `1px solid var(--dv-color-border-accent)` | Chip |
| `--dv-border-btn` | `1.5px solid var(--dv-color-accent)` | Botón outline |
| `--dv-border-logo` | `2px solid var(--dv-color-accent)` | Logo |
| `--dv-rule-top` | `2px solid var(--dv-color-accent)` | Regla superior del pillar (About) |
| `--dv-rule` | `2px` de `--dv-color-rule` | Regla superior de columna (Skills) |

## 6. Breakpoints

El diseño solo define **dos** anchos: `440` (mobile) y `1440` (desktop). Todo lo intermedio
se resuelve con `clamp()` y layouts fluidos, no con más breakpoints.

Mantener del legado solo estos, y solo como puntos de reflow estructural:

```
sm  480px   md  768px   lg  1024px   xl  1366px
```

Regla: si un cambio se puede resolver con `clamp()` o `minmax()`, **no** se le pone media query.

---

## 7. Decoración: `bg-hex`

Las secciones Hero, Skills y Contact llevan un SVG decorativo grande (`bg-hex`, ~1942×2022)
rotado y posicionado fuera del flujo, muy tenue, sangrando por los bordes.

- Es **puramente decorativo** → `aria-hidden="true"`, `pointer-events: none`.
- Va posicionado absoluto dentro de una sección con `position: relative; overflow: clip`.
- Debe ir en el sprite/assets, no inline en el template.
- Node IDs: Hero `725:10`, Skills `725:11`, Contact `725:12` (los tres son el mismo asset con
  distinta rotación y offset).

---

## Divergencias conocidas legado → V3

Guárdalas presentes: son la causa más probable de un error silencioso al copiar código viejo.

| Concepto | Legado | V3 |
|---|---|---|
| Amarillo | `#F5F749` | **`#FAFF70`** |
| Tipografía | Manrope + Roboto Condensed, itálicas | **Inter, sin itálicas** |
| Superficie de tarjeta | `$bolt` (amarillo sólido) | **`#1F1F1F` hundida con borde hairline** |
| Layout de página | Scroll-snap fullscreen, `overflow:hidden` | **Scroll normal, página larga** |
| Grid | Clon de Bootstrap de 12 columnas | **CSS Grid nativo** |
| Skills | Carrusel de tarjetas con iconos SVG | **4 columnas de texto plano** |
| Variables | SCSS (`$bolt`) | **CSS custom properties (`--dv-color-accent`)** |
