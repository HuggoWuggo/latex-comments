# latex-comments.nvim

A Neovim plugin that renders LaTeX math expressions in comments as unicode equations inline.

## How it works

Write a comment starting with `!` and wrap your LaTeX in `$...$`:

```cpp
//! $\sum_{i=0}^{n} x_i^2$
```

On save or open, it renders as virtual text at the end of the line:

```
//! $\sum_{i=0}^{n} x_i^2$        ∑ᵢ₌₀ⁿxᵢ²
```

Works with any filetype — `//!` for C++/JS, `#!` for Python, `--!` for Lua, etc.

## Requirements

- Neovim 0.10+
- Node.js

## Installation

Using [lazy.nvim](https://github.com/folke/lazy.nvim):

```lua
{
  "HuggoWuggo/latex-comments.nvim",
  build = "npm install",
  lazy = false,
}
```

## Examples

| LaTeX | Rendered |
|---|---|
| `\sum_{i=0}^{n} x_i^2` | `∑ᵢ₌₀ⁿxᵢ²` |
| `\frac{a+b}{c}` | `(a+b)/(c)` |
| `\int_a^b f(x) dx` | `∫ₐᵇf(x)dx` |
| `\alpha + \beta = \gamma` | `α+β=γ` |
| `x^2 + y^2 = r^2` | `x²+y²=r²` |

## Limitations

- Rendering is unicode only — no images or proper math fonts
- Fractions are displayed as `(a)/(b)` rather than vertically
- Super/subscript coverage is limited to common characters

## Customising

Customisation is done through a color (COL) after the comment indicator (!).
e.g) //!red {CODE}

| Name   | Hex Code  | Preview |
|--------|-----------|----------|
| Red    | `#ff5555` | ![#ff5555](https://placehold.co/15x15/ff5555/ff5555.png) |
| Green  | `#50fa7b` | ![#50fa7b](https://placehold.co/15x15/50fa7b/50fa7b.png) |
| Blue   | `#8be9fd` | ![#8be9fd](https://placehold.co/15x15/8be9fd/8be9fd.png) |
| Yellow | `#f1fa8c` | ![#f1fa8c](https://placehold.co/15x15/f1fa8c/f1fa8c.png) |
| Orange | `#ffb86c` | ![#ffb86c](https://placehold.co/15x15/ffb86c/ffb86c.png) |
| Purple | `#bd93f9` | ![#bd93f9](https://placehold.co/15x15/bd93f9/bd93f9.png) |
| Pink   | `#ff79c6` | ![#ff79c6](https://placehold.co/15x15/ff79c6/ff79c6.png) |
