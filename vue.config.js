// module.exports = {
//     // 选项...
//     publicPath: './'
// }

module.exports = {
    
    // publicPath: process.env.NODE_ENV === 'production'? './': './',
    publicPath:'./',
    // eslint-loader ??????????
    lintOnSave: true,
    devServer: {
        proxy: {
          '/api': {
            target: 'http://localhost:3001',
            ws: true,
            changeOrigin: true
          },
          '/static': {
            target: 'http://localhost:3001',
            ws: true,
            changeOrigin: true
          }
        }
      }
}




