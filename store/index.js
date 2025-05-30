import Vue from "vue";
import Vuex from "vuex";
import userInfo from "./userInfo.js"
import tabbar from "./tabbar.js"

Vue.use(Vuex)

export default new Vuex.Store({
	state:{},
	mutations:{},
	actions:{},
	modules:{
		userInfo,
		tabbar
	}
})