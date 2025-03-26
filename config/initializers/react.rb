Rails.application.configure do
  config.react.server_renderer_extensions = ["jsx", "js"]
  config.react.jsx_transform_options = {
    harmony: true,
    strip_types: true
  }
end
