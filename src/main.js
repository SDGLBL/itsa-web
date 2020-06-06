import Vue from 'vue'
import App from './App.vue'
import Element from 'element-ui'
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Element)
Vue.config.productionTip = false
Vue.prototype.$axios = axios ;

new Vue({
  render: h => h(App),
}).$mount('#app')
