export default{
	namespaced:true,
	state:{
		currentTabIndex: 0,
	},
	mutations:{
		setTabIndex (state, index) {
		  state.currentTabIndex = index;
		},
  
	},
	actions:{
		setTabIndex({commit},index){
			commit("setTabIndex",index);
		},
	}
}