<template>
  <view>
    <!-- 未登录显示微信登录 -->
    <view class="wx-login" v-if="!isLogin && isGetAppInfo">
      <image :src="userInfo.avatar" class="unlogin-user-avatar" />
      <button type="primary" @click="wxLogin" class="login-button">
        微信登录
      </button>
    </view>
    <!-- 登录完成 -->
    <view class="wx-logined" v-if="isLogin">
      <view class="header">
        <view class="set">
          <view class="set-set">
            <u-icon name="setting-fill" size="25" @click="onHandleGoPageUserSet" />
          </view>
        </view>
        <!-- 头部个人信息 -->
        <view class="user-info">
          <view class="user-info-avatar">
            <u-avatar :src="userInfo.avatar" class="user-info-avatar__img" size="75"
              @click="onPreviewImage(userInfo.avatar)" />
          </view>
          <view class="user-info-name">
            {{ userInfo.nickName }}
          </view>
        </view>
      </view>
      <view class="content">
        <!-- 最近七天变化趋势 -->
        <view class="history item" @click="onHandleToChartsPage">
          <view class="item-left">
            <image src="https://mp-47222cf8-47ac-4463-a5d0-2a8b8cb4b608.cdn.bspapp.com/system/趋势.png" class="item-left__icon" />
            <view class="select-item">拉粑粑最近30天变化趋势</view>
          </view>
          <uni-icons type="forward" color="#939188" size="20" class="load-to-page" />
        </view>
        <!-- 拉粑粑历史记录 -->
        <view class="chat item" @click="onHandleToHistoryPage">
          <view class="item-left">
            <image src="https://mp-47222cf8-47ac-4463-a5d0-2a8b8cb4b608.cdn.bspapp.com/system/日历.png" class="item-left__icon" />
            <view class="select-item chat-item">拉粑粑历史记录</view>
          </view>
          <uni-icons type="forward" color="#939188" size="20" class="load-to-page" />
        </view>
        <!-- 体重历史记录 -->
        <view class="chat item" @click="onHandleToWeightHistoryPage">
          <view class="item-left">
            <image src="https://mp-47222cf8-47ac-4463-a5d0-2a8b8cb4b608.cdn.bspapp.com/system/weight.png" class="item-left__icon" />
            <view class="select-item chat-item">体重历史记录</view>
          </view>
          <uni-icons type="forward" color="#939188" size="20" class="load-to-page" />
        </view>
        <!-- 体重变化趋势 -->
        <view class="chat item" @click="onHandleToWeightChartPage">
          <view class="item-left">
            <image src="https://mp-47222cf8-47ac-4463-a5d0-2a8b8cb4b608.cdn.bspapp.com/system/身高体重分布.png" class="item-left__icon" />
            <view class="select-item chat-item">体重变化趋势</view>
          </view>
          <uni-icons type="forward" color="#939188" size="20" class="load-to-page" />
        </view>
        <!-- 做题分析 -->
        <view class="chat item" @click="onHandleToProblemChartPage">
          <view class="item-left">
            <image src="https://mp-47222cf8-47ac-4463-a5d0-2a8b8cb4b608.cdn.bspapp.com/system/数据分析.png" class="item-left__icon" />
            <view class="select-item chat-item">做题分析（正确率统计）</view>
          </view>
          <uni-icons type="forward" color="#939188" size="20" class="load-to-page" />
        </view>
        <!-- 计时器 -->
        <view class="chat item" @click="onHandleToTimeCountPage">
          <view class="item-left">
            <image src="https://mp-47222cf8-47ac-4463-a5d0-2a8b8cb4b608.cdn.bspapp.com/system/计时器.png" class="item-left__icon" />
            <view class="select-item chat-item">计时器</view>
          </view>
          <uni-icons type="forward" color="#939188" size="20" class="load-to-page" />
        </view>
        <!-- 位置共享 -->
        <view class="chat item" @click="onHandleToMapPage">
          <view class="item-left">
            <image src="https://mp-47222cf8-47ac-4463-a5d0-2a8b8cb4b608.cdn.bspapp.com/system/地图.png" class="item-left__icon" />
            <view class="select-item chat-item">位置共享</view>
          </view>
          <uni-icons type="forward" color="#939188" size="20" class="load-to-page" />
        </view>
        <!-- 通知栏管理 -->
        <view class="chat item" @click="onHandleToNoticePage">
          <view class="item-left">
            <image src="https://mp-47222cf8-47ac-4463-a5d0-2a8b8cb4b608.cdn.bspapp.com/system/通知栏.png" class="item-left__icon" />
            <view class="select-item chat-item">通知栏管理</view>
          </view>
          <uni-icons type="forward" color="#939188" size="20" class="load-to-page" />
        </view>
        <!-- 照片墙 -->
        <view class="chat item" @click="onHandleToPhotoPage">
          <view class="item-left">
            <image src="https://mp-47222cf8-47ac-4463-a5d0-2a8b8cb4b608.cdn.bspapp.com/system/照片墙.png" class="item-left__icon" />
            <view class="select-item chat-item">照片墙</view>
          </view>
          <uni-icons type="forward" color="#939188" size="20" class="load-to-page" />
        </view>
        <!-- 想说的话 -->
        <view class="chat item" @click="onHandleToWantSayPage">
          <view class="item-left">
            <image src="https://mp-47222cf8-47ac-4463-a5d0-2a8b8cb4b608.cdn.bspapp.com/system/想说的话.png" class="item-left__icon" />
            <view class="select-item chat-item">想说的话</view>
          </view>
          <uni-icons type="forward" color="#939188" size="20" class="load-to-page" />
        </view>
        <!-- 选择转盘 -->
        <view class="chat item" @click="onHandleToLuckyPage">
          <view class="item-left">
            <image src="https://mp-47222cf8-47ac-4463-a5d0-2a8b8cb4b608.cdn.bspapp.com/system/转盘.png" class="item-left__icon" />
            <view class="select-item chat-item">幸运转盘</view>
          </view>
          <uni-icons type="forward" color="#939188" size="20" class="load-to-page" />
        </view>
        <!-- 年(月)度总结 -->
        <view class="chat item" @click="summarizeTimePickerShow = true">
          <view class="item-left">
            <image src="https://mp-47222cf8-47ac-4463-a5d0-2a8b8cb4b608.cdn.bspapp.com/system/总结.png" class="item-left__icon" />
            <view class="select-item chat-item">年(月)度总结</view>
          </view>
          <uni-icons type="forward" color="#939188" size="20" class="load-to-page" />
        </view>
        <!-- 年(月)度总结时间选择 -->
        <u-picker :show="summarizeTimePickerShow" ref="uPicker" title="请选择总结时间" :columns="summarizeTimeColumns"
          @confirm="onSummarizeTimePickerConfirm" @cancel="summarizeTimePickerShow = false" confirmColor="#d81e06" />
        <!-- 切换账号 -->
        <view class="chat item" v-if="personArr.length > 0 && userInfo.roleLevel === 1">
          <picker @change="onUserChange" mode="selector" range-key="nickName" :value="index" :range="personArr">
            <view class="item-left">
              <image src="https://mp-47222cf8-47ac-4463-a5d0-2a8b8cb4b608.cdn.bspapp.com/system/切换账号.png" class="item-left__icon" />
              <view class="select-item user-item">切换账号</view>
            </view>
          </picker>
        </view>
      </view>
      <!--      <u-button-->
      <!--        text="退出登录"-->
      <!--        @click="logout"-->
      <!--        class="login-button"-->
      <!--        color="linear-gradient(to right, rgb(66, 83, 216), rgb(213, 51, 186))"-->
      <!--      />-->
    </view>
  </view>
</template>

<script>
import avatarUrl from "@/static/img/default_avatar.jpg";
import { userGetInfo, userGetList, userLogin } from '@/api/user';
export default {
  data() {
    return {
      // 唯一标识
      openId: "",
      // 用户是否登录
      isLogin: false,
      // 用户信息
      userInfo: {
        avatar: avatarUrl,
        nickName: "",
        roleLevel: 0
      },
      // 用户列表
      personArr: [],
      index: 0,
      // 总结时间选择
      summarizeTimeColumns: [[], []],
      // 总结时间选择器是否显示
      summarizeTimePickerShow: false,
      // 是否获取到了小程序信息
      isGetAppInfo: false,
      // 小程序信息
      appInfo: {
        appid: '',
        secret: ''
      }, 
    };
  },
  created() {
    // 初始化总结时间选择的选择时间
    const date = new Date();
    const currentYear = date.getFullYear();
    for (let i = 2024; i <= currentYear; i++) {
      this.summarizeTimeColumns[0][i - 2024] = String(i);
    }

    for (let i = 0; i < 12; i++) {
      this.summarizeTimeColumns[1][i] = String(i + 1);
    }
    this.summarizeTimeColumns[1].unshift("全部");
  },
  onShow() {
    if (this.$store.state.userInfo?.userInfo?.openid) {
      const state = this.$store.state.userInfo?.userInfo;
      this.isLogin = true;
      this.openId = state.openid;
      this.userInfo.avatar = state.avatarUrl;
      this.userInfo.nickName = state.nickName;
      this.userInfo.roleLevel = state.roleLevel;

      this.getUserList();
    }
    if (!this.isLogin) {
      uniCloud.callFunction({
        name: 'user_app_info',
        success: (res) => {
          this.appInfo = res.result.data;
          this.isGetAppInfo = true
        }
      })
    }
  },
  methods: {
    // 获取code
    getCode() {
      return new Promise((resolve, reject) => {
        uni.login({
          provider: "weixin",
          success: (e) => {
            resolve(e);
          },
          fail: (err) => {
            reject(new Error("获取code失败"));
          },
        });
      });
    },
    /**
     * 微信登录
     * @returns {Promise<void>}
     */
    async wxLogin() {
      const { code } = await this.getCode();
      uni
        .request({
          url: `https://api.weixin.qq.com/sns/jscode2session?appid=${this.appInfo.appid}&secret=${this.appInfo.secret}&js_code=${code}&grant_type=authorization_code`,
          method: "GET",
        })
        .then((res) => {
          this.openId = res.data.openid;
          uni.showModal({
            title: "温馨提示",
            content: "授权微信登录后才能正常使用小程序功能",
            success: (res) => {
              //如果用户点击了确定按钮
              if (res.confirm) {
                uni.showLoading({
                  title: "登录中...",
                });
                uni.getUserProfile({
                  desc: "获取你的昵称、头像",
                  success: (res) => {
                    res.rawData = JSON.parse(res.rawData); //将字符串转为对象
                    userLogin({
                      ...res.userInfo,
                      openid: this.openId,
                      roleLevel: 0,
                    }).then(() => {
                      uni.showToast({
                        title: "登录成功",
                        icon: "success",
                        duration: 2000,
                      });
                      // 获取用户信息
                      userGetInfo({ openid: this.openId }).then(res => {
                        this.$store.dispatch("userInfo/updateUserInfo", res);
                        // 修改登录状态
                        this.isLogin = true;
                        // 获取用户信息
                        // 获取登录用户信息
                        this.userInfo.nickName = this.$store.state.userInfo.userInfo.nickName;
                        this.userInfo.avatar = this.$store.state.userInfo.userInfo.avatarUrl;
                        this.userInfo.openid = this.$store.state.userInfo.userInfo.openid;
                        this.userInfo.roleLevel = this.$store.state.userInfo.userInfo.roleLevel;

                        // 获取用户列表
                        this.getUserList()
                      })

                    }).catch(() => {
                      //拒绝授权
                      uni.showToast({
                        title: "登陆失败",
                        icon: "error",
                        duration: 2000,
                      });
                    }).finally(() => {
                      uni.hideLoading();
                    })

                  },
                  fail: (res) => {
                    uni.hideLoading();
                    //拒绝授权
                    uni.showToast({
                      title: "拒绝授权",
                      icon: "error",
                      duration: 2000,
                    });
                  },
                });
              } else if (res.cancel) {
                //如果用户点击了取消按钮
                uni.showToast({
                  title: "您拒绝了授权",
                  icon: "error",
                  duration: 2000,
                });
              }
            },
          });
        });
    },
    /**
     * 预览头像
     * @param {Object} data
     */
    onPreviewImage(data) {
      if (data) {
        uni.previewImage({
          current: data,
          urls: [data],
        });
      }
    },
    /**
     * 前往用户设置界面
     */
    onHandleGoPageUserSet() {
      uni.navigateTo({
        url: `/pages/set/set`,
      });
    },
    /**
     * 获取用户列表
     */
    getUserList() {
      if (this.userInfo.roleLevel === 1) {
        userGetList({
          type: "list",
        }).then(res => {
          this.personArr = res
        })
      } else {
        this.personArr = []
      }

    },
    /**
     * 切换用户
     * @param val
     */
    onUserChange(val) {
      const index = val.detail.value;
      this.$store.dispatch("userInfo/updateUserInfo", this.personArr[index]);
      // 获取用户信息
      this.userInfo.nickName = this.$store.state.userInfo.userInfo.nickName;
      this.userInfo.avatar = this.$store.state.userInfo.userInfo.avatarUrl;
      this.userInfo.openid = this.$store.state.userInfo.userInfo.openid;
      this.userInfo.roleLevel = this.$store.state.userInfo.userInfo.roleLevel;
    },
    /**
     * 退出登录
     */
    logout() {
      uni.showModal({
        title: "提示",
        content: "确定退出登录？",
        success: (res) => {
          if (res.confirm) {
            this.$store.dispatch("userInfo/clearUserInfo");
            this.isLogin = false;
            this.userInfo = {
              avatar: avatarUrl,
              nickName: "",
              roleLevel: 0
            }; //用户信息
          } else if (res.cancel) {
          }
        },
      });
    },
    // 前往最近30天粑粑统计页面
    onHandleToChartsPage() {
      uni.navigateTo({
        url: "/pages/thing-month-chart/thing-month-chart",
      });
    },
    //
    onHandleToHistoryPage() {
      uni.navigateTo({
        url: "/pages/thing-history/thing-history",
      });
    },
    onHandleToWeightHistoryPage() {
      uni.navigateTo({
        url: "/subPackages/weight-history/weight-history",
      });
    },
    onHandleToWeightChartPage() {
      uni.navigateTo({
        url: "/subPackages/weight-chart/weight-chart",
      });
    },
    onHandleToProblemChartPage() {
      uni.navigateTo({
        url: "/pages/problemMonthChart/problemMonthChart",
      });
    },
    onHandleToTimeCountPage() {
      uni.navigateTo({
        url: "/pages/timeCount/timeCount",
      });
    },
    onHandleToMapPage() {
      uni.navigateTo({
        url: "/pages/map/map",
      });
    },
    onHandleToNoticePage() {
      uni.navigateTo({
        url: "/pages/noticePage/noticePage",
      });
    },
    onHandleToWantSayPage() {
      uni.navigateTo({
        url: "/pages/want-say/want-say",
      });
    },
    onHandleToLuckyPage() {
      uni.navigateTo({
        url: "/pages/lucky/lucky",
      });
    },
    onHandleToPhotoPage() {
      uni.navigateTo({
        url: "/pages/photo-album/photo-album",
      });
    },
    /**
     * 总结时间选择确认
     * @param {Object} e
     */
    onSummarizeTimePickerConfirm(e) {
      // 要传递给总结页面的参数
      let date = {};
      let type = "year";

      const [year, month] = e.value;
      if (month === "全部") {
        date = {
          year: year,
        };
        type = "year";
      } else {
        date = {
          year: year,
          month: month,
        };
        type = "month";
      }

      this.summarizeTimePickerShow = false;

      // 前往总结页
      uni.navigateTo({
        url: `/subPackages/summarize/summarize?type=${type}&date=${JSON.stringify(date)}`,
      });
    },
  },
};
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

    .set {
      display: flex;
      align-items: center;

      &-set {
        margin-right: 30rpx;
      }
    }

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

    .user-item {
      width: 1000px;
      overflow: hidden;
    }

    &-left {
      display: flex;
      align-items: center;
      justify-content: flex-start;

      &__icon {
        width: 60rpx;
        height: 60rpx;
        margin-right: 20rpx;
      }
    }
  }
}
</style>
