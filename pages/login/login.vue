<template>
  <view class="container">
    <!-- 未登录显示微信登录 -->
    <view class="wx-login" v-if="!isLogin">
      <view class="login-container">
        <image :src="userInfo.avatar" class="unlogin-user-avatar" />
        <button :disabled="isLoginLoading" type="primary" @click="wxLogin" class="login-button">
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
            <u-avatar :src="userInfo.avatar" class="user-info-avatar__img" size="75" @click="onPreviewImage(userInfo.avatar)" />
          </view>
          <view class="user-info-content">
            <view class="user-info-name">{{ userInfo.nickName }}</view>
            <view class="user-info-tags">
              <view class="user-info-tag user-info-role">{{ userInfo.roleName }}</view>
              <view
                class="user-info-tag user-info-gender"
                :class="{ male: userInfo.gender === 1, female: userInfo.gender === 2, unknown: userInfo.gender === 0 }"
              >
                {{ userInfo.gender === 1 ? "男" : userInfo.gender === 2 ? "女" : "未知" }}
              </view>
            </view>
          </view>
        </view>
        <view class="set">
          <view class="set-set" @click="onHandleGoPage('/other/set/set')">
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
            <view class="menu-item" v-if="userInfo.roleLevel === 0" @click="onHandleGoPage('/other/role/role')">
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
      <u-picker
        :show="summarizeTimePickerShow"
        ref="uPicker"
        title="请选择总结时间"
        :columns="summarizeTimeColumns"
        @confirm="onSummarizeTimePickerConfirm"
        @cancel="summarizeTimePickerShow = false"
        confirmColor="#4a90e2"
      />
    </view>

    <!-- 自定义导航 -->
    <custom-tab />
  </view>
</template>

<script>
import avatarUrl from "@/static/img/default_avatar.jpg";
import { userGetInfo, userGetList, userLogin, userLoginCode } from "@/api/user";
import { navigateToSubPage, navigateTo, buildQueryString } from "@/utils/navigator.js";

export default {
  data() {
    return {
      /** 用户唯一标识 */
      openId: "",
      /** 用户是否登录 */
      isLogin: false,
      /** 用户信息 */
      userInfo: {
        avatar: avatarUrl,
        nickName: "",
        roleLevel: 1,
        roleId: "",
        roleName: "",
        functionList: [],
        gender: 0,
      },
      /** 用户列表（管理员切换账号用） */
      personArr: [],
      /** 用户列表选择索引 */
      index: 0,
      /** 总结时间选择列数据 */
      summarizeTimeColumns: [[], []],
      /** 总结时间选择器是否显示 */
      summarizeTimePickerShow: false,
      /** 小程序信息 */
      appInfo: {
        appid: "",
        secret: "",
      },
      /** 数据统计菜单配置 */
      dataStatistics: [
        {
          name: "拉屎分析",
          icon: require("@/static/img/mine/趋势.png"),
          pagePath: "/other/thing-month-chart/thing-month-chart",
          key: "thing-month-chart",
          isGoPage: true,
        },
        {
          name: "拉屎记录",
          icon: require("@/static/img/mine/日历.png"),
          pagePath: "/other/thing-history/thing-history",
          key: "thing-history",
          isGoPage: true,
        },
        {
          name: "体重记录",
          icon: require("@/static/img/mine/weight.png"),
          pagePath: "/other/weight-history/weight-history",
          key: "weight-history",
          isGoPage: true,
        },
        {
          name: "体重分析",
          icon: require("@/static/img/mine/身高体重分布.png"),
          pagePath: "/other/weight-chart/weight-chart",
          key: "weight-chart",
          isGoPage: true,
        },
        {
          name: "做题分析",
          icon: require("@/static/img/mine/数据分析.png"),
          pagePath: "/other/problemMonthChart/problemMonthChart",
          key: "problemMonthChart",
          isGoPage: true,
        },
      ],
      /** 社交功能菜单配置 */
      socialize: [
        {
          name: "位置共享",
          icon: require("@/static/img/mine/地图.png"),
          pagePath: "/other/map/map",
          key: "map",
          isGoPage: true,
        },
        {
          name: "想说的话",
          icon: require("@/static/img/mine/想说的话.png"),
          pagePath: "/other/want-say/want-say",
          key: "want-say",
          isGoPage: true,
        },
      ],
      /** 相册菜单配置 */
      photo: [
        {
          name: "照片墙",
          icon: require("@/static/img/mine/照片墙.png"),
          pagePath: "/other/photo-wall/photo-wall",
          key: "photo-wall",
          isGoPage: true,
        },
        {
          name: "图库",
          icon: require("@/static/img/mine/图库.png"),
          pagePath: "/other/photo-album/photo-album",
          key: "photo-album",
          isGoPage: true,
        },
      ],
      /** 工具菜单配置 */
      tool: [
        {
          name: "计时器",
          icon: require("@/static/img/mine/计时器.png"),
          pagePath: "/other/timeCount/timeCount",
          key: "timeCount",
          isGoPage: true,
        },
        {
          name: "角色管理",
          icon: require("@/static/img/mine/角色管理.png"),
          pagePath: "/other/user-role-set/user-role-set",
          key: "role",
          isGoPage: true,
        },
        {
          name: "通知管理",
          icon: require("@/static/img/mine/通知栏.png"),
          pagePath: "/other/noticePage/noticePage",
          key: "noticePage",
          isGoPage: true,
        },
        {
          name: "幸运转盘",
          icon: require("@/static/img/mine/转盘.png"),
          pagePath: "/other/lucky/lucky",
          key: "lucky",
          isGoPage: true,
        },
        {
          name: "年月总结",
          icon: require("@/static/img/mine/总结.png"),
          pagePath: "",
          key: "summarize",
          isGoPage: false,
          isHandler: true,
          onClick: () => (this.summarizeTimePickerShow = true),
        },
        {
          name: "拼豆图纸",
          icon: require("@/static/img/mine/蜡笔.png"),
          pagePath: "/other/perler-beads/perler-beads",
          key: "perlerBeads",
          isGoPage: true,
        },
      ],
      /** 是否正在登录加载中 */
      isLoginLoading: false,
    };
  },
  computed: {
    /** 根据用户权限过滤要展示的数据统计菜单 */
    showDataStatistics() {
      return this.dataStatistics.filter((item) => this.userInfo?.functionList?.includes(item.key));
    },
    /** 根据用户权限过滤要展示的社交功能菜单 */
    showSocialize() {
      return this.socialize.filter((item) => this.userInfo?.functionList?.includes(item.key));
    },
    /** 根据用户权限过滤要展示的相册菜单 */
    showPhoto() {
      return this.photo.filter((item) => this.userInfo?.functionList?.includes(item.key));
    },
    /** 根据用户权限过滤要展示的工具菜单 */
    showTool() {
      return this.tool.filter((item) => this.userInfo?.functionList?.includes(item.key));
    },
  },
  created() {
    this.initSummarizeTimeColumns();
  },
  onShow() {
    if (this.$store.state.userInfo?.userInfo?.openid) {
      this.initUserInfo();
      this.getUserList();
    }
  },
  methods: {
    /**
     * 初始化总结时间选择列数据
     */
    initSummarizeTimeColumns() {
      const currentYear = new Date().getFullYear();
      for (let i = 2024; i <= currentYear; i++) {
        this.summarizeTimeColumns[0][i - 2024] = String(i);
      }
      for (let i = 0; i < 12; i++) {
        this.summarizeTimeColumns[1][i] = String(i + 1);
      }
      this.summarizeTimeColumns[1].unshift("全部");
    },
    /**
     * 从store初始化用户信息到组件状态
     */
    initUserInfo() {
      const state = this.$store.state.userInfo?.userInfo;
      this.isLogin = true;
      this.openId = state.openid;
      this.userInfo.avatar = state.avatarUrl;
      this.userInfo.nickName = state.nickName;
      this.userInfo.roleLevel = state.roleLevel;
      this.userInfo.roleName = state.roleName;
      this.userInfo.functionList = state.functionList;
      this.userInfo.gender = state.gender;
    },
    /**
     * 获取微信登录code
     * @returns {Promise} 返回包含code的Promise
     */
    getCode() {
      return new Promise((resolve, reject) => {
        uni.login({
          provider: "weixin",
          success: (e) => resolve(e),
          fail: (err) => reject(new Error("获取code失败")),
        });
      });
    },
    /**
     * 微信登录流程
     */
    async wxLogin() {
      this.isLoginLoading = true;
      uni.showLoading({ title: "登录中..." });

      try {
        const { code } = await this.getCode();
        const res = await userLoginCode({ code, needOpenid: false });
        uni.hideLoading();
        this.isLoginLoading = false;
        this.openId = res.openid;

        uni.showModal({
          title: "温馨提示",
          content: "授权微信登录后才能正常使用小程序功能",
          success: (modalRes) => {
            if (modalRes.confirm) {
              this.handleUserAuth();
            } else {
              uni.showToast({ title: "您拒绝了授权", icon: "error", duration: 2000 });
            }
          },
        });
      } catch (err) {
        uni.hideLoading();
        this.isLoginLoading = false;
      }
    },
    /**
     * 处理用户授权获取信息
     */
    handleUserAuth() {
      uni.showLoading({ title: "登录中..." });
      uni.getUserProfile({
        desc: "获取你的昵称、头像",
        success: (res) => {
          res.rawData = JSON.parse(res.rawData);
          userLogin({
            ...res.userInfo,
            openid: this.openId,
            roleId: "683519c1eef9cbdc977b35b7",
            needOpenid: false
          })
            .then(() => {
              uni.showToast({ title: "登录成功", icon: "success", duration: 2000 });
              return userGetInfo({ openid: this.openId });
            })
            .then((res) => {
              this.$store.dispatch("userInfo/updateUserInfo", res);
              this.isLogin = true;
              this.initUserInfo();
              this.getUserList();
              uni.switchTab({ url: "/pages/index/index" });
              this.$store.dispatch("tabbar/setTabIndex", 0);
            })
            .catch((e) => {
              uni.showToast({ title: "登陆失败", icon: "error", duration: 2000 });
            })
            .finally(() => {
              uni.hideLoading();
            });
        },
        fail: () => {
          uni.hideLoading();
          uni.showToast({ title: "拒绝授权", icon: "error", duration: 2000 });
        },
      });
    },
    /**
     * 预览头像大图
     * @param {string} data - 图片地址
     */
    onPreviewImage(data) {
      if (data) {
        uni.previewImage({ current: data, urls: [data] });
      }
    },
    /**
     * 前往指定页面
     * @param {string} path - 页面路径
     */
    onHandleGoPage(path) {
      uni.navigateTo({ url: path });
    },
    /**
     * 获取用户列表（管理员功能）
     */
    getUserList() {
      if (this.userInfo.roleLevel === 0) {
        userGetList({ type: "list" }).then((res) => {
          this.personArr = res;
        });
      } else {
        this.personArr = [];
      }
    },
    /**
     * 切换用户账号
     * @param {Object} val - 选择器返回值
     */
    onUserChange(val) {
      const index = val.detail.value;
      this.$store.dispatch("userInfo/updateUserInfo", this.personArr[index]);
      this.initUserInfo();
      this.getUserList();
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
              roleLevel: 1,
              roleId: "",
              roleName: "",
              functionList: [],
              gender: 0,
            };
            this.$store.dispatch("tabbar/setTabIndex", 2);
            this.$store.dispatch("tabbar/setTabNumber", 3);
            this.$forceUpdate();
          }
        },
      });
    },
    /**
     * 根据菜单配置前往指定页面
     * @param {Object} pageSet - 页面配置信息
     */
    onHandleGoToPage(pageSet) {
      if (pageSet.isGoPage) {
        uni.navigateTo({ url: pageSet.pagePath });
      }
      if (pageSet.isHandler) {
        pageSet.onClick();
      }
    },
    /**
     * 总结时间选择确认回调
     * @param {Object} e - 选择器返回值
     */
    onSummarizeTimePickerConfirm(e) {
      let date = {};
      let type = "year";

      const [year, month] = e.value;
      if (month === "全部") {
        date = { year };
        type = "year";
      } else {
        date = { year, month };
        type = "month";
      }

      this.summarizeTimePickerShow = false;
      navigateToSubPage('summarize', { type, date: JSON.stringify(date) });
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
