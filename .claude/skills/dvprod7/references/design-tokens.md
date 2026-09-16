# Design tokens — dvprod7 V3

Extraídos de Figma `GM6xY3UmOdg6OVEWR7HXYR`, página **V3**, el 2026-08-20. Reconciliados con
`get_design_context` (desktop + mobile + menú) y con las decisiones de Dany el **2026-09-16**.

> El archivo de Figma **casi no tiene variables definidas** (solo `Jet`). Todo lo demás está
> como hex crudo en las capas. Por eso el **código es la fuente de verdad de tokens**, y Figma
> es la fuente de verdad *visual*. Si algún día se sincronizan, la dirección correcta es
> código → Figma variables, no al revés.

## Reglas de reconciliación (2026-09-16)

Figma tiene deriva entre desktop y mobile. Al leer un valor de Figma, aplica estas reglas en
vez de crear un token nuevo:

1. **Desktop manda; mobile solo cambia tamaños.** Colores, radios, bordes, pesos y variantes
   de botón de mobile que difieran de desktop son deriva → se usa el de desktop. No hay tokens
   por variante mobile.
2. **Espaciado suelto → paso más cercano** de la escala (§3). En empate, el paso menor.
3. **Alfa suelta → paso más cercano** de la rampa (§1).
4. Solo se crea un token nuevo si ninguna regla lo resuelve — y se propone antes.

## Arquitectura de tokens (2 niveles)

Custom properties de CSS, no variables SCSS. Razón: inspeccionables en devtools, sirven para
theming en runtime, y se pueden exportar a formato DTCG (W3C Design Tokens) si algún día
quieres generarlas desde Figma.

```
--dv-<primitivo>          →  valor crudo, sin significado    (--dv-yellow-400)
--dv-color-<semántico>    →  rol en la UI                    (--dv-color-accent)
```

**Los componentes SOLO consumen tokens semánticos.** Nunca un primitivo directo.
SCSS se usa únicamente para anidamiento, mixins y bucles de build-time (y breakpoints, que
no pueden ser custom properties dentro de `@media`).

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
| `--dv-color-accent-contrast` | `var(--dv-black-950)` | Texto sobre `--dv-color-accent` (también en mobile; el `#333` de Figma es deriva) |
| `--dv-color-cta` | `var(--dv-orange-500)` | Botón primario, switch de idioma, eyebrow "BUILDING NOW" |
| `--dv-color-cta-contrast` | `#FFFFFF` | Texto sobre `--dv-color-cta` |
| `--dv-color-text` | `var(--dv-white-50)` | Títulos, lead, párrafo de About, títulos de tarjeta |
| `--dv-color-text-strong` | `rgb(236 235 243 / 0.85)` | Ítems de Skills, texto de pills de Contact |
| `--dv-color-text-muted` | `rgb(236 235 243 / 0.75)` | Subtítulos de sección, descripción de tarjeta |
| `--dv-color-text-subtle` | `rgb(236 235 243 / 0.6)` | Footer (ubicación), pie del menú |
| `--dv-color-border-strong` | `rgb(236 235 243 / 0.3)` | Borde de pill de Contact |
| `--dv-color-rule` | `rgb(236 235 243 / 0.16)` | Regla superior de columna de Skills |
| `--dv-color-border` | `rgb(236 235 243 / 0.14)` | Borde de tarjeta, divisor del footer |
| `--dv-color-border-accent` | `rgb(250 255 112 / 0.55)` | Borde de chip / tag |
| `--dv-color-border-cta` | `rgb(221 96 49 / 0.55)` | Borde de chip "Building now" (misma alfa que `border-accent`) |
| `--dv-color-border-cta-subtle` | `rgb(221 96 49 / 0.35)` | Borde de tarjeta "Building now" |

> **Rampa de alfa (cerrada):** texto `1 · .85 · .75 · .6`; líneas `.3 · .16 · .14`;
> bordes de chip `.55` (amarillo y naranja); borde de tarjeta naranja `.35`. Cualquier
> opacidad nueva cae en esa rampa, no se inventa.
> Mapeo aplicado: `.9 → .85`, `.8 / .78 / .72 / .7 → .75`, `.35 → .3` (líneas),
> tarjeta naranja `.22 → .35`. El `#2A2A2A` del fondo de la foto mobile es deriva y no existe.

### Contraste (verificado 2026-09-16, WCAG 2.x)

Texto `#ECEBF3` compuesto con su alfa sobre cada fondo:

| Alfa | sobre `#333333` | sobre `#1F1F1F` |
|---|---|---|
| 1 | 10.68 | 13.93 |
| .85 | 8.20 | 10.38 |
| .75 | 6.77 | 8.36 |
| .6 | 4.94 | 5.85 |

Todas ≥ 4.5:1.

### ⚠️ Decisión pendiente — contraste del naranja (resolver ANTES de la Fase 3)

El naranja no llega a AA para texto normal. **Ningún token cambia hasta que Dany decida.**
Se resuelve en el token, nunca en el componente.

| Caso | Hoy | Ratio | Estado |
|---|---|---|---|
| Texto de botón sobre `--dv-color-cta` | `#FFFFFF` sobre `#DD6031` | **3.63** | Falla AA (17px/600 no es "large") |
| Candidato para el botón | `#0D160B` sobre `#DD6031` | **5.10** | Pasa AA → reemplazaría a `--dv-color-cta-contrast` |
| Texto naranja sobre el fondo (switch ESP/ENG, "/ BUILDING NOW") | `#DD6031` sobre `#333333` | **3.48** | Falla AA a esos tamaños (14–17px) |

Opciones para el texto naranja: (a) un naranja más claro **solo para texto**
(`--dv-color-cta-text`), dejando `#DD6031` para rellenos y bordes; o (b) cambiar el color de
esos textos a otro token que ya pase.

---

## 2. Tipografía

**Inter** reemplaza por completo a Manrope + Roboto Condensed. **No hay itálicas en V3** —
el legado usaba `font-style: italic` en todos los headings; eso desaparece.

Pesos usados: `400` Regular · `600` SemiBold · `700` Bold · `800` ExtraBold.

### Archivo de fuente

Una sola variable font, **subset propio**, auto-hospedada en `public/fonts/`, con
`font-display: swap` y `<link rel="preload">`. El `@font-face` va **una sola vez** en
`styles.scss`. Licencia OFL junto al archivo.

- Fuente: release oficial **rsms/inter v4.1** (`Inter-4.1.zip`, 2024-11-16), archivo
  `InterVariable.ttf`. Ejes: `opsz 14–32`, `wght 100–900`.
- Se fija `opsz=14` (equivale a "Inter" en Figma; "Inter Display" sería 32) y se recorta
  `wght` a `400:800`.
- Subset = rango `latin` de Fontsource **+ `U+2192`** (`→`, chip "Design → Deploy"; el
  latin estándar trae 2191 y 2193 pero no 2192).
- `✕` y los iconos van en el sprite, no en la fuente. Los emojis (😎 💻) caen a la fuente de
  emoji del sistema: la pila de respaldo debe incluirla.

Comando exacto (desde la raíz del repo, `fonttools` y `brotli` en un venv fuera del repo):

```bash
python3 -m venv /tmp/fontvenv && /tmp/fontvenv/bin/pip install fonttools brotli
curl -sLO https://github.com/rsms/inter/releases/download/v4.1/Inter-4.1.zip
unzip -o Inter-4.1.zip InterVariable.ttf LICENSE.txt -d /tmp/inter

/tmp/fontvenv/bin/fonttools varLib.instancer /tmp/inter/InterVariable.ttf \
  wght=400:800 opsz=14 -o /tmp/inter/Inter-wght.ttf

/tmp/fontvenv/bin/pyftsubset /tmp/inter/Inter-wght.ttf \
  --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191-2193,U+2212,U+2215,U+FEFF,U+FFFD" \
  --layout-features='*' \
  --flavor=woff2 \
  --output-file=public/fonts/inter-latin-wght.woff2

cp /tmp/inter/LICENSE.txt public/fonts/Inter-OFL.txt
```

Si se actualiza la versión de Inter, se cambia aquí primero y se regenera.

### Escala (desktop 1440 → mobile 440, fluida con `clamp()`)

| Token | Desktop | Mobile | Peso | Uso |
|---|---|---|---|---|
| `--dv-text-display` | 150px | 60px | 800 | "WEB DEVELOPER" |
| `--dv-text-h2-lg` | 56px | 40px | 800 | "Ready to start?" (título de Contact) |
| `--dv-text-h2` | 46px | 34px | 800 | "I like to code", "What I work with", "Selected work" |
| `--dv-text-menu` | — | 30px | 800 | Links del menú mobile abierto |
| `--dv-text-h3` | 22px | 19px | 700 | Título de tarjeta (las 4; el 20px de "Building now" es deriva) |
| `--dv-text-lead` | 22px | 16px | 400 | Párrafo bajo el hero |
| `--dv-text-logo` | 20px | 18px | 700 | `</dvprod7>` (el 800 de mobile es deriva) |
| `--dv-text-body-lg` | 18px | 16px | 400 | Párrafo de About, subtítulos de sección |
| `--dv-text-eyebrow` | 18px | 16px | 600 | `/ ABOUT`, `/ Hi, I'm Daniel Valenzuela` (el hero también) |
| `--dv-text-label` | 17px | 16px | 600 | Título de columna de Skills, título de pillar, "/ BUILDING NOW" |
| `--dv-text-btn` | 17px | 15px | 600 | Botón principal (hero) |
| `--dv-text-btn-sm` | 16px | 15px | 600 | Botón secundario (Download CV, Say hello) |
| `--dv-text-body` | 15px | 14px | 400/600 | Ítems de lista, descripción de tarjeta, pills de Contact (600), marca del footer (600) |
| `--dv-text-nav` | 15px | — | 600 | Links del navbar |
| `--dv-text-small` | 14px | 13px | 400/600 | Descripción de pillar, footer, switch de idioma (600) |
| `--dv-text-chip` | 12px | 12px | 600 | Tags |

Interpolación: `clamp(mobile, calc(b + m·100vw), desktop)` con
`m = (desktop − mobile) / 1000` y `b = mobile − m·440px`. Se calcula en `_tokens.scss`
(función SCSS en build), no a mano en cada componente.

### Tracking y line-height

| Token | Valor | Uso |
|---|---|---|
| `--dv-tracking-display` | `-0.0133em` | Display (= −2px a 150px) |
| `--dv-tracking-eyebrow` | `1px` | **Todos** los eyebrows, en todos los breakpoints |
| `--dv-tracking-nav` | `0.5px` | Links del navbar |
| `--dv-leading-display` | `0.95` | Solo el display |
| `--dv-leading-normal` | `normal` | Headings y UI (incluye h2; el 1.1 de About es deriva) |
| `--dv-leading-body` | `1.5` | Lead, descripción de pillar |
| `--dv-leading-prose` | `1.6` | Párrafo de About |

---

## 3. Espaciado

Nombres **por valor en px**. Escala cerrada:

`4 · 8 · 12 · 14 · 16 · 20 · 24 · 28 · 30 · 44`

| Token | Valor | Uso |
|---|---|---|
| `--dv-space-4` | 4px | padding vertical de chip, gap de barras del hamburguesa |
| `--dv-space-8` | 8px | gap entre chips, gap interno de pillar, gap de ítems de Skills |
| `--dv-space-12` | 12px | gap entre social pills, padding lateral de chip, padding vertical de pill |
| `--dv-space-14` | 14px | gap interno de tarjeta / columna de Skills, gap de la fila CTA de Contact |
| `--dv-space-16` | 16px | gap entre botones del CTA, padding-top de pillar, padding vertical de botón |
| `--dv-space-20` | 20px | gap de bloques en mobile, padding lateral de pill, gap del about-col |
| `--dv-space-24` | 24px | gap entre pillars, gap vertical del hero, **gutter mobile** |
| `--dv-space-28` | 28px | gap de los grids de Skills y Projects |
| `--dv-space-30` | 30px | padding de tarjeta, padding lateral de botón, gap del navbar, gap de cabecera de sección |
| `--dv-space-44` | 44px | alto/ancho de social pill |

Mapeo de valores sueltos de Figma (paso más cercano, empate → menor):
`5→4 · 7, 9, 10→8 · 11, 13→12 · 15→16 · 18→16 · 22→20 · 26→24 · 32, 36→30`.

### Layout / gutters (semánticos)

| Token | Desktop | Mobile | Nota |
|---|---|---|---|
| `--dv-gutter` | `150px` | `24px` | |
| `--dv-content-max` | `1140px` | `392px` | |
| `--dv-nav-height` | `90px` | `80px` | |
| `--dv-section-padding-block` | `96px` | `52px` | Todas las secciones (Contact 110/80 y hero mobile 44/60 se normalizan a este) |
| `--dv-about-columns-gap` | `80px` | — | Solo desktop; en mobile las columnas se apilan |

> Desktop: frame de 1440 con 150px a cada lado → contenido de **1140px**.
> Mobile: frame de 440 con 24px a cada lado → contenido de **392px**.
> Grid de proyectos: 2 columnas de 556px con gap de 28px (= 1140).
> Grid de skills: 4 columnas de 264px con gap de 28px (= 1140).

---

## 4. Radios

| Token | Valor | Uso |
|---|---|---|
| `--dv-radius-sm` | `8px` | Botones y logo, **en todos los breakpoints** (el 6px de Figma es deriva) |
| `--dv-radius-md` | `14px` | Tarjetas |
| `--dv-radius-lg` | `16px` | Caja de la foto de perfil |
| `--dv-radius-full` | `999px` | Chips y pills (100px en Figma), social pills, barras del hamburguesa |

## 5. Bordes

| Token | Valor | Uso |
|---|---|---|
| `--dv-border-hairline` | `1px solid var(--dv-color-border)` | Tarjeta, divisor del footer |
| `--dv-border-chip` | `1px solid var(--dv-color-border-accent)` | Chip |
| `--dv-border-chip-cta` | `1px solid var(--dv-color-border-cta)` | Chip "Building now" |
| `--dv-border-card-cta` | `1px solid var(--dv-color-border-cta-subtle)` | Tarjeta "Building now" |
| `--dv-border-pill` | `1px solid var(--dv-color-border-strong)` | Pill de Contact |
| `--dv-border-photo` | `1px solid var(--dv-color-accent)` | Caja de la foto (también en mobile) |
| `--dv-border-btn` | `1.5px solid var(--dv-color-accent)` | Botón outline |
| `--dv-border-logo` | `2px solid var(--dv-color-accent)` | Logo |
| `--dv-rule-top` | `2px solid var(--dv-color-accent)` | Regla superior del pillar (también en mobile) |
| `--dv-rule` | `2px` de `--dv-color-rule` | Regla superior de columna (Skills) |

## 6. Efectos

| Token | Valor | Uso |
|---|---|---|
| `--dv-blur-overlay` | `11px` | `backdrop-filter` del menú mobile abierto |

No hay sombras en V3. La opacidad del fondo `frosted` no sale en `get_design_context`
(devuelve `Jet` sólido): verificarla con screenshot en la Fase 2.

## 7. Breakpoints

El diseño solo define **dos** anchos: `440` (mobile) y `1440` (desktop). Todo lo intermedio
se resuelve con `clamp()` y layouts fluidos, no con más breakpoints.

Viven en `_mixins.scss` (mapa SCSS, no custom properties), solo como puntos de reflow
estructural:

```
sm  480px   md  768px   lg  1024px   xl  1366px
```

El `2xl: 1620px` del legado no entra en V3.

Regla: si un cambio se puede resolver con `clamp()` o `minmax()`, **no** se le pone media query.

---

## 8. Decoración: `bg-hex`

Las secciones Hero, Skills y Contact llevan un SVG decorativo grande (`bg-hex`, ~1942×2022)
rotado y posicionado fuera del flujo, muy tenue, sangrando por los bordes.

- Es **puramente decorativo** → `aria-hidden="true"`, `pointer-events: none`.
- Va posicionado absoluto dentro de una sección con `position: relative; overflow: clip`.
- Debe ir en el sprite/assets, no inline en el template.
- Node IDs en `figma-map.md` (desktop y mobile).

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
| Breakpoints | 5 (con `2xl: 1620px`) | **4** (sm, md, lg, xl) |
