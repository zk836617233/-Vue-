module.exports = {
  devServer: {
    open: true, //自动打开页面
    port: 1234,
  },

  chainWebpack:config => {
    //发布模式
    config.when(process.env.NODE_ENV === 'production',config => {
      config.entry('app').clear().add('./src/main-prod.js')

      config.set('externals', {
        vue:'Vue',
        'vue-router':'vueRouter',
        lodash:'_',
        echarts: 'echarts',
        nprogress:'Nprogress',
        'vue-quill-editor':'VueQuillEditor'
      })

    })
    //开发模式
    config.when(process.env.NODE_ENV === 'production',config => {
      config.entry('app').clear().add('./src/main.js')
    })


  },

  lintOnSave: false

};
