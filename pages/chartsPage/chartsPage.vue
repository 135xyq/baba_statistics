<template>
  <view>
      <calendar :openid="openId"></calendar>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        openId: ''
      }
    },
    onShow() {
      if (this.$store.state.userInfo?.userInfo?.openid) {
        const state = this.$store.state.userInfo?.userInfo
        this.openId = state.openid
      }else{
        uni.navigateBack()
      }
    },
    methods: {
      
    }
  }
</script>

<style>

</style>
