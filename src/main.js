import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

import '@/assets/css/css.css'
import TMessage from '@/components/TMessage/TMessage.js' 

Vue.config.productionTip = false

Vue.prototype.$message = TMessage;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
