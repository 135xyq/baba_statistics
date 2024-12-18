<template>
  <view class="container">
    <u-subsection :list="tabList" :current="currentTab" mode="subsection" @change="onTabChange" activeColor="#d81e06"
      inactiveColor="#7A7E83" />
    <view class="loading" v-if="isLoading">
      <u-loading-icon color="#d81e06" textColor="#d81e06" vertical text="努力加载中..."></u-loading-icon>
    </view>
    <view v-else>
      <view v-if="list.length > 0" class="list">
        <uni-card v-for="item in list" :key="item._id" :title="item.toUserName" :extra="item.createTime" :thumbnail="item.avatarUrl">
          <template v-slot:title>
            <view class="card-title">
              <view class="left">
                <u-avatar :src="currentTab === 0 ? item.toUserAvatarUrl : item.avatarUrl" size="40" />
                <view class="left-info">
                  <view class="left-info__name">{{currentTab === 0 ? item.toUserNickName : item.nickName}}</view>
                  <view class="left-info__date">{{item.createTime}}</view>
                </view>
              </view>
              <view class="right-operate">
                <u-switch v-model="item.status" :disabled="currentTab===1" activeColor="#d81e06" @change="onHandleStatusChange(item)"></u-switch>
              </view>
            </view>
          </template>
          <text class="uni-body">{{item.content}}</text>
        </uni-card>
      </view>
      <view v-else class="empty">
        <u-empty mode="message" width="1" text="暂时无话可说"/>
      </view>
    </view>
    <view>
      <!-- 前往新增页面 -->
      <uni-fab :pattern="pattern" horizontal="right" vertical="bottom" :pop-menu="false"
        @fabClick="onAddPage"></uni-fab>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // tab列表
        tabList: ['已发送', '收到'],
        // 当前的tab
        currentTab: 0,
        // 列表
        list: [],
        openid: '',
        isLoading: true,
        // 悬浮按钮配置
        pattern: {
          color: '#7A7E83',
          backgroundColor: '#fff',
          selectedColor: '#d81e06',
          buttonColor: '#d81e06',
          iconColor: '#fff',
          icon: 'plusempty'
        },
      }
    },
    onShow() {
      if (this.$store.state.userInfo?.userInfo?.openid) {
        const state = this.$store.state.userInfo?.userInfo
        this.openid = state.openid
        if (this.openid) {
          this.getList()
        }
      } else {
        uni.switchTab({
          url: '/pages/login/login'
        })
      }
    },
    methods: {
      /**
       * 切换tab
       * @param {Object} index
       */
      onTabChange(index) {
        this.currentTab = index
        this.getList()
      },
      /**
       * 获取列表
       */
      getList() {
        this.isLoading = true
        uniCloud.callFunction({
          name: "want-say-list",
          data: {
            openid: this.openid,
            type: this.currentTab
          },
          success: (res) => {
            this.list = res.result.data
            this.isLoading = false
          }
        })
      },
      /**
       * 状态编辑
       * @param {Object} data
       */
      onHandleStatusChange(data) {
        console.log(data);
        uniCloud.callFunction({
          name: "want_say_edit_status",
          data,
          success: (res) => {
            this.getList()
          },
          fail() {
            data.status = !data.status
          }
        })
      },
      /**
       * 前往定时器页面
       */
      onAddPage() {
        uni.navigateTo({
          url: '/pages/want-say-add/want-say-add'
        })
      },
    }
  }
</script>

<style scoped lang="scss">
  .loading,.empty{
    margin-top: 400rpx;
  }
  .card-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15rpx;
    border-bottom: 1px solid #e6e6e6;
    

    .left {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }

    .left-info {
      margin-left: 12rpx;

      &__name {
        font-size: 30rpx;
      }

      &__date {
        margin-top: 10rpx;
        font-size: 26rpx;
        color: #919191;
      }
    }
  }
</style>