export default{
	namespaced:true,
	state:{
		userInfo:uni.getStorageSync('userInfo') || null,
		// userInfo:{"_id":"66e250572eea65469b5d1da2","nickName":"谢永强","gender":1,"language":"","city":"","province":"","country":"","avatarUrl":"https://mp-47222cf8-47ac-4463-a5d0-2a8b8cb4b608.cdn.bspapp.com/cloudstorage/9e0e57f6-9f1f-4972-8e6b-e073b7350dfd.6893287922557592","is_demote":true,"openid":"oB5r_5SIY6WGY_vYm3n1r6qPWG1M","roleLevel":1},
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