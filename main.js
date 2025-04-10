import App from './App'
import store from './store'
import uView from '@/uni_modules/uview-ui'
// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
import api from "@/api/index.js"
Vue.use(uView)
App.mpType = 'app'
const app = new Vue({
  ...App,
  store
})
app.$mount()
// #endif

// #ifdef VUE3
import {
  createSSRApp
} from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif