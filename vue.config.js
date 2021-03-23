module.exports = {
  baseUrl: './',
  assetsDir: 'static',
  productionSourceMap: false,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://10.16.0.170:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  },

}
// http://10.16.0.163:8080
// 'http://10.16.0.170:8080'