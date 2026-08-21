# Mapa de Figma — dvprod7 V3

**File key:** `GM6xY3UmOdg6OVEWR7HXYR`
**Página:** `699:10` — nombre `V3`
**URL:** https://www.figma.com/design/GM6xY3UmOdg6OVEWR7HXYR/Portafolio-UI---dvprod7?node-id=699-10

## Frames vivos (los únicos tres que importan)

| Node ID | Nombre | Tamaño |
|---|---|---|
| `702:10` | dvprod7 — Single Page (V3 build) | 1440 × 3803 |
| `726:10` | dvprod7 — Mobile (V3 build) | 440 × 3852 |
| `730:10` | dvprod7 — Mobile — menu open | 440 × 900 |

⚠️ Existe un frame `753:796` llamado **"OLD"** (13409 × 7783, `hidden="true"`) que contiene
toda la exploración V1/V2: "CREATIVE DEVELOPER", landing pages alternas, el design system viejo,
carruseles de skills con iconos. **Está oculto y es basura histórica — ignóralo por completo.**
También hay una página anterior (`0:1`, "V1") con el design system muerto: misma regla.

## Cómo consultar

```
get_metadata(fileKey, nodeId)        → estructura y medidas (barato)
get_design_context(fileKey, nodeId)  → colores/tipografía/spacing reales (caro, es el bueno)
get_screenshot(fileKey, nodeId)      → verificación visual
```

Antes de `get_design_context` hay que cargar la guía `figma-design-to-code`
(`read_skill_uri("skill://figma/figma-design-to-code/SKILL.md")` si no está el skill instalado)
y pasar `skillNames: "resource:figma-design-to-code"`.

Consulta **siempre el par desktop + mobile** de la sección antes de escribir SCSS.

---

## Inventario de secciones

Orden en la página. Alturas del frame desktop.

### 1. Nav — `702:11` (desktop, 1440×90) · `726:11` (mobile, 440×80) · `730:10` (menú abierto)

- Desktop: logo a la izquierda (`</dvprod7>` en caja con borde amarillo 2px, radio 8),
  4 links centrados con gap 30px (`/ ABOUT`, `/ SKILLS`, `/ PROJECTS`, `/ CONTACT`),
  y switch `ESP / ENG` en naranja a la derecha.
- Mobile: logo + botón hamburguesa (26×19) en `726:14`. **No hay switch de idioma en mobile.**
- Menú abierto (`730:10`): overlay `frosted` a pantalla completa, logo arriba-izquierda,
  `✕` arriba-derecha, 4 links en columna (gap 58px) alineados a la izquierda a partir de y=210,
  social pills abajo (y=740) y `dvprod7 © 2026` centrado al pie.
- El overlay cubre el hero, que sigue visible detrás desenfocado.

### 2. Hero — `702:12` (1440×780) · `726:18` (440×428)

- Decoración `bg-hex` (`725:10`).
- Eyebrow `/ Hi, I'm Daniel Valenzuela` en amarillo, 20px/600/+1px tracking.
- Título: **dos líneas en desktop** ("WEB" / "DEVELOPER", 150px, `line-height: .95`,
  `letter-spacing: -2px`) y **una sola caja de texto que envuelve en mobile** (`726:21`).
- Lead: "I build reliable websites and web apps — from front-end interfaces to CMS-driven
  backends." — 22px desktop, ancho fijo 700px.
- CTA: `btn-View Projects` (relleno naranja) + `btn-Hire me 😎` (outline amarillo sobre
  `#0D160B`). Gap 16px.
- Socials: 3 pills circulares de 44px amarillas con texto (`@`, `GH`, `in`), gap 12px.
  → En código deben ser **iconos SVG del sprite**, no letras; en Figma son placeholders.

### 3. About — `702:13` (1440×820) · `728:10` (440×946)

- Columna izquierda `705:10` (700px): eyebrow `/ ABOUT`, título "I like to code 💻",
  párrafo largo, `pillars`, botón `Download CV`.
- **`pillars` (`705:16`)**: 3 columnas iguales, gap 24px, cada una con **borde superior
  amarillo de 2px** y padding-top 16px. Título 16px/600 amarillo + descripción 14px/1.5.
  Los tres: "Production experience", "Front-end + CMS", "Judgment with AI".
  En mobile (`728:14`) van apiladas.
- Derecha: `705:14` (360×440, radio 14, borde fino de acento) — contiene la foto real
  `753:797` (`profile-img-dv 1`). El bitmap es 382×487 con offset `-11, -23.5`: **sobresale y lo
  recorta el frame**, así que en código es `object-fit: cover` sobre una caja de 360×440, no una
  imagen a tamaño exacto.
  En mobile (`728:29`) la misma foto va debajo, 392×357 — **otro aspect ratio**, así que el
  encuadre cambia: verifica que el recorte no corte la cara.
  - El frame conserva el nombre `photo-placeholder` aunque ya no lo sea. Ignora el nombre.
  - **El borde y el radio van en CSS, no horneados en el archivo de imagen.**
  - Export sugerido: WebP (o AVIF) a 2x → 720×880 desktop, con `<img>` responsive
    (`srcset` + `sizes`) para que mobile no descargue el tamaño de desktop.

### 4. Skills — `702:14` (1440×511) · `728:31` (440×876)

- Decoración `bg-hex` (`725:11`).
- Eyebrow `/ SKILLS` + título "What I work with".
- `skill-groups` (`715:10`): **4 columnas de 264px, gap 28px**. Cada `skill-col`:
  regla superior de 2px (`rgba(236,235,243,.16)`), título 17px/600 amarillo,
  y una lista de ítems 15px al 85% con gap 9px.
- Columnas: **Core / Frontend** · **CMS & Frameworks** · **Workflow & Tooling** ·
  **Also familiar with**.
- Mobile: las 4 columnas apiladas a ancho completo (`728:34`, `728:43`, `728:52`, `728:61`).
- **Es texto plano. No hay iconos, no hay carrusel, no hay tarjetas.**

### 5. Projects — `702:15` (1440×974) · `729:10` (440×1081)

Dos sub-bloques con la misma tarjeta:

- **Selected work** — `716:13`, grid de 2 columnas de 556px, gap 28px.
  Tarjetas: `716:14` ("Enterprise SaaS website — performance") y `716:24`
  ("dvprod7 — this portfolio").
- **/ BUILDING NOW** — `717:13`, mismo grid. Tarjetas `717:14`
  ("Meta Conversions API — WP plugin") y `717:24` ("Custom ecommerce — React").
  Estas llevan un chip extra "Building now".

Anatomía de la tarjeta (`716:14`): fondo `#1F1F1F`, borde hairline, radio 14, padding 30,
gap interno 14. Contiene: fila de `chip`s → título 22px/700 → descripción 15px al 72%.

**Un solo componente de tarjeta sirve para los dos bloques** — la diferencia es sólo el chip
de estado y el contenido.

- Subtítulo del bloque: "Real work and real decisions — not demos. Evidence over adjectives."
- **No hay imágenes de proyecto en V3** (la V1 sí las tenía). Son tarjetas de puro texto.
- **No hay página de detalle de proyecto en V3.** El `Project Detail` que existe en la página
  vieja no se porta.

### 6. Contact + footer — `702:16` (1440×628) · `729:55` (440×441)

- Decoración `bg-hex` (`725:12`).
- Eyebrow `/ CONTACT`, título "Ready to start?", párrafo.
- `cta-row` (`718:14`): botón `Say hello` (amarillo relleno) + 3 pills outline
  (`Email`, `GitHub`, `LinkedIn`, radio full, 40px de alto).
- Divisor de 1px a lo ancho del contenido.
- Footer: `</dvprod7> — Daniel Valenzuela` a la izquierda,
  `Bogotá, Colombia · Available for remote work` a la derecha. En mobile van apilados.
- **No hay formulario de contacto en V3.** La V1 lo tenía (name/email/message/send); se
  reemplazó por botones directos. No lo reintroduzcas sin pedirlo.

---

## Cosas que el diseño pide y todavía no existen en ningún lado

- ~~Foto real de perfil~~ ✅ resuelta en Figma el 2026-08-20 (`753:797`). Falta **exportarla**
  al repo (`public/images/`). La del legado, `src/assets/images/profile-img-dv.jpg`, es otro
  encuadre y no se reutiliza.
- Iconos reales para las social pills (en Figma son las letras `@`, `GH`, `in`).
- ~~El PDF del CV~~ ✅ En el repo desde 2026-08-20:
  `public/DanielValenzuela_FrontEndDeveloper_CV_EN_2025.pdf` (96 KB).
  ⚠️ **Todavía no se sirve**: `angular.json` no incluye `public/` en `assets`. El enlace
  `Download CV` dará 404 hasta que la Fase 0 arregle esa config.
- URLs reales para `View Projects`, `View Project` / repos de cada tarjeta.
- Traducción ES del copy (el switch `ESP / ENG` está diseñado pero sin contenido).

## Nomenclatura

Existe `src/assets/FIGMA_NAMING_CONVENTION.md` (patrón `tipo-contexto-función-estado`, escrito
en feb-2026). **El archivo V3 NO lo sigue** — usa nombres cortos y semánticos (`card`, `chip`,
`skill-col`, `pillar`, `btn-Say hello`). No intentes reconciliarlos: para código manda la
convención de Angular + BEM de `architecture.md`. Ese `.md` además **no debe seguir viviendo en
`src/assets/`**, porque se publica con el sitio.
