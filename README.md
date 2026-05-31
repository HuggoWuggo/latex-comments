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
