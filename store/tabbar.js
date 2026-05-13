/**
 * Vuex模块 - 底部导航栏状态管理
 * 管理当前选中的tab索引和tab数量
 */
export default {
  namespaced: true,
  state: {
    /** 当前选中的tab索引 */
    currentTabIndex: 0,
    /** tab栏显示的tab数量 */
    tabNumber: 3
  },
  mutations: {
    /**
     * 设置当前选中的tab索引
     * @param {Object} state - 状态对象
     * @param {number} index - tab索引
     */
    setTabIndex(state, index) {
      state.currentTabIndex = index;
    },
    /**
     * 设置tab栏显示的tab数量
     * @param {Object} state - 状态对象
     * @param {number} number - tab数量
     */
    setTabNumber(state, number) {
      state.tabNumber = number;
    },
  },
  actions: {
    /**
     * 异步设置当前选中的tab索引
     * @param {Object} context - Vuex上下文
     * @param {number} index - tab索引
     */
    setTabIndex({ commit }, index) {
      commit("setTabIndex", index);
    },
    /**
     * 异步设置tab栏显示的tab数量
     * @param {Object} context - Vuex上下文
     * @param {number} number - tab数量
     */
    setTabNumber({ commit }, number) {
      commit("setTabNumber", number);
    }
  }
}
