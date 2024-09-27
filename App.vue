<script>
  export default {
    onLaunch: function() {
      console.log('App Launch')
      this.getUserInfo()
    },
    onShow: function() {
      console.log('App Show')
    },
    onHide: function() {
      console.log('App Hide')
    },
    methods: {
     async getUserInfo() {
        if (this.$store.state.userInfo?.userInfo?.openid) {
          const state = this.$store.state.userInfo?.userInfo
          const openid = state.openid

          const msg = await uniCloud.callFunction({
            name: "get_user_info",
            data: {
              openid: openid
            },
            success:(res)=> {
              this.$store.dispatch(
                "userInfo/updateUserInfo", res.result.data);
            }
          });
        } else {
          uni.switchTab({
            url: '/pages/login/login'
          })
        }
      }

    }
  }
</script>

<style>
  /*每个页面公共css */
</style>