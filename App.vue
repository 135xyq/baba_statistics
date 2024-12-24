<script>
  import {userGetInfo} from '@/api/user';

  export default {
    onLaunch: function() {
      this.getUserInfo()
    },
    methods: {
      /**
       * 获取用户信息
       * @returns {Promise<void>}
       */
     getUserInfo() {
        userGetInfo().then(res => {
          this.$store.dispatch(
            "userInfo/updateUserInfo", res);
        })
      }
    }
  }
</script>

<style>
  /*每个页面公共css */
</style>