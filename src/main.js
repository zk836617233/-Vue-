import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueResource from 'vue-resource'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'


//导入文本编辑器样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

//导入 进度条插件的包
import Nprogress from 'nprogress'
//导入 进度条插件的css样式
import 'nprogress/nprogress.css'



Vue.use(ElementUI);

Vue.prototype.$http = axios;
 //配置请求根路径
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/';
// 在 request 拦截器中 展示进度条 Nprogress.start()
axios.interceptors.request.use(config => {
  Nprogress.start();
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config
});
// 在 response 拦截器中 隐藏进度条 Nprogress.done()
axios.interceptors.response.use(config => {
  Nprogress.done();
  return config
});


Vue.config.productionTip = false;

Vue.component('tree-table',TreeTable)
//将附文本全局
Vue.use(VueQuillEditor)

Vue.filter('dataFormat',function (originVai) {
 const dt = new Date(originVai)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2,'0')
  const d = (dt.getDate() + '').padStart(2,'0')

  const hh = (dt.getHours() + '').padStart(2,'0')
  const mm = (dt.getMinutes() + '').padStart(2,'0')
  const ss = (dt.getSeconds() + '').padStart(2,'0')

  return `${y}-${m}-${d}  ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
