export default{
	namespaced:true,
	state:{
		currentTabIndex: 0,
		tabNumber: 3
	},
	mutations:{
		setTabIndex (state, index) {
		  state.currentTabIndex = index;
		},
		setTabNumber (state, number) {
		  state.tabNumber = number;
		},
  
	},
	actions:{
		setTabIndex({commit},index){
			commit("setTabIndex",index);
		},
		setTabNumber({commit}, number) {
			commit("setTabNumber", number);
		}
	}
}