<template>
  <view class="container">
    <!-- 导航栏 -->
    <u-sticky class="sticky-header">
      <view class="header">
        <text class="header__title">{{ friendInfo.nickName }}</text>
      </view>
    </u-sticky>

    <!-- 聊天内容区 -->
    <view class="main" ref="chatMessageRef">
      <scroll-view :scroll-top="scrollTop" scroll-y :show-scrollbar="false" class="chat-scroll-view"
        @scrolltoupper="loadMoreMessages" refresher-enabled :refresher-triggered="isRefreshing"
        @refresherrefresh="onRefresh">
        <view class="chat-list">
          <view class="item" v-for="(item, index) in chatList" :key="item._id || index">
            <view class="item-content" :class="{ 'item-content--me': item.user === openid }">
              <view class="avatar-wrapper">
                <u-avatar :src="item.avatarUrl" size="80" class="item-content__avatar" shape="square" />
              </view>
              <view class="item-content__wrapper">
                <text class="item-content__name">{{ item.nickName }}</text>
                <view class="item-content__text">{{ item.content }}</view>
                <text class="item-content__time">{{ formatMessageTime(item.createTime) }}</text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 底部输入框 -->
    <view class="footer">
      <view class="footer__input">
        <u--input v-model="inputContent" placeholder="请输入内容" border="surround" class="input-box" :maxlength="500"
          confirmType="send" @confirm="onHandleSendMessage" />
      </view>
      <view class="footer__button">
        <u-button :disabled="!inputContent.trim()" type="primary" @click="onHandleSendMessage" text="发送"
          class="send-btn" :loading="isSending"
          color="linear-gradient(to right, rgb(66, 83, 216), rgb(213, 51, 186))" />
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f7f7f7;
}

.sticky-header {
  z-index: 99;
}

.header {
  height: 88rpx;
  background: linear-gradient(to right, #4a90e2, #87ceeb);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);

  &__title {
    color: #ffffff;
    font-size: 32rpx;
    font-weight: 600;
  }
}

.main {
  flex: 1;
  overflow: hidden;
  background-image: linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
    linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
    linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
  background-size: 40rpx 40rpx;
  background-position: 0 0, 0 20rpx, 20rpx -20rpx, -20rpx 0px;
}

.chat-scroll-view {
  height: calc(100vh - 220rpx);
}

.chat-list {
  .item {
    margin-bottom: 30rpx;

    &-content {
      display: flex;
      align-items: flex-start;

      &--me {
        flex-direction: row-reverse;

        .item-content__wrapper {
          margin: 0 20rpx 0 120rpx;

          .item-content__text {
            background-color: #95ec69;
            border-radius: 16rpx 2rpx 16rpx 16rpx;

            &::before {
              content: '';
              position: absolute;
              top: 24rpx;
              right: -20rpx;
              width: 0;
              height: 0;
              border-style: solid;
              border-width: 12rpx 0 12rpx 20rpx;
              border-color: transparent transparent transparent #95ec69;
            }
          }
        }
      }

      &__avatar {
        width: 80rpx;
        height: 80rpx;
        border-radius: 16rpx;
        box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
      }

      &__wrapper {
        margin: 0 120rpx 0 20rpx;
      }

      &__name {
        font-size: 24rpx;
        color: #999;
        margin-bottom: 8rpx;
      }

      &__text {
        position: relative;
        padding: 20rpx 24rpx;
        background-color: #ffffff;
        border-radius: 2rpx 16rpx 16rpx 16rpx;
        font-size: 28rpx;
        color: #333;
        word-break: break-all;
        box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
        max-width: 480rpx;

        &::before {
          content: '';
          position: absolute;
          top: 24rpx;
          left: -20rpx;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 12rpx 20rpx 12rpx 0;
          border-color: transparent #ffffff transparent transparent;
        }
      }

      &__time {
        font-size: 24rpx;
        color: #999;
        margin-top: 8rpx;
        text-align: center;
      }
    }
  }
}

.footer {
  padding: 20rpx 30rpx;
  background-color: #f8f8f8;
  border-top: 2rpx solid #eee;
  display: flex;
  align-items: center;

  &__input {
    flex: 1;
    margin-right: 20rpx;

    .input-box {
      background-color: #fff;
      border-radius: 36rpx;
      height: 72rpx;
      font-size: 28rpx;
      padding: 0 30rpx;

      :deep(.u-input__input) {
        height: 72rpx;
      }
    }
  }

  &__button {
    .send-btn {
      height: 72rpx;
      border-radius: 36rpx;
      background: linear-gradient(to right, #4a90e2, #87ceeb);
      border: none;
      padding: 0 40rpx;
      font-size: 28rpx;

      &--disabled {
        opacity: 0.6;
      }

      &:active {
        transform: scale(0.98);
      }
    }
  }
}
</style>

<script>
import avatarImg from "@/static/img/chat/avatar.jpg";
import { chatMessageAdd, chatUserMessageList } from "@/api/chat";
import formateDate from "@/utils/formateDate";

export default {
  data() {
    return {
      avatarImg,
      openid: "",
      nickName: "",
      avatarUrl: "",
      inputContent: "",
      chatList: [],
      scrollTop: 0,
      friendInfo: {
        openid: "",
        avatarUrl: "",
        nickName: "",
      },
      count: 1,
      timer: null,
      pageSize: 20,
      currentPage: 1,
      hasMore: true,
      isRefreshing: false,
      isSending: false,
      debounceTimer: null,
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo?.userInfo || {};
    },
  },
  onLoad(options) {
    if (this.userInfo?.openid) {
      this.openid = this.userInfo.openid;
      this.nickName = this.userInfo.nickName;
      this.avatarUrl = this.userInfo.avatarUrl;
    } else {
      uni.switchTab({ url: "/pages/login/login" });
      return;
    }

    this.friendInfo = JSON.parse(options.userInfo);
    this.initChatList();
    this.startMessagePolling();
  },
  beforeDestroy() {
    this.stopMessagePolling();
    this.clearDebounce();
  },
  methods: {
    async initChatList() {
      try {
        const messages = await this.fetchMessages();
        this.processChatMessages(messages);
        this.scrollToBottom();
      } catch (error) {
        this.handleError(error);
      }
    },
    async fetchMessages(page = 1) {
      try {
        return await chatUserMessageList({
          openid: this.openid,
          friendOpenid: this.friendInfo.openid,
          page,
          pageSize: this.pageSize,
        });
      } catch (error) {
        throw new Error("获取消息失败");
      }
    },
    processChatMessages(messages) {
      if (!Array.isArray(messages) || messages.length === 0) {
        this.hasMore = false;
        return;
      }

      const formattedMessages = messages.map(item => ({
        _id: item._id,
        user: item.senderOpenid === this.openid ? this.openid : this.friendInfo.openid,
        nickName: item.senderOpenid === this.openid ? this.nickName : this.friendInfo.nickName,
        avatarUrl: item.senderOpenid === this.openid ? this.avatarUrl : this.friendInfo.avatarUrl,
        content: item.content,
        createTime: item.createTime,
      }));

      this.chatList = [...formattedMessages, ...this.chatList];
    },
    startMessagePolling() {
      this.stopMessagePolling();
      this.timer = setInterval(() => this.pollNewMessages(), 30000);
    },
    stopMessagePolling() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    async pollNewMessages() {
      try {
        const messages = await this.fetchMessages(1);
        if (messages.length > this.chatList.length) {
          this.processChatMessages(messages);
          this.scrollToBottom();
        }
      } catch (error) {
        console.error("轮询消息失败:", error);
      }
    },
    async loadMoreMessages() {
      if (!this.hasMore || this.isRefreshing) return;

      try {
        this.currentPage++;
        const messages = await this.fetchMessages(this.currentPage);
        this.processChatMessages(messages);
      } catch (error) {
        this.currentPage--;
        this.handleError(error);
      }
    },
    async onRefresh() {
      this.isRefreshing = true;
      try {
        await this.initChatList();
      } finally {
        this.isRefreshing = false;
      }
    },
    clearDebounce() {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = null;
      }
    },
    scrollToBottom() {
      this.clearDebounce();
      this.debounceTimer = setTimeout(() => {
        this.scrollTop = 9999999 + this.count++;
      }, 100);
    },
    formatMessageTime(time) {
      return time ? formateDate(new Date(time)) : "";
    },
    async onHandleSendMessage() {
      if (this.isSending || !this.inputContent.trim()) return;

      const message = this.inputContent.trim();
      this.inputContent = "";
      this.isSending = true;

      try {
        await this.sendMessage(message);
        if (this.friendInfo.openid === "robot_small_fool") {
          await this.handleRobotReply(message);
        }
      } catch (error) {
        this.handleError(error);
      } finally {
        this.isSending = false;
      }
    },
    async sendMessage(content) {
      const messageData = {
        senderOpenid: this.openid,
        receiverOpenid: this.friendInfo.openid,
        content,
        createTime: formateDate(Date.now()),
      };

      this.chatList.push({
        user: this.openid,
        nickName: this.nickName,
        avatarUrl: this.avatarUrl,
        content,
        createTime: messageData.createTime,
      });

      this.scrollToBottom();
      await chatMessageAdd(messageData);
    },
    async handleRobotReply(message) {
      try {
        const response = await uni.request({
          url: "http://api.qingyunke.com/api.php",
          method: "GET",
          data: { key: "free", appid: 0, msg: message },
        });

        const { data } = response;
        if (data?.result === 0) {
          const replyData = {
            senderOpenid: this.friendInfo.openid,
            receiverOpenid: this.openid,
            content: data.content,
            createTime: formateDate(Date.now()),
          };

          this.chatList.push({
            user: this.friendInfo.openid,
            nickName: this.friendInfo.nickName,
            avatarUrl: this.friendInfo.avatarUrl,
            content: data.content,
            createTime: replyData.createTime,
          });

          this.scrollToBottom();
          await chatMessageAdd(replyData);
        } else {
          throw new Error("机器人响应异常");
        }
      } catch (error) {
        throw new Error("获取机器人回复失败");
      }
    },
    handleError(error) {
      uni.showToast({
        title: error.message || "操作失败",
        icon: "none",
      });
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  background-color: #f8f8f8;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  .sticky-header {
    z-index: 100;
  }

  .header {
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to right, rgb(66, 83, 216), rgb(213, 51, 186));
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);

    &__title {
      color: #fff;
      font-size: 32rpx;
      font-weight: 600;
    }
  }

  .main {
    flex: 1;
    background-color: #f5f5f5;
    background-image: linear-gradient(rgba(255, 255, 255, 0.9) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.9) 1px, transparent 1px);
    background-size: 20px 20px;
    position: relative;

    .chat-scroll-view {
      height: 100%;
    }

    .chat-list {
      padding: 30rpx;
    }

    .item-content {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      margin-bottom: 40rpx;

      .avatar-wrapper {
        width: 80rpx;
        height: 80rpx;
        border-radius: 16rpx;
        overflow: hidden;
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
        flex-shrink: 0;
      }

      &__wrapper {
        display: flex;
        flex-direction: column;
        margin: 0 24rpx;
        max-width: calc(100% - 208rpx);
      }

      &__name {
        font-size: 24rpx;
        color: #999;
        margin-bottom: 8rpx;
      }

      &__text {
        padding: 20rpx 24rpx;
        background-color: #fff;
        color: #333;
        border-radius: 16rpx;
        font-size: 28rpx;
        line-height: 1.5;
        word-break: break-all;
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
        position: relative;

        &::before {
          content: "";
          position: absolute;
          left: -16rpx;
          top: 20rpx;
          border: 12rpx solid transparent;
          border-right-color: #fff;
        }
      }

      &__time {
        font-size: 24rpx;
        color: #999;
        margin-top: 8rpx;
      }

      &--me {
        flex-direction: row-reverse;

        .item-content__wrapper {
          align-items: flex-end;
        }

        .item-content__text {
          background-color: #95ec69;
          color: #2c2c2c;

          &::before {
            display: none;
          }

          &::after {
            content: "";
            position: absolute;
            right: -12rpx;
            top: 20rpx;
            border: 12rpx solid transparent;
            border-left-color: #95ec69;
          }
        }
      }
    }
  }

  .footer {
    background-color: #fff;
    border-top: 1rpx solid #eee;
    padding: 20rpx 30rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &__input {
      flex: 1;
      margin-right: 20rpx;

      ::v-deep .input-box {
        background-color: #f5f5f5;
        border-radius: 36rpx;
        height: 72rpx;

        .uni-input-wrapper {
          height: 100%;
          padding: 0 24rpx;
        }

        .uni-input-input {
          font-size: 28rpx;
          color: #333;
        }

        .uni-input-placeholder {
          font-size: 28rpx;
          color: #999;
        }
      }
    }

    &__button {
      width: 140rpx;

      ::v-deep .send-btn {
        height: 72rpx;
        border-radius: 36rpx;
        background: linear-gradient(to right, rgb(66, 83, 216), rgb(213, 51, 186));
        border: none;
        box-shadow: 0 2rpx 8rpx rgba(74, 144, 226, 0.3);
        transition: all 0.3s ease;

        &:active {
          transform: scale(0.95);
        }

        &--disabled {
          opacity: 0.6;
          background: #ccc;
          box-shadow: none;
        }
      }
    }
  }
}
</style>
