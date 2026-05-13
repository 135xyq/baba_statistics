/**
 * Vuex状态管理 - 主入口
 * 集中管理应用的全局状态，模块化组织各业务状态
 */
import Vue from "vue";
import Vuex from "vuex";
import userInfo from "./userInfo.js"
import tabbar from "./tabbar.js"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    userInfo,
    tabbar
  }
})
