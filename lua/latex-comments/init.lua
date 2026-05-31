local M = {}

local ns = vim.api.nvim_create_namespace('latex_comments')
local script = debug.getinfo(1).source:match("@(.*/)") .. "../../scripts/render.js"

function M.render()
  vim.api.nvim_buf_clear_namespace(0, ns, 0, -1)
  local lines = vim.api.nvim_buf_get_lines(0, 0, -1, false)
  for i, line in ipairs(lines) do
    -- local latex = line:match("//!%s*%$(.-)%$")
    local comment = vim.bo.commentstring:match("(.-)%s*%%s"):gsub("%p", "%%%1")
    local latex = line:match(comment .. "!%s*%$(.-)%$")

    if latex then
      vim.system({"node", script, latex}, {text = true}, function (result)
        local unicode = result.stdout:gsub("%s+$", "")

        vim.schedule(function ()
          vim.api.nvim_buf_set_extmark(0, ns, i-1, 0, {
            virt_text = {{unicode, "Comment"}},
            virt_text_pos = "eol"
          })
        end)
      end)
    end
  end
end

return M
