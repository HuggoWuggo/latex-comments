local M = {}

local ns = vim.api.nvim_create_namespace('latex_comments')
local script = debug.getinfo(1).source:match("@(.*/)") .. "../../../scripts/render.js"

local color_map = {
  red     = "#ff5555",
  green   = "#50fa7b",
  blue    = "#8be9fd",
  yellow  = "#f1fa8c",
  orange  = "#ffb86c",
  purple  = "#bd93f9",
  pink    = "#ff79c6",
}

function M.render()
  vim.api.nvim_buf_clear_namespace(0, ns, 0, -1)
  local lines = vim.api.nvim_buf_get_lines(0, 0, -1, false)
  for i, line in ipairs(lines) do
    -- local latex = line:match("//!%s*%$(.-)%$")
    -- local comment = vim.bo.commentstring:match("(.-)%s*%%s"):gsub("%p", "%%%1")
    local comment = vim.bo.commentstring:match("(.-)%s*%%s"):gsub("%p", "%%%1")
    local color, latex = line:match(comment .. "!(%w*)%s*%$(.-)%$")
    
    local hl_group = "LatexComment"
    if color and color_map[color] then
      local group_name = "LatexComment_" .. color
      vim.api.nvim_set_hl(0, group_name, { fg = color_map[color] })
      hl_group = group_name
    end
    
    if latex then
      vim.system({"node", script, latex}, {text = true}, function (result)
        local unicode = result.stdout:gsub("%s+$", "")

        vim.schedule(function ()
          vim.api.nvim_buf_set_extmark(0, ns, i-1, 0, {
            virt_text = {{unicode, hl_group}},
            virt_text_pos = "eol"
          })
        end)
      end)
    end
  end
end

return M
