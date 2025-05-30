<template>
  <view class="container">
    <!-- 未登录显示微信登录 -->
    <view class="wx-login" v-if="!isLogin && isGetAppInfo">
      <view class="login-container">
        <image :src="userInfo.avatar" class="unlogin-user-avatar" />
        <button type="primary" @click="wxLogin" class="login-button">
          微信登录
        </button>
      </view>
    </view>

    <!-- 登录完成 -->
    <view class="wx-logined" v-if="isLogin">
      <!-- 头部个人信息 -->
      <view class="header">
        <view class="user-info">
          <view class="user-info-avatar" @click="onPreviewImage(userInfo.avatar)">
            <u-avatar :src="userInfo.avatar" class="user-info-avatar__img" size="75"
              @click="onPreviewImage(userInfo.avatar)" />
          </view>
          <view class="user-info-content">
            <view class="user-info-name">{{ userInfo.nickName }}</view>
            <view class="user-info-tags">
              <view class="user-info-tag user-info-role">{{ userInfo.roleName }}</view>
              <view class="user-info-tag user-info-gender"
                :class="{ 'male': userInfo.gender === 1, 'female': userInfo.gender === 2, 'unknown': userInfo.gender === 0 }">
                {{ userInfo.gender === 1 ? '男' : userInfo.gender === 2 ? '女' : '未知' }}
              </view>
            </view>
          </view>
        </view>
        <view class="set">
          <view class="set-set" @click="onHandleGoPage('/pages/set/set')">
            <u-icon name="setting-fill" size="25" color="#4a90e2" />
          </view>
        </view>
      </view>

      <!-- 功能区域 -->
      <view class="content">
        <!-- 数据统计模块 -->
        <view class="menu-section" v-if="showDataStatistics.length > 0">
          <view class="section-title">数据统计</view>
          <view class="menu-grid">
            <view class="menu-item" v-for="item in showDataStatistics" :key="item.name" @click="onHandleGoToPage(item)">
              <image :src="item.icon" class="menu-item__icon" />
              <text class="menu-item__text">{{ item.name }}</text>
            </view>
          </view>
        </view>

        <!-- 社交功能模块 -->
        <view class="menu-section" v-if="showSocialize.length > 0">
          <view class="section-title">社交功能</view>
          <view class="menu-grid">
            <view class="menu-item" v-for="item in showSocialize" :key="item.name" @click="onHandleGoToPage(item)">
              <image :src="item.icon" class="menu-item__icon" />
              <text class="menu-item__text">{{ item.name }}</text>
            </view>
          </view>
        </view>


        <!-- 相册模块 -->
        <view class="menu-section" v-if="showPhoto.length > 0">
          <view class="section-title">相册管理</view>
          <view class="menu-grid">
            <view class="menu-item" v-for="item in showPhoto" :key="item.name" @click="onHandleGoToPage(item)">
              <image :src="item.icon" class="menu-item__icon" />
              <text class="menu-item__text">{{ item.name }}</text>
            </view>
          </view>
        </view>

        <!-- 其他工具模块 -->
        <view class="menu-section">
          <view class="section-title">其他功能</view>
          <view class="menu-grid">
            <view class="menu-item" v-for="item in showTool" :key="item.name" @click="onHandleGoToPage(item)">
              <image :src="item.icon" class="menu-item__icon" />
              <text class="menu-item__text">{{ item.name }}</text>
            </view>
            <view class="menu-item" v-if="userInfo.roleLevel === 0"
              @click="onHandleGoPage('/subPackages/user-role-set/user-role-set')">
              <image src="@/static/img/mine/权限管理.png" class="menu-item__icon" />
              <text class="menu-item__text">权限管理</text>
            </view>
            <view class="menu-item" v-if="personArr.length > 0 && userInfo.roleLevel === 0">
              <picker @change="onUserChange" mode="selector" range-key="nickName" :value="index" :range="personArr">
                <image src="@/static/img/mine/切换账号.png" class="menu-item__icon" />
              </picker>
              <text class="menu-item__text">切换账号</text>
            </view>
            <view class="menu-item" @click="logout">
              <image src="@/static/img/mine/退出登录.png" class="menu-item__icon" />
              <text class="menu-item__text">退出登录</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 年(月)度总结时间选择 -->
      <u-picker :show="summarizeTimePickerShow" ref="uPicker" title="请选择总结时间" :columns="summarizeTimeColumns"
        @confirm="onSummarizeTimePickerConfirm" @cancel="summarizeTimePickerShow = false" confirmColor="#4a90e2" />
    </view>

    <!-- 自定义导航 -->
    <custom-tab />
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
        roleLevel: 1,
        roleId: '',
        roleName: '',
        functionList: [],
        gender: 0  // 添加性别字段：0-未知，1-男，2-女
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
      // 数据统计
      dataStatistics: [{
        name: '拉屎分析',
        icon: require('@/static/img/mine/趋势.png'),
        // icon: 'https://mp-47222cf8-47ac-4463-a5d0-2a8b8cb4b608.cdn.bspapp.com/system/趋势.png',
        pagePath: '/pages/thing-month-chart/thing-month-chart',
        key: 'thing-month-chart',
        isGoPage: true
      },
      {
        name: '拉屎记录',
        icon: require('@/static/img/mine/日历.png'),
        // icon: 'https://mp-47222cf8-47ac-4463-a5d0-2a8b8cb4b608.cdn.bspapp.com/system/日历.png',
        pagePath: '/pages/thing-history/thing-history',
        key: 'thing-history',
        isGoPage: true
      },
      {
        name: '体重记录',
        icon: require('@/static/img/mine/weight.png'),
        // icon: 'https://mp-47222cf8-47ac-4463-a5d0-2a8b8cb4b608.cdn.bspapp.com/system/weight.png',
        pagePath: '/subPackages/weight-history/weight-history',
        key: 'weight-history',
        isGoPage: true
      },
      {
        name: '体重分析',
        icon: require('@/static/img/mine/身高体重分布.png'),
        // icon: 'https://mp-47222cf8-47ac-4463-a5d0-2a8b8cb4b608.cdn.bspapp.com/system/身高体重分布.png',
        pagePath: '/subPackages/weight-chart/weight-chart',
        key: 'weight-chart',
        isGoPage: true
      },
      {
        name: '做题分析',
        icon: require('@/static/img/mine/数据分析.png'),
        // icon: 'https://mp-47222cf8-47ac-4463-a5d0-2a8b8cb4b608.cdn.bspapp.com/system/数据分析.png',
        pagePath: '/pages/problemMonthChart/problemMonthChart',
        key: 'problemMonthChart',
        isGoPage: true
      },
      ],
      // 社交
      socialize: [
        {
          name: '位置共享',
          icon: require('@/static/img/mine/地图.png'),
          // icon: 'https://mp-47222cf8-47ac-4463-a5d0-2a8b8cb4b608.cdn.bspapp.com/system/地图.png',
          pagePath: '/pages/map/map',
          key: 'map',
          isGoPage: true
        },
        {
          name: '想说的话',
          icon: require('@/static/img/mine/想说的话.png'),
          // icon: 'https://mp-47222cf8-47ac-4463-a5d0-2a8b8cb4b608.cdn.bspapp.com/system/想说的话.png',
          pagePath: '/pages/want-say/want-say',
          key: 'want-say',
          isGoPage: true
        }
      ],
      // 相册
      photo: [
        {
          name: '照片墙',
          icon: require('@/static/img/mine/照片墙.png'),
          // icon: 'https://mp-47222cf8-47ac-4463-a5d0-2a8b8cb4b608.cdn.bspapp.com/system/照片墙.png',
          pagePath: '/subPackages/photo-wall/photo-wall',
          key: 'photo-wall',
          isGoPage: true
        },
        {
          name: '图库',
          icon: require('@/static/img/mine/图库.png'),
          // icon: 'https://mp-47222cf8-47ac-4463-a5d0-2a8b8cb4b608.cdn.bspapp.com/system/图库.png',
          pagePath: '/subPackages/photo-album/photo-album',
          key: 'photo-album',
          isGoPage: true
        }
      ],
      // 工具
      tool: [{
        name: '计时器',
        icon: require('@/static/img/mine/计时器.png'),
        // icon: 'https://mp-47222cf8-47ac-4463-a5d0-2a8b8cb4b608.cdn.bspapp.com/system/计时器.png',
        pagePath: '/pages/timeCount/timeCount',
        key: 'timeCount',
        isGoPage: true
      },
      {
        name: '通知管理',
        icon: require('@/static/img/mine/通知栏.png'),
        // icon: 'https://mp-47222cf8-47ac-4463-a5d0-2a8b8cb4b608.cdn.bspapp.com/system/通知栏.png',
        pagePath: '/pages/noticePage/noticePage',
        key: 'noticePage',
        isGoPage: true
      },
      {
        name: '幸运转盘',
        icon: require('@/static/img/mine/转盘.png'),
        // icon: 'https://mp-47222cf8-47ac-4463-a5d0-2a8b8cb4b608.cdn.bspapp.com/system/转盘.png',
        pagePath: '/pages/lucky/lucky',
        key: 'lucky',
        isGoPage: true
      },
      {
        name: '年月总结',
        icon: require('@/static/img/mine/总结.png'),
        // icon: 'https://mp-47222cf8-47ac-4463-a5d0-2a8b8cb4b608.cdn.bspapp.com/system/总结.png',
        pagePath: '',
        key: 'summarize',
        isGoPage: false,
        isHandler: true,
        onClick: () => this.summarizeTimePickerShow = true
      }
      ]
    };
  },
  computed: {
    // 要展示的数据统计
    showDataStatistics() {
      return this.dataStatistics.filter(item => this.userInfo?.functionList?.includes(item.key))
    },
    // 要展示的社交
    showSocialize() {
      return this.socialize.filter(item => this.userInfo?.functionList?.includes(item.key))
    },
    // 要展示的相册
    showPhoto() {
      return this.photo.filter(item => this.userInfo?.functionList?.includes(item.key))
    },
    // 要展示的工具
    showTool() {
      return this.tool.filter(item => this.userInfo?.functionList?.includes(item.key))
    }
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
      this.userInfo.roleName = state.roleName;
      this.userInfo.functionList = state.functionList;
      this.userInfo.gender = state.gender

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
                      roleId: '683519c1eef9cbdc977b35b7',
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
                        this.userInfo.nickName = this.$store.state.userInfo.userInfo.nickName;
                        this.userInfo.avatar = this.$store.state.userInfo.userInfo.avatarUrl;
                        this.userInfo.openid = this.$store.state.userInfo.userInfo.openid;
                        this.userInfo.roleLevel = this.$store.state.userInfo.userInfo.roleLevel;
                        this.userInfo.roleName = this.$store.state.userInfo.userInfo.roleName;
                        this.userInfo.functionList = this.$store.state.userInfo.userInfo.functionList;
                        this.userInfo.gender = this.$store.state.userInfo.userInfo.gender || 0; // 添加性别
                        // 获取用户列表
                        this.getUserList()
                        uni.switchTab({
                          url: "/pages/index/index",
                        });
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
     * 前往指定页面
     * @param path 
     */
    onHandleGoPage(path) {
      uni.navigateTo({
        url: path,
      });
    },

    /**
     * 获取用户列表
     */
    getUserList() {
      if (this.userInfo.roleLevel === 0) {
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
      this.userInfo.gender = this.$store.state.userInfo.userInfo.gender || 0
      this.userInfo.roleName = this.$store.state.userInfo.userInfo.roleName;
      this.userInfo.functionList = this.$store.state.userInfo.userInfo.functionList;

      this.getUserList()
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
            this.$store.dispatch('tabbar/setTabIndex', 0);

            this.isLogin = false;
            this.userInfo = {
              avatar: avatarUrl,
              nickName: "",
              roleLevel: 1,
              roleId: '',
              roleName: '',
              functionList: [],
              gender: 0  // 添加性别字段：0-未知，1-男，2-女
            }; //用户信息

            uniCloud.callFunction({
              name: 'user_app_info',
              success: (res) => {
                this.appInfo = res.result.data;
                this.isGetAppInfo = true
              }
            })
            this.$forceUpdate()
          } else if (res.cancel) {
          }
        },
      });
    },
    /**
     * 前往指定页面
     * @param pageSet 页面信息
     */
    onHandleGoToPage(pageSet) {
      if (pageSet.isGoPage) {
        uni.navigateTo({
          url: pageSet.pagePath,
        });
      }
      if (pageSet.isHandler) {
        pageSet.onClick()
      }
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
.container {
  min-height: 100vh;
  background-color: #f8f8f8;
}

.wx-login {
  width: 100%;
  height: 100vh;
  background: linear-gradient(to bottom, #4a90e2, #87ceeb);

  .login-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  .unlogin-user-avatar {
    width: 240rpx;
    height: 240rpx;
    border-radius: 50%;
    border: 8rpx solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.1);
    margin-bottom: 60rpx;
  }

  .login-button {
    width: 600rpx;
    height: 88rpx;
    line-height: 88rpx;
    border-radius: 44rpx;
    font-size: 32rpx;
    background: #ffffff;
    color: #4a90e2;
    box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.1);
  }
}

.wx-logined {
  padding: 30rpx;

  .header {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border-radius: 20rpx;
    padding: 40rpx;
    margin-bottom: 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);

    .user-info {
      display: flex;
      align-items: center;

      &-avatar {
        position: relative;
        margin-right: 30rpx;

        &__img {
          border: 4rpx solid #4a90e2;
          border-radius: 50%;
          transition: transform 0.3s ease;

          &:active {
            transform: scale(0.95);
          }
        }

        &__border {
          position: absolute;
          top: -6rpx;
          left: -6rpx;
          right: -6rpx;
          bottom: -6rpx;
          border: 2rpx solid rgba(74, 144, 226, 0.3);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
      }

      &-content {
        display: flex;
        flex-direction: column;
        gap: 8rpx;
      }

      &-name {
        font-size: 36rpx;
        font-weight: 600;
        color: #333333;
        line-height: 1.4;
      }

      &-role {
        font-size: 24rpx;
        color: #666666;
        background: rgba(74, 144, 226, 0.1);
        padding: 4rpx 16rpx;
        border-radius: 20rpx;
        display: inline-block;
      }
    }

    .set {
      &-set {
        padding: 16rpx;
        border-radius: 50%;
        background: rgba(74, 144, 226, 0.1);
        transition: all 0.3s ease;

        &:active {
          transform: scale(0.9);
          background: rgba(74, 144, 226, 0.2);
        }
      }
    }
  }

  .menu-section {
    background: #ffffff;
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 30rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

    .section-title {
      font-size: 32rpx;
      font-weight: 700;
      color: #333333;
      margin-bottom: 36rpx;
      padding-left: 20rpx;
      border-left: 8rpx solid #d81e06;
    }

    .menu-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 30rpx;
    }

    picker {
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: all 0.3s ease;

      .menu-item__icon {
        margin-bottom: 10rpx !important;
      }
    }

    .menu-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20rpx;
      border-radius: 16rpx;
      transition: all 0.3s ease;

      &:active {
        transform: scale(0.95);
        background-color: #f5f5f5;
      }

      &__icon {
        width: 80rpx;
        height: 80rpx;
        margin-bottom: 16rpx;
      }

      &__text {
        font-size: 24rpx;
        color: #666666;
        text-align: center;
        word-break: keep-all;
      }
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }

    50% {
      transform: scale(1.1);
      opacity: 0.5;
    }

    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
}

.user-info {
  &-tags {
    display: flex;
    align-items: center;
    gap: 12rpx;
    margin-top: 8rpx;
  }

  &-tag {
    height: 36rpx;
    line-height: 36rpx;
    font-size: 24rpx;
    padding: 4rpx 16rpx;
    border-radius: 20rpx;
    display: inline-block;
  }

  &-role {
    color: #4a90e2;
    background: rgba(74, 144, 226, 0.1);
  }

  &-gender {
    &.male {
      color: #4a90e2;
      background: rgba(74, 144, 226, 0.1);
    }

    &.female {
      color: #e2574a;
      background: rgba(226, 87, 74, 0.1);
    }

    &.unknown {
      color: #333;
      background: rgba(10, 1, 0, 0.1);
    }
  }
}
</style>