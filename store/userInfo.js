/**
 * Vuex模块 - 用户信息状态管理
 * 管理用户登录状态、个人信息，并持久化到本地存储
 */
export default {
  namespaced: true,
  state: {
    /** 用户信息对象，从本地存储初始化 */
    userInfo: uni.getStorageSync('userInfo') || null,
  },
  mutations: {
    /**
     * 更新用户信息
     * @param {Object} state - 状态对象
     * @param {Object} userInfo - 用户信息
     */
    updateUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    /**
     * 清除用户信息（退出登录时调用）
     * @param {Object} state - 状态对象
     */
    clearUserInfo(state) {
      state.userInfo = {};
    },
  },
  actions: {
    /**
     * 异步更新用户信息并持久化到本地存储
     * @param {Object} context - Vuex上下文
     * @param {Object} userInfo - 用户信息
     */
    updateUserInfo({ commit }, userInfo) {
      uni.setStorageSync('userInfo', userInfo);
      commit("updateUserInfo", userInfo);
    },
    /**
     * 异步清除用户信息并移除本地存储
     * @param {Object} context - Vuex上下文
     */
    clearUserInfo({ commit }) {
      uni.removeStorage({ key: 'userInfo' });
      commit("clearUserInfo");
    }
  }
}
