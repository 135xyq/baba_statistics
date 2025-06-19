<script>
  import {userGetInfo} from '@/api/user';

  export default {
    onLaunch: function() {
      const openid =  this.$store.state.userInfo?.userInfo?.openid;
      if(openid){
        this.getUserInfo()
      }
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