module.exports = {
  entryPoints: ['app/javascript/entrypoints/*.*'],
  bundle: true,
  sourcemap: true,
  outdir: 'app/assets/builds',
  publicPath: '/assets',
  loader: { '.js': 'jsx', '.jsx': 'jsx' },
  target: 'es2018',
  format: 'esm',
  minify: false
}
