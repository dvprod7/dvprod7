# Figma Naming Convention - dvprod7 Portafolio

**Documento de referencia para la nomenclatura estándar de componentes UI en Figma**

> Última actualización: 28 de Febrero de 2026

---

## 📋 Tabla de contenidos

1. [Patrón base](#patrón-base)
2. [Categorías de componentes](#categorías-de-componentes)
3. [Contexto (ubicación)](#contexto-ubicación)
4. [Función (comportamiento)](#función-comportamiento)
5. [Estados y variantes](#estados-y-variantes)
6. [Ejemplos por componente](#ejemplos-por-componente)
7. [Estructura de carpetas en Figma](#estructura-de-carpetas-en-figma)
8. [Guía de aplicación](#guía-de-aplicación)

---

## 🎯 Patrón Base

```
[tipo]-[contexto]-[función]-[estado/variante]
```

### Ejemplo completo:
```
btn-hero-primary-default
│    │    │       │
│    │    │       └─ Estado/Variante (default, hover, disabled, etc)
│    │    └─────── Función (primary, secondary, submit, etc)
│    └──────────── Contexto (hero, nav, projects, contact, etc)
└─────────────── Tipo (btn, link, input, icon, card, etc)
```

---

## 📦 Categorías de Componentes

### Tipos principales:

```
btn        → Button / Botón
link       → Link / Enlace
input      → Form Input / Campo de entrada
textarea   → Text Area / Área de texto
icon       → SVG Icon / Icono
card       → Card Container / Tarjeta
badge      → Badge/Label / Etiqueta
divider    → Divider/Separator / Divisor
navbar     → Navigation Bar / Barra de navegación
footer     → Footer / Pie de página
modal      → Modal / Ventana modal
dropdown   → Dropdown / Menú desplegable
```

---

## 🌍 Contexto (Ubicación)

Dónde se utiliza el componente en la página:

```
hero       → Hero/Landing section
nav        → Navigation bar
projects   → Projects section
skills     → Skills section
about      → About section
contact    → Contact form
footer     → Footer
social     → Social links/icons
form       → Generic form elements
modal      → Modal dialogs
header     → Page header
```

---

## ⚙️ Función (Comportamiento)

Qué propósito cumple el componente:

### Para botones:
```
primary    → Acción principal / CTA
secondary  → Acción secundaria
submit     → Enviar formulario
close      → Cerrar dialogo
download   → Descargar
view       → Ver más
filter     → Filtrar contenido
expand     → Expandir sección
collapse   → Contraer sección
delete     → Eliminar
edit       → Editar
```

### Para enlaces:
```
primary    → Link principal
secondary  → Link secundario
social     → Link social
external   → Link externo
internal   → Link interno
```

### Para inputs:
```
text       → Text input
email      → Email input
password   → Password input
message    → Message/textarea
search     → Search input
```

---

## 🎨 Estados y Variantes

### Estados de interacción:
```
default    → Estado normal/por defecto
hover      → Estado al pasar mouse
active     → Estado activo/seleccionado
focus      → Estado con foco (teclado)
disabled   → Estado deshabilitado
error      → Estado de error
success    → Estado de éxito
loading    → Estado de carga
visited    → Link visitado (para links)
```

### Tamaño (especialmente para iconos):
```
-16        → 16x16px
-20        → 20x20px
-24        → 24x24px
-32        → 32x32px
-48        → 48x48px
-64        → 64x64px
```

### Color/Variante:
```
default    → Variante por defecto
alt        → Variante alternativa
dark       → Variante oscura
light      → Variante clara
outline    → Variante outline
ghost      → Variante ghost
```

---

## 📌 Ejemplos por Componente

### Botones

#### Hero section:
```
btn-hero-primary-default
btn-hero-primary-hover
btn-hero-primary-disabled
btn-hero-secondary-default
btn-hero-secondary-hover
```

#### Contact form:
```
btn-contact-submit-default
btn-contact-submit-hover
btn-contact-submit-disabled
btn-contact-submit-loading
```

#### Projects section:
```
btn-projects-view-default
btn-projects-view-hover
btn-projects-code-default
btn-projects-code-hover
btn-projects-filter-default
btn-projects-filter-active
btn-projects-filter-inactive
```

#### General:
```
btn-hire-primary-default
btn-hire-primary-hover
btn-download-primary-default
btn-download-primary-hover
```

---

### Enlaces

#### Navigation:
```
link-nav-primary-default
link-nav-primary-hover
link-nav-primary-active
link-nav-secondary-default
link-nav-secondary-hover
```

#### Social:
```
link-social-github-default
link-social-linkedin-default
link-social-gmail-default
link-social-twitter-default
```

#### Footer:
```
link-footer-primary-default
link-footer-primary-hover
link-footer-secondary-default
link-footer-secondary-hover
```

---

### Inputs

#### Contact form:
```
input-contact-name-default
input-contact-name-focus
input-contact-name-error
input-contact-email-default
input-contact-email-focus
input-contact-email-error
input-contact-message-default
input-contact-message-focus
input-contact-message-error
```

#### Generic form:
```
input-form-text-default
input-form-text-focus
input-form-text-disabled
input-form-textarea-default
input-form-textarea-focus
```

---

### Iconos

#### Navigation:
```
icon-nav-menu-24
icon-nav-close-24
icon-nav-hamburger-24
icon-nav-search-24
```

#### Social:
```
icon-social-github-24
icon-social-linkedin-24
icon-social-gmail-24
icon-social-twitter-24
icon-social-instagram-24
```

#### Skills:
```
icon-skill-angular-64
icon-skill-react-64
icon-skill-html-64
icon-skill-css-64
icon-skill-javascript-64
icon-skill-figma-48
icon-skill-python-48
icon-skill-firebase-48
icon-skill-php-48
icon-skill-docker-48
```

#### Projects:
```
icon-project-github-24
icon-project-live-24
icon-project-code-24
```

#### Language:
```
icon-language-en-20
icon-language-es-20
```

---

### Cards

#### Projects:
```
card-project-featured-default
card-project-featured-hover
card-project-default
card-project-hover
```

#### Skills:
```
card-skill-main-default
card-skill-main-hover
card-skill-auxiliary-default
card-skill-auxiliary-hover
```

#### Testimonials:
```
card-testimonial-default
card-testimonial-hover
```

---

### Otros componentes

#### Badges/Labels:
```
badge-tech-default
badge-tech-hover
badge-status-active-default
badge-status-inactive-default
```

#### Dividers:
```
divider-horizontal-default
divider-vertical-default
```

#### Backgrounds/Containers:
```
navbar-background
navbar-shadow
footer-background
hero-background
section-background
```

---

## 📂 Estructura de Carpetas en Figma

```
Design System/
├─ 01_Buttons/
│  ├─ Primary/
│  │  ├─ btn-*-primary-default
│  │  ├─ btn-*-primary-hover
│  │  └─ btn-*-primary-disabled
│  └─ Secondary/
│     ├─ btn-*-secondary-default
│     └─ btn-*-secondary-hover
│
├─ 02_Links/
│  ├─ Navigation/
│  │  ├─ link-nav-primary-default
│  │  ├─ link-nav-primary-hover
│  │  └─ link-nav-primary-active
│  └─ Social/
│     ├─ link-social-*-default
│     └─ link-social-*-hover
│
├─ 03_Forms/
│  ├─ Inputs/
│  │  ├─ input-*-text-default
│  │  ├─ input-*-text-focus
│  │  └─ input-*-text-error
│  └─ Textareas/
│     ├─ input-*-message-default
│     └─ input-*-message-focus
│
├─ 04_Icons/
│  ├─ Navigation/
│  │  ├─ icon-nav-menu-24
│  │  ├─ icon-nav-close-24
│  │  └─ icon-nav-search-24
│  ├─ Social/
│  │  ├─ icon-social-github-24
│  │  ├─ icon-social-linkedin-24
│  │  └─ icon-social-gmail-24
│  ├─ Skills/
│  │  ├─ icon-skill-angular-64
│  │  ├─ icon-skill-react-64
│  │  └─ icon-skill-*-64
│  └─ Language/
│     ├─ icon-language-en-20
│     └─ icon-language-es-20
│
├─ 05_Cards/
│  ├─ Projects/
│  │  ├─ card-project-featured-default
│  │  └─ card-project-featured-hover
│  └─ Skills/
│     ├─ card-skill-main-default
│     └─ card-skill-auxiliary-default
│
├─ 06_Badges/
│  ├─ badge-tech-default
│  └─ badge-status-*
│
└─ 07_Other/
   ├─ divider-horizontal-default
   ├─ navbar-background
   └─ footer-background

Pages/
├─ Home/
├─ About/
├─ Skills/
├─ Projects/
├─ Project Detail/
└─ Contact/

Landing Pages/
├─ LANDING PAGE - Hero alt text 1
├─ LANDING PAGE - Hero alt text 2
├─ LANDING PAGE - Hero alt text 3
├─ LANDING PAGE - Hero alt text 4
├─ LANDING PAGE - About/
├─ LANDING PAGE - Skills v2/
├─ LANDING PAGE - Projects/
└─ LANDING PAGE - Contact/

Social/
├─ LINKEDIN BANNER
└─ ...otros
```

---

## 📖 Guía de Aplicación

### Paso 1: Identificar el tipo
¿Es un botón, enlace, icono, etc?
```
btn, link, icon, card, input, etc.
```

### Paso 2: Determinar el contexto
¿Dónde se usa? 
```
hero, nav, projects, skills, contact, footer, etc.
```

### Paso 3: Definir la función
¿Qué hace?
```
primary, secondary, submit, close, view, filter, etc.
```

### Paso 4: Establecer el estado
¿En qué estado se muestra?
```
default, hover, active, disabled, error, etc.
```

### Ejemplo práctico:
```
Quiero un botón naranja en la sección Hero que dice "Ver Proyectos"

1. Tipo: btn
2. Contexto: hero
3. Función: primary (es una acción principal/CTA)
4. Estado: default

Resultado: btn-hero-primary-default
           ↓
Si queremos también los demás estados:
- btn-hero-primary-hover
- btn-hero-primary-disabled
```

---

## ✅ Checklist Aplicación

Antes de nombrar un componente, verifica:

- [ ] ¿Es el nombre legible sin abrir el archivo en Figma?
- [ ] ¿Alguien más puede entender qué es solo por el nombre?
- [ ] ¿Seguirá este patrón cuando crezca el proyecto?
- [ ] ¿Está consistente con otros componentes similares?
- [ ] ¿Incluye contexto suficiente para evitar duplicados?
- [ ] ¿El nombre tiene máximo 3-4 palabras separadas por guiones?

---

## 🚀 Beneficios de este sistema

### Para Figma:
✅ Búsqueda rápida: `btn-` encuentra todos los botones  
✅ Organización clara por contextualización  
✅ Evita duplicados innecesarios  
✅ Facilita el versionado de variantes  

### Para Code Generation:
✅ Patrones predecibles para automatización  
✅ Mapeo directo a componentes Angular  
✅ Generación automática de SCSS/CSS  
✅ Exportación consistente de SVGs  

### Para el equipo:
✅ Onboarding más rápido  
✅ Menos confusiones  
✅ Mejor documentación implícita  
✅ Escalabilidad futura  

---

## 🔄 Casos Especiales

### Componentes sin contexto específico:
Si un componente se usa en múltiples lugares pero es genérico:
```
✓ btn-primary-default      (en lugar de btn-generic-primary-default)
✓ input-text-default       
✓ link-secondary-default   
```

### Componentes muy específicos:
Si un componente es muy puntual:
```
✓ btn-download-cv-default
✓ btn-hire-me-default
✓ modal-project-detail-close
```

### Variantes complejas:
Si necesitas múltiples variantes:
```
btn-hero-primary-default-sm     ← pequeño
btn-hero-primary-default-lg     ← grande
btn-hero-primary-outline        ← estilo outline
```

---

## 📌 Regla de Oro

> **Si puedes leer el nombre sin abrir el archivo y saber exactamente dónde se usa, qué hace y en qué estado está → Es buen naming**

```
❌ "btn-large-orange"           (ambiguo, genérico)
❌ "Vector 1"                   (sin significado)
❌ "Rectangle 9"                (genérico)

✓ "btn-hero-primary-default"    (super claro)
✓ "icon-nav-menu-24"            (talla incluida)
✓ "input-contact-email-error"   (contexto + estado)
```

---

## 📚 Referencias

- **Figma Best Practices**: https://www.figma.com/best-practices/
- **Component Naming Convention**: Basado en Atomic Design + BEM
- **SVG Icon Naming**: Siguiendo Font Awesome & Material Design patterns

---

## 🔧 Próximos pasos

1. **Auditar Figma actual**: Aplicar naming a todos los componentes existentes
2. **Crear componentes faltantes**: Con los estados necesarios (hover, disabled, etc)
3. **Documentar variantes**: Si hay excepciones, documentarlas
4. **Integrar con código**: Mapear estos nombres a Angular components en el proyecto
5. **Mantener actualizado**: Revisar este documento cuando se agreguen nuevos componentes

---

**Documento creado**: 28 de Febrero de 2026  
**Proyecto**: dvprod7 Portafolio  
**Autor**: dvprod7  
**Estado**: ✅ Activo
