module.exports = {
  baseUrl: './',
  assetsDir: 'static',
  productionSourceMap: false,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://10.16.0.153:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  },

}