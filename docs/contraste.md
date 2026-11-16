# Contraste de texto (WCAG 2 AA)

Verificación hecha con un script Node que implementa la fórmula de luminancia relativa y contraste de WCAG 2 (la misma que usa Lighthouse), no a ojo. Umbral exigido: **4.5:1** para texto normal.

## Fondos del sitio

| Variable | Color |
|---|---|
| `--bg` | `#000000` |
| `--surface` (fondo de `.card`, `.venue-card`) | `#141414` |
| `--surface-alt` (fondo de `.tag`, `.nav__dropdown__menu`) | `#1f1f1f` |

## Diagnóstico (antes del cambio)

| Texto | Color | Sobre `--bg` | Sobre `--surface` |
|---|---|---|---|
| `--gold` (logo, "Ver todas", `card__price`) | `#e50914` | 4.38:1 ❌ | 3.84:1 ❌ |
| `--zone-tipas` (`badge-cine--tipas`) | `#c81324` | 3.57:1 ❌ | 3.14:1 ❌ |
| `--zone-imax` (`badge-cine--imax`) | `#f5f5f5` | 19.26:1 ✅ | 16.90:1 ✅ |
| `--zone-sunstar` (`badge-cine--sunstar`) | `#ff3b30` | 5.92:1 ✅ | 5.19:1 ✅ |
| `--text-muted` (`.muted`, texto gris) | `#a3a3a3` | 8.33:1 ✅ | 7.30:1 ✅ |

`--zone-imax`, `--zone-sunstar` y `--text-muted` ya cumplían 4.5:1 en todos los fondos donde se usan (incluso contra `--surface-alt`, el fondo más claro del sitio: 6.53:1 para `--text-muted`). No se modificaron.

## Cambio aplicado

Se agregó una variable nueva, exclusiva para texto, sin tocar `--gold` ni los colores de fondo/borde/botones:

```css
--rojo-texto: #f63148;
```

| Uso | Antes | Después | Sobre `--bg` | Sobre `--surface` |
|---|---|---|---|---|
| `.nav__logo span` ("CINE") | `var(--gold)` | `var(--rojo-texto)` | 5.45:1 ✅ | — |
| `a` (incluye el link "Ver todas") | `var(--gold)` | `var(--rojo-texto)` | 5.45:1 ✅ | — |
| `.card__price` | `var(--gold)` | `var(--rojo-texto)` | — | 4.78:1 ✅ |
| `.badge-cine--tipas` (texto) | `var(--zone-tipas)` | `var(--rojo-texto)` | — | 4.78:1 ✅ |

El borde y el punto de `.badge-cine--tipas` siguen en `var(--zone-tipas)` (`#c81324`, sin cambios): se agregaron `border-color` y `::before { background }` explícitos para que no sigan a `color` por `currentColor`.

`div.card` y `div.card__body.venue-card` no tienen color de texto propio: el motivo por el que Lighthouse los señalaba era el texto de `.card__price` y de los badges que contienen, ya corregido arriba.

## Fuera de alcance de este cambio

El mismo `var(--gold)` usado como texto en otros lugares (`.hero__eyebrow`, `td.price`, `.form-summary`, `.seat-summary__total`, `.auth-mensaje--error`, `.alerta-stock`, `.precios-error`/`.carga-error`, `td.cine--tipas`) comparte el mismo problema de contraste, pero no estaba en la lista de elementos a corregir y no se tocó.
