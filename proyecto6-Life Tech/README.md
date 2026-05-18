# Life Tech — Design System

**Life Tech (LT)** is a hardware e-commerce brand selling gaming gear and PC components — keyboards, mice, headsets, RAM, GPUs, CPUs — to a Gen Z / gamer audience. The site speaks Spanish, leads with **lifestyle benefits over raw specs**, and dresses everything in a dark, energetic, neon-red aesthetic.

> Tagline: **"Tu vida, tu setup."**

---

## At a glance

| | |
|---|---|
| **Audience** | Gamers, Gen Z, PC builders, esports-curious |
| **Categories** | Periféricos (teclado, mouse, audífonos), Componentes (RAM, GPU, CPU), Setups completos |
| **Voice** | Cálida y humana — "tú", emocional, con humor; los specs aparecen, pero la promesa es la sensación |
| **Aesthetic** | Modo oscuro denso, rojo neón vivo, motion energético, tipografía geométrica |
| **Logo** | Wordmark only — `LT` en tipografía Inter Black, condensada |

## Sources

This system was built from scratch — there is no upstream codebase or Figma file. The user-supplied brief was:

> "Crea una landpage de venta de productos de hardware, el sitio se llama 'Life Tech'. Audience: gamers / Gen Z. Aesthetic: dark mode, red, neon, animations. Spanish. Tone: warm & human. Imagery: tecnología, velocidad, AI."

Reference repos pinned in the brief (shadcn-ui/ui, anthropics/skills, blencorp/claude-code-kit, nextlevelbuilder/ui-ux-pro-max-skill) were **not imported** — Life Tech needed its own visual identity, not a generic shadcn skin. Token names (`--background`, `--foreground`, `--primary`, `--muted`, etc.) follow the shadcn convention so swapping later is painless.

---

## Index

| File / folder | What's in it |
|---|---|
| `README.md` | This file. Brand context, fundamentals, iconography. |
| `SKILL.md` | Cross-compatible Agent Skill manifest — drop into Claude Code. |
| `colors_and_type.css` | All CSS variables (color, type, radius, shadow, spacing) + base element styles. |
| `fonts/` | Self-hosted webfonts (Inter, JetBrains Mono via Google Fonts CDN — see file). |
| `assets/` | Logo SVG, product placeholder imagery, brand textures. |
| `preview/` | Small HTML cards rendered into the Design System tab. |
| `ui_kits/storefront/` | E-commerce UI kit: home, PDP, cart, checkout, account, orders. |

---

## Content fundamentals

**Language.** Spanish, voseo neutral ("tú", not "vos"). All product copy, microcopy, errors, button labels in Spanish.

**Tone.** Cálida + humana + un poco gamer. Beneficios primero, specs después. La promesa no es "144 Hz" — la promesa es **"reaccionas antes de pensar."**

**Casing.** Sentence case everywhere — headlines, buttons, nav. Never title case. Never SHOUTING CAPS (except a single hero word for impact, sparingly). Display headlines are large enough that lowercase reads as a stylistic choice.

**Person.** Segunda persona singular informal ("tú"). Direct. The brand talks **to you**, not about itself. "Llevá tu juego al siguiente nivel" → "Llévate el control."

**Length.** Hero claim ≤ 7 palabras. Product short description ≤ 14 palabras. Botones: 1–3 palabras (`Añadir`, `Ver más`, `Comprar ahora`).

**Concrete examples**

| ❌ Don't | ✅ Do |
|---|---|
| "Disfrute de nuestro nuevo teclado mecánico con switches Cherry MX Red de alta precisión." | "Cada tecla, un disparo limpio." |
| "AÑADIR AL CARRITO" | "Añadir" |
| "Compre en nuestro sitio web hoy mismo" | "Listo para tu setup" |
| "Bienvenido, Usuario" | "Hola, Andrés 👋" |

**Emoji.** Permitidos pero **escasos** — máximo uno por bloque, y solo en contextos cálidos: saludo personal, confirmación de pedido, banner de envío gratis. Nunca en headlines del producto, nunca en specs.

**Numbers & units.** Specs siempre en línea con su unidad sin espacio cuando es marca registrada (`144Hz`, `1ms`, `RGB`); con espacio cuando es genérico (`16 GB`, `2.4 GHz`). Precios en `$` con separador de miles con coma: `$1,299 MXN`.

**Microcopy patterns.**

- Loading: `Cargando…` (nunca "Loading" suelto)
- Error: `Algo no salió bien. Intenta de nuevo.`
- Empty cart: `Tu carrito está vacío. Es hora de armar tu setup.`
- Out of stock: `Agotado por ahora — avísame cuando vuelva`
- Free shipping: `Envío gratis · 2-3 días`

---

## Visual foundations

**Color philosophy.** Casi monocromo — negro denso + grises tipográficos + un solo rojo de marca que hace el trabajo emocional. Acentos neón (verde lima, cian) son raros y se reservan para estados activos / live / online. Nada de gradientes de marca; el único gradiente permitido es radial rojo→transparente como **glow** detrás de productos destacados.

**Type.** Geometric sans — **Inter** para todo (display + body + UI). Pesos: 900 (display extremo), 700 (titulares), 500 (énfasis), 400 (body). Tracking apretado en display (-0.04em), normal en body. **JetBrains Mono** para specs, SKUs, precios "tickeando", contadores. Nada serif, jamás.

**Spacing scale.** 4-px base, ratio ×2 en saltos grandes: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128`. Layout content max-width `1280px`, gutter `clamp(16px, 4vw, 64px)`.

**Backgrounds.** Negro (`--bg`) por defecto, **superficies** ligeramente elevadas (`--surface`, `--surface-2`). Fondos con **textura sutil de grano** sobre full-bleed (10% opacidad) — añade profundidad sin distraer. Hero sections usan **product photography full-bleed** con vignette radial oscura desde el centro hacia los bordes. Patrones repetidos: una grilla técnica de 1px (`--bg-grid`) detrás de cards de producto, casi invisible. **Sin** gradientes color-color de marca.

**Animation.**
- Easing default: `cubic-bezier(0.22, 1, 0.36, 1)` (out-quint) — punchy, casi snap.
- Duración corta: `150ms` (hover), `220ms` (transición de estado), `400ms` (entrada de card).
- Hero counters/specs: contador rápido de 0 → valor final en `~600ms`.
- "Live" pulse en stock-low badges: `1.4s` infinito, opacidad 0.4 → 1.
- Product card hover: imagen escala `1.04`, glow rojo aparece detrás (`opacity 0 → 1`), sombra crece.
- **Sin bounces.** Sin spring oscilante. El movimiento es **veloz y decisivo** — refleja la promesa del producto.

**Hover states.** Botones primarios: glow rojo que se intensifica + aumento mínimo de scale (`1.02`). Botones secundarios: borde de `border` → `border-strong`. Links: subrayado sliding (left-to-right). Cards: lift de `4px` + glow rojo difuso. **Nunca** cambio de color base — el rojo de marca no debería "oscurecerse" en hover; solo glow.

**Press / active.** Scale `0.98`, glow desaparece momentáneamente (50ms), luego vuelve. Feels mechanical — como el click de un switch.

**Borders.** `1px solid var(--border)` por defecto. Border-strong solo en estados focus. Inputs y cards casi siempre tienen borde, no shadow drop, en superficies oscuras.

**Shadow system.**
- `--shadow-glow-red`: `0 0 40px -8px rgb(239 43 43 / 0.45)` — el efecto característico de la marca.
- `--shadow-card`: `0 8px 24px -12px rgb(0 0 0 / 0.6)` — sutil, casi imperceptible sobre fondo oscuro.
- `--shadow-elevated`: `0 24px 48px -16px rgb(0 0 0 / 0.8)` — para modales, dropdowns.
- **Inner shadow** en inputs activos: `inset 0 0 0 1px var(--brand-red)` — más nítido que un outer glow.

**Capsules vs gradients.** Para botones/badges siempre **capsule + border + bg sólido**, jamás gradiente lineal. La única excepción: el "live indicator" que usa un dot con halo radial.

**Layout rules.** Header sticky con backdrop-blur (`backdrop-filter: blur(12px)` + `bg/0.7`). Footer fijo nunca; siempre al final del flow. Carrito y filtros usan **side panels** (sheet desde la derecha), no overlays centrados. Modales: centrados + backdrop oscuro a `0.85` + blur ligero.

**Transparency & blur.** Solo para **chrome flotante** (header sticky, sheets, dropdowns). Nunca en cards de contenido — eso enturbia la legibilidad.

**Imagery vibe.** Cool tone, contraste alto, sombras profundas. Product shots con **rim light rojo** desde un lado para integrar la marca en la foto misma. Lifestyle: setups oscuros con monitor encendido, manos sobre teclado, ambient red bias. Sin grano excesivo — digital limpio. Sin colores cálidos (amarillo, naranja) en imagery; chocan con la paleta.

**Corner radii.** `4px` (chips/badges), `8px` (botones, inputs), `12px` (cards), `20px` (sheets, modales). Nada de pill/fully-rounded excepto para tags de filtro.

**Cards.** `bg-surface` + `1px solid border` + `radius-12` + `shadow-card`. Sin gradiente. Hover: lift + `shadow-glow-red` difuso. Featured product card: borde `--brand-red` + `shadow-glow-red` permanente.

---

## Iconography

**System.** [Lucide](https://lucide.dev) via CDN — stroke-based, 1.5px stroke weight, geometric. Matches the geometric Inter type system. Reasoning: nothing in the brand is "drawn"; everything is engineered. Lucide's mechanical, even strokes mirror that.

**Usage.**
- Default size: `20px` for nav, `16px` inline with text, `24px` standalone in cards, `48px+` for empty states / category tiles.
- Default color: `currentColor` — inherits from parent. Active/state icons get `--brand-red` directly.
- Stroke weight: `1.5` (Lucide default). Never thicker.

**No emoji** in product UI, marketing surfaces, or specs. Emoji is allowed **only** in:
- Personal greetings in account ("Hola, Andrés 👋")
- Confirmation of order placed (`✓` is a Lucide icon, not the emoji)
- Free shipping micro-banner ("Envío gratis 🚚")

**No unicode chars as icons** outside of `→` for inline link arrows and `·` for separators.

**Brand mark.** `assets/logo-lt.svg` — wordmark "LT" set in Inter Black at `-0.04em` tracking, with a single red dot under the T. The dot is the brand's only "graphic element" and appears alone as a favicon / loading indicator.

**Icon set imported via CDN** (lucide@latest) — see `colors_and_type.css` for the script tag pattern. No SVG sprite is committed; that keeps the kit small and lets you reach for any Lucide icon without worrying about whether it's been imported.

---

## How to use this system

1. Drop `colors_and_type.css` into your `<head>`.
2. Pull fonts from Google Fonts (Inter + JetBrains Mono) — both are linked at the top of the CSS file.
3. Wrap pages in `<body class="lt">` — that activates the dark default + base type ramp.
4. For components, pull from `ui_kits/storefront/`. Each component is a small, well-factored JSX file with cosmetic-only logic.
5. For variations or one-off mocks, copy assets out of `assets/` rather than referencing them from outside.

---

## Caveats

- **Logos & imagery are placeholders** — the wordmark is set in Inter (a Google Font), not a custom typeface. Product images are stock-style placeholders generated as CSS — replace with real product photography before shipping.
- **No upstream brand book** — every visual decision was made fresh. If Life Tech is a real client, please surface their existing brand guidelines and we'll reconcile.
- **Spanish copy** is voseo-neutral / Mexican-friendly. If the audience is Argentina or Spain, microcopy needs a regional pass.
