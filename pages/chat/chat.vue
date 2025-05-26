<template>
  <view class="container">
    <uni-list border class="chat-list">
      <uni-list-chat
        v-for="item in userList"
        :key="item.nickName"
        :title="item.nickName"
        :avatar="item.avatarUrl"
        :note="item.lastMessage"
        :time="item.lastMsgTime ?formateDate(item.lastMsgTime) : ''"
        clickable
        :badge-text="item.unreadCount"
        @click="onGoDetail(item)"
        class="chat-item"
      />
    </uni-list>
  </view>
</template>

<script>
import {chatUserList} from '@/api/chat';
import formateDate from '@/utils/formateDate'
export default {
  data() {
    return {
      userList: [],
    };
  },
  onShow() {
    this.getUserChatList()
  },
  onPullDownRefresh() {
    this.getUserChatList()
  },
  methods: {
    formateDate,
    /**
     * 获取聊天列表
     */
    getUserChatList(){
      chatUserList().then(res=>{
        this.userList = res
        uni.stopPullDownRefresh()
      })
    },
    /**
     * 前往聊天详情页面
     */
    onGoDetail(data) {
      const info = {
        openid: data.friendId,
        nickName: data.nickName,
        avatarUrl: data.avatarUrl,
      }
      uni.navigateTo({
        url: `/pages/chat-detail/chat-detail?userInfo=${JSON.stringify(info)}`,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  padding: 30rpx;
  background-color: #f8f8f8;
  min-height: 100vh;

  .chat-list {
    border-radius: 20rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
    background-color: #fff;

    :deep(.uni-list-chat) {
      padding: 24rpx 30rpx;
      position: relative;
      transition: all 0.3s ease;

      &:active {
        background-color: #f5f5f5;
        transform: scale(0.99);
      }

      &:not(:last-child)::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 30rpx;
        right: 30rpx;
        height: 1px;
        background-color: #eee;
      }

      .uni-list-chat__header-image {
        width: 96rpx;
        height: 96rpx;
        border-radius: 20rpx;
        border: 4rpx solid #fff;
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
      }

      .uni-list-chat__content-title {
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
      }

      .uni-list-chat__content-note {
        font-size: 28rpx;
        color: #666;
        margin-top: 8rpx;
      }

      .uni-list-chat__content-time {
        font-size: 24rpx;
        color: #999;
      }

      .uni-badge {
        padding: 0 12rpx;
        height: 40rpx;
        line-height: 40rpx;
        border-radius: 20rpx;
        background-color: #ff5a5f;
        font-size: 24rpx;
      }
    }
  }
}
</style>
