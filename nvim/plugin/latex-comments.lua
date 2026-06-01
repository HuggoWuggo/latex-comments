vim.api.nvim_create_autocmd({"BufReadPost", "BufWritePost"}, {
  callback = function ()
    require("latex-comments").render()
  end
})
