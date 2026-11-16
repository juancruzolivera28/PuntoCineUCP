# Contraste de texto (WCAG 2 AA)

Verificación hecha con un script Node que implementa la fórmula de luminancia relativa y contraste de WCAG 2 (la misma que usa Lighthouse), no a ojo. Umbral exigido: **4.5:1** para texto normal. Confirmado además con una corrida real de Lighthouse (categoría Accessibility, desktop) sobre cada página.

## Fondos del sitio

| Variable | Color | Dónde se usa |
|---|---|---|
| `--bg` | `#000000` | Fondo general de la página |
| `--surface` | `#141414` | `.card`, `.venue-card`, `.seat-summary` |
| `--surface-alt` | `#1f1f1f` | `.tag`, `thead th`, `.alerta-stock`, `.nav__dropdown__menu` |

## Variable de texto

Se agregó `--rojo-texto`, exclusiva para color de texto, sin tocar `--gold` (que sigue usándose igual que antes en fondos, bordes y botones):

```css
--rojo-texto: #f7455a;
```

| Fondo | Contraste de `--rojo-texto` |
|---|---|
| `--bg` | 5.95:1 ✅ |
| `--surface` | 5.22:1 ✅ |
| `--surface-alt` | 4.67:1 ✅ |

Cumple 4.5:1 contra los tres fondos del sitio, así que sirve para cualquier texto rojo sin importar en qué tarjeta esté.

## Todos los usos de `--gold` como color de TEXTO, antes y después

| Selector | Fondo real | Antes | Ratio antes | Después |
|---|---|---|---|---|
| `.nav__logo span` | `--bg` | `var(--gold)` (`#e50914`, 4.38:1 ❌) | | `var(--rojo-texto)` (5.95:1 ✅) |
| `a` (links sin clase, p. ej. "Ver todas") | `--bg` | `var(--gold)` (4.38:1 ❌) | | `var(--rojo-texto)` (5.95:1 ✅) |
| `.hero__eyebrow` | `--bg` | `var(--gold)` (4.38:1 ❌) | | `var(--rojo-texto)` (5.95:1 ✅) |
| `thead th` | `--surface-alt` | `var(--gold)` (3.44:1 ❌) | | `var(--rojo-texto)` (4.67:1 ✅) |
| `td.price` | `--bg` / `--surface` (hover) | `var(--gold)` (4.38:1 / 3.84:1 ❌) | | `var(--rojo-texto)` (5.95:1 / 5.22:1 ✅) |
| `.card__price` | `--surface` | `var(--gold)` (3.84:1 ❌) | | `var(--rojo-texto)` (5.22:1 ✅) |
| `.precios-error`, `.carga-error` | `--surface` | `var(--gold)` (3.84:1 ❌) | | `var(--rojo-texto)` (5.22:1 ✅) |
| `.alerta-stock` | `--surface-alt` | `var(--gold)` (3.44:1 ❌) | | `var(--rojo-texto)` (4.67:1 ✅) |
| `.seat-summary__total` | `--surface` | `var(--gold)` (3.84:1 ❌) | | `var(--rojo-texto)` (5.22:1 ✅) |
| `.auth-mensaje--error` | `--bg` | `var(--gold)` (4.38:1 ❌) | | `var(--rojo-texto)` (5.95:1 ✅) |
| `.badge-cine--tipas` (texto) | `--surface` | `var(--zone-tipas)` (`#c81324`, 3.14:1 ❌) | | `var(--rojo-texto)` (5.22:1 ✅) |
| `td.cine--tipas` | `--bg` / `--surface` (hover) | `var(--zone-tipas)` (3.57:1 / 3.14:1 ❌) | | `var(--rojo-texto)` (5.95:1 / 5.22:1 ✅) |

El borde y el punto de `.badge-cine--tipas` siguen en `var(--zone-tipas)` sin cambios: se agregaron `border-color` y `::before { background }` explícitos para que no sigan al `color` del texto por `currentColor`.

`.form-summary`, `.product-list__row .price` y `.qty-btn:hover` también usaban `var(--gold)` como texto, pero son estilos de una UI que ya no existe en el HTML actual (se reemplazó por el flujo real de butacas): no se tocaron porque no se renderizan en ninguna página.

`.btn--outline:hover` y `.auth-nav__ingresar:hover`/`.auth-nav__salir:hover` también usan `var(--gold)` como texto, pero son estados `:hover` de botones/controles — fuera de alcance porque la consigna pide no tocar colores de botones, y además `:hover` no lo evalúa un análisis estático de accesibilidad.

## Colores que ya cumplían (no se tocaron)

| Texto | Color | Sobre `--bg` | Sobre `--surface` | Sobre `--surface-alt` |
|---|---|---|---|---|
| `--zone-imax` (`badge-cine--imax`) | `#f5f5f5` | 19.26:1 ✅ | 16.90:1 ✅ | 15.12:1 ✅ |
| `--zone-sunstar` (`badge-cine--sunstar`) | `#ff3b30` | 5.92:1 ✅ | 5.19:1 ✅ | 4.65:1 ✅ |
| `--text-muted` (`.muted` y el resto del texto gris) | `#a3a3a3` | 8.33:1 ✅ | 7.30:1 ✅ | 6.53:1 ✅ |

`--text-muted` ya superaba 4.5:1 en los tres fondos del sitio (incluido `--surface`, el fondo de las tarjetas): no hizo falta subirlo.

## Verificación con Lighthouse real

Con Node + Microsoft Edge (como motor Chromium) corriendo Lighthouse (`categories=accessibility`, `form-factor=desktop`) contra las 10 páginas servidas localmente, el audit `color-contrast` no reporta ningún elemento en ninguna página después de estos cambios.
