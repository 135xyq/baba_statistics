<template>
  <view>
    <!-- 未登录显示微信登录 -->
    <view class="wx-login" v-if="!isLogin">
      <image :src="userInfo.avatar" class="unlogin-user-avatar"></image>
      <button type="primary" @click="wxLogin" class="login-button">微信登录</button>
    </view>
    <!-- 登录完成 -->
    <view class="wx-logined" v-if="isLogin">
      <view class="header">
        <view class="set">
          <u-icon name="setting-fill" size="25" @click="onHandleGoPageUserSet"></u-icon>
        </view>
        <!-- 头部个人信息 -->
        <view class="user-info">
          <view class="user-info-avatar">
            <u-avatar :src="userInfo.avatar" class="user-info-avatar__img" size="75" />
          </view>
          <view class="user-info-name">
            {{userInfo.nickName}}
          </view>
        </view>
      </view>
      <view class="content">
      	<!-- 最近七天变化趋势 -->
      	<view class="history item" @click="onHandleToChartsPage">
      		<view class="select-item">最近七天变化趋势</view>
      		<uni-icons type="forward" color="#939188" size="20" class="load-to-page"></uni-icons>
      	</view>
      	<!-- 拉粑粑历史记录 -->
      	<view class="chat item" @click="onHandleToHistoryPage">
      		<view class="select-item chat-item">拉粑粑历史记录</view>
      		<uni-icons type="forward" color="#939188" size="20" class="load-to-page"></uni-icons>
      		
      	</view>
      </view>
      <!-- <button type="primary" @click="logout" class="login-button">退出登录</button> -->
    </view>

  </view>
</template>

<script>
  import avatarUrl from "../../static/img/default_avatar.jpg";
  export default {
    data() {
      return {
        openId: '', //唯一标识
        isLogin: false, //用户是否登录
        userInfo: {
          avatar: avatarUrl,
          nickName: ''
        }, //用户信息
      }
    },
    onShow() {
      if (this.$store.state.userInfo?.userInfo?.openid) {
        const state = this.$store.state.userInfo?.userInfo
        this.isLogin = true
        this.openId = state.openid
        this.userInfo.avatar = state.avatarUrl
        this.userInfo.nickName = state.nickName
      }
    },
    methods: {
      // 获取code
      getCode() {
        return new Promise((resolve, reject) => {
          uni.login({
            provider: "weixin",
            success: (e) => {
              resolve(e)
            },
            fail: (err) => {
              reject(new Error("获取code失败"))
            }
          })
        })
      },
      async wxLogin() {
        const {
          code
        } = await this.getCode();
        uni.request({
          url: `https://api.weixin.qq.com/sns/jscode2session?appid=wxf600daae2dc114e6&secret=1dd92382dbe76240929007795b89005e&js_code=${code}&grant_type=authorization_code`,
          method: "GET"
        }).then(res => {
          this.openId = res.data.openid
          uni.showModal({
            title: '温馨提示',
            content: '授权微信登录后才能正常使用小程序功能',
            success: (res) => {
              //如果用户点击了确定按钮
              if (res.confirm) {
                uni.showLoading({
                  title: '登录中...'
                })
                uni.getUserProfile({
                  desc: '获取你的昵称、头像',
                  success: res => {
                    console.log(res, 2222);
                    console.log(res.userInfo);
                    res.rawData = JSON.parse(res.rawData); //将字符串转为对象
                    uniCloud.callFunction({
                      name: "user_login",
                      data: {
                        ...res.userInfo,
                        openid: this.openId
                      },
                      success: async (res) => {
                        uni.showToast({
                          title: '登录成功',
                          icon: 'success',
                          duration: 2000
                        });
                        await uniCloud.callFunction({
                          name: "get_user_info",
                          data: {
                            openid: this.openId
                          },
                          success: (res) => {
                            this.$store.dispatch(
                              "userInfo/updateUserInfo", res.result.data);
                            // 修改登录状态
                            this.isLogin = true;
                            // 获取用户信息
                            // 获取登录用户信息
                            this.userInfo.nickName = this.$store.state.userInfo.userInfo
                              .nickName;
                            this.userInfo.avatar = this.$store.state.userInfo.userInfo
                              .avatarUrl;
                            this.userInfo.openid = this.$store.state.userInfo.userInfo
                              .openid;
                          }
                        });
                      },
                      fail(e) {
                        uni.hideLoading()
                        //拒绝授权
                        uni.showToast({
                          title: '登陆失败',
                          icon: 'error',
                          duration: 2000
                        });
                      }
                    })
                    uni.hideLoading()
                  },
                  fail: res => {
                    uni.hideLoading()
                    //拒绝授权
                    uni.showToast({
                      title: '拒绝授权',
                      icon: 'error',
                      duration: 2000
                    });
                    return;
                  },
                });
              } else if (res.cancel) {
                //如果用户点击了取消按钮
                uni.showToast({
                  title: '您拒绝了授权',
                  icon: 'error',
                  duration: 2000
                });
                return;
              }
            }
          })
        })
      },
      /**
       * 前往用户设置界面
       */
      onHandleGoPageUserSet() {
        uni.navigateTo({
          url: `/pages/set/set`
        })
      },
      logout() {

        uni.showModal({
          title: '提示',
          content: '确定退出登录？',
          success: (res) => {
            if (res.confirm) {
              this.$store.dispatch(
                "userInfo/clearUserInfo");
              this.isLogin = false
              this.userInfo = {
                avatar: avatarUrl,
                nickName: ''
              } //用户信息
            } else if (res.cancel) {}
          }
        });

      },
      onHandleToChartsPage(){
      	uni.navigateTo({
      		url: '/pages/chartsPage/chartsPage',
      	})
      },
      onHandleToHistoryPage() {
        uni.navigateTo({
        	url: '/pages/historyPage/historyPage',
        })
      }
    },
  }
</script>

<style lang="scss">
  .wx-login {
    width: 100%;
    position: relative;
  }

  .unlogin-user-avatar {
    width: 300rpx;
    height: 300rpx;
    border-radius: 50%;
    position: absolute;
    top: 30rpx;
    left: calc(50% - 150rpx);
  }

  .login-button {
    width: 70vw;
    font-size: 20px;
    position: absolute;
    top: 850rpx;
    left: 50%;
    transform: translateX(-50%);
  }

  .wx-logined {
    padding: 30rpx 40rpx 0 40rpx;

    .header {
      display: flex;
      flex-direction: row-reverse;
      justify-content: space-between;
      align-items: center;

      .set {}

      .user-info {
        display: flex;
        align-items: center;

        &-avatar {
          width: 150rpx;
          height: 150rpx;
          border-radius: 50%;
          margin-right: 30rpx;

          &__img {
            width: 100%;
            height: 100%;
          }
        }

      }
    }


    .charts {
      margin-top: 30rpx;
    }
    
    .content {
    	margin-top: 30px;
    	/* padding-left: 20px; */
    }
    
    .item {
    	height: 100rpx;
    	line-height: 100rpx;
    	width: 100%;
    	display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #dfdfdf;
    }
  }
</style>