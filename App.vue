/**
 * 应用入口组件
 * 处理应用启动时的初始化逻辑，如自动获取用户信息
 */
<script>
  import {userGetInfo} from '@/api/user';

  export default {
    onLaunch: function() {
      const openid = this.$store.state.userInfo?.userInfo?.openid;
      if (openid) {
        this.getUserInfo();
      }
    },
    methods: {
      /**
       * 获取用户信息并同步到store
       * @returns {Promise<void>}
       */
      getUserInfo() {
        userGetInfo().then(res => {
          this.$store.dispatch("userInfo/updateUserInfo", res);
        });
      }
    }
  }
</script>

<style>
  /* 每个页面公共css */
</style>
