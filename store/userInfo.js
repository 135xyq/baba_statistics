export default{
	namespaced:true,
	state:{
		userInfo:uni.getStorageSync('userInfo') || null,
	},
	mutations:{
		updateUserInfo (state, userInfo) {
		  state.userInfo = userInfo;
		},
    clearUserInfo (state) {
      state.userInfo = {};
    },
	},
	actions:{
		updateUserInfo({commit},userInfo){
			uni.setStorageSync('userInfo', userInfo);
			commit("updateUserInfo",userInfo);
		},
    clearUserInfo({commit}){
    	uni.removeStorage({
    	  key: 'userInfo'
    	})
    	commit("clearUserInfo");
    }
	}
}