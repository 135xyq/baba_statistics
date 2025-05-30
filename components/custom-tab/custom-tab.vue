<template>
  <u-tabbar class="tab" activeColor="#d81e06" inactiveColor="#7A7E83" :value="currentTab" @change="name =>switchTab(name)" :fixed="true" :placeholder="true"
    :safeAreaInsetBottom="true">
    <u-tabbar-item class="tab-item" v-for="(item,index) in showTabBarList" :key="index" :text="item.text">
      <image class="tab-item__slot-icon" slot="active-icon" :src="item.selectedIconPath" />
      <image class="tab-item__slot-icon" slot="inactive-icon" :src="item.iconPath" />
    </u-tabbar-item>
  </u-tabbar>
</template>
<script>
export default {
  data() {
    return {
      tabBarList: [
        {
          key: 'index',
          pagePath: "/pages/index/index",
          iconPath: require("@/static/img/tab/home.png"),
          selectedIconPath: require("@/static/img/tab/home-active.png"),
          text: "粑粑记录"
        },
        {
          key: 'blind',
          pagePath: "/pages/blind/blind",
          iconPath: require("@/static/img/tab/blind.png"),
          selectedIconPath: require("@/static/img/tab/blind-active.png"),
          text: "盲盒"
        },
        {
          key: 'problem',
          pagePath: "/pages/problem/problem",
          iconPath: require("@/static/img/tab/problem.png"),
          selectedIconPath: require("@/static/img/tab/problem-active.png"),
          text: "做题记录"
        },
        {
          'key': 'chat',
          pagePath: "/pages/chat/chat",
          iconPath: require("@/static/img/tab/chat.png"),
          selectedIconPath: require("@/static/img/tab/chat-active.png"),
          text: "消息"
        },
        {
          key: 'login',
          pagePath: "/pages/login/login",
          iconPath: require("@/static/img/tab/my.png"),
          selectedIconPath: require("@/static/img/tab/my-active.png"),
          text: "个人中心"
        }
      ]
    };
  },
  computed:{
    currentTab(){
      return this.$store.state.tabbar.currentTabIndex;
    },
    showTabBarList(){
      const functionList = this.$store.state.userInfo?.userInfo?.functionList || [];
      
      return this.tabBarList.filter(item=>{
        return functionList.includes(item.key) || item.key === 'login'
      })
    }
  },
  methods: {
    switchTab(name) {
      this.$store.dispatch('tabbar/setTabIndex', name);
      uni.switchTab({
        url: this.showTabBarList[name].pagePath
      });
    }
  }
};
</script>
<style lang="scss">
.tab {
  &-item {

    &__title {
      color: $u-tips-color;
      background-color: $u-bg-color;
      padding: 15px;
      font-size: 15px;

      &__slot-title {
        color: #d81e06;
        font-size: 30rpx;
      }
    }

    &__slot-icon {
      width: 54rpx;
      height: 54rpx;
    }
  }
}
</style>