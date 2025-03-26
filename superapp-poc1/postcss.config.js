module.exports = {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},
    'postcss-preset-env': {
      features: {
        'break-properties': false,
        'text-wrap': false,
        'mix-blend-mode': false
      }
    }
  }
}
