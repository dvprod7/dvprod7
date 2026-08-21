# Arquitectura objetivo — dvprod7 V3

## Decisión de fondo: reset del layer de presentación, mismo repo

No se empieza un repo nuevo. Se conserva la base (git, tooling, Angular 20, esbuild) y se
**borra y reescribe todo lo visual**. Razón: el andamiaje de Angular 20 está bien y es reciente;
lo que está podrido es el design system y los componentes, y eso se borra sin culpa.

## Stack y por qué

| Decisión | Elección | Por qué |
|---|---|---|
| Framework | Angular 20 standalone (ya está) | Es el stack, y el portafolio *demuestra* Angular |
| Change detection | **Zoneless** (`provideZonelessChangeDetection()`) + signals | Quitar `zone.js` baja ~40kB del bundle y es el default moderno; el sitio no tiene async complejo |
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
    app.ts / app.html / app.scss          shell: <app-nav> + <main> con las 5 secciones
    app.config.ts                          providers (zoneless, router opcional)
    core/
      content/                             copy tipado (fuente de verdad del texto)
        site-content.ts                    interfaces + datos EN
        site-content.es.ts                 datos ES (fase posterior)
      models/                              interfaces compartidas (Project, SkillGroup, ...)
    sections/                              una carpeta por sección de la página
      nav/        hero/        about/
      skills/     projects/    contact/
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
  fonts/Inter-Variable.woff2
  icons/sprite.svg
  images/
```

Notas:
- `sections/` vs `ui/` es la distinción clave: una *section* es única y ligada al contenido;
  un *ui* es reutilizable y tonto. La tarjeta de proyecto y la de "building now" son el
  **mismo** `ui/card`.
- **`src/assets/` desaparece.** En Angular 18+ lo estático va en `public/`. Hoy conviven las dos
  carpetas con las fuentes duplicadas — ver `audit-legacy.md`.

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
`_tokens.scss` completo desde `design-tokens.md`, `@layer`, reset, base, mixin `up()`,
Inter variable auto-hospedada, sprite de iconos. Borrar `_grid.scss`, `_helpers.scss`,
`_ui.scss`, `_variables.scss`, `_fonts.scss` y las fuentes duplicadas.

**Fase 2 — Shell**
Quitar el scroll-snap y el `overflow: hidden` de `html, body`. `app.html` con `<header>` +
`<main>` + las 5 secciones reales. Nav V3 con signals y a11y, portando el *comportamiento*
del menú mobile del legado (no su código).

**Fase 3 — Primitivas UI**
`button` (variantes fill-cta / outline-accent / fill-accent), `chip`, `card`, `icon`,
`social-links`. Se construyen una vez y las secciones las consumen.

**Fase 4 — Secciones**, en este orden (de menor a mayor incertidumbre):
Hero → Skills → About → Projects → Contact.
Skills va temprano porque es la más simple en V3 y valida la escala tipográfica.
About va después de Skills porque depende de la foto real, que todavía no existe.

**Fase 5 — Contenido y remates**
Content layer con el copy real, meta/SEO, prerender, `prefers-reduced-motion`, auditoría de
contraste y Lighthouse.

**Fase 6 — Opcional / posterior**
Switch ESP/ENG, animaciones de entrada, analytics.

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
Firebase aparece en el stack histórico de Dany y encaja bien con salida estática.
