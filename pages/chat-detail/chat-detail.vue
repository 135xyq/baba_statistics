<template>
  <view class="container">
    <u-sticky>
      <view class="header">
        <text class="header__title">{{ friendInfo.nickName }}</text>
      </view>
    </u-sticky>
    <view class="main" ref="chatMessageRef">
      <scroll-view
        :scroll-top="scrollTop"
        scroll-y
        :show-scrollbar="false"
        class="chat-scroll-view"
        style="height: 100%"
      >
        <view class="item" v-for="(item, index) in chatList" :key="index">
          <view class="item-content" :class="{ 'item-content--me': item.user === openid }">
            <view class="avatar-wrapper">
              <u-avatar
                :src="item.avatarUrl"
                size="80"
                class="item-content__avatar"
                shape="square"
              />
            </view>
            <view class="item-content__text">{{ item.content }}</view>
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="footer">
      <view class="footer__input">
        <u--input
          placeholder="请输入内容"
          border="surround"
          v-model="inputContent"
          class="input-box"
        />
      </view>
      <view class="footer__button">
        <u-button
          :disabled="!inputContent.trim()"
          type="success"
          @click="onHandleSendMessage"
          text="发送"
          class="send-btn"
        />
      </view>
    </view>
  </view>
</template>

<script>
import avatarImg from "@/static/img/chat/avatar.jpg";
import { chatMessageAdd, chatUserMessageList } from "@/api/chat";
import formateDate from "@/utils/formateDate";
export default {
  data() {
    return {
      // 默认头像
      avatarImg,
      // 用户openid
      openid: "",
      // 名称
      nickName: "",
      // 头像
      avatarUrl: "",
      // 输入框内容
      inputContent: "",
      // 聊天记录列表
      chatList: [],
      // 滚动高度
      scrollTop: 0,
      // 聊天对象的信息
      friendInfo: {
        openid: "",
        avatarUrl: "",
        nickName: "",
      },
      // 刷新计数
      count: 1,
      // 定时器
      timer: null,
    };
  },
  onLoad(options) {
    if (this.$store.state.userInfo?.userInfo?.openid) {
      const state = this.$store.state.userInfo?.userInfo;
      this.openid = state.openid;
      this.nickName = state.nickName;
      this.avatarUrl = state.avatarUrl;
    } else {
      uni.switchTab({
        url: "/pages/login/login",
      });
    }

    // 获取聊天对象信息
    this.friendInfo = JSON.parse(options.userInfo);

    this.chatUserMessageList();

    // 定时获取信息
    this.setTimeIntervalGetMessage();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    /**
     * 获取聊天记录
     */
    chatUserMessageList() {
      chatUserMessageList({
        openid: this.openid,
        friendOpenid: this.friendInfo.openid,
      }).then((res) => {
        // 只有数据变化才更新
        if (this.chatList.length !== res?.length) {
          this.chatList = res.map((item) => {
            if (item.senderOpenid === this.openid) {
              return {
                user: this.openid,
                nickName: this.nickName,
                avatarUrl: this.avatarUrl,
                content: item.content,
              };
            } else {
              return {
                user: this.friendInfo?.openid,
                nickName: this.friendInfo?.nickName,
                avatarUrl: this.friendInfo?.avatarUrl,
                content: item.content,
              };
            }
          });
        }
        this.scrollToBottom();
      });
    },
    /**
     * 定时获取聊天记录
     */
    setTimeIntervalGetMessage() {
      this.timer = setInterval(() => {
        this.chatUserMessageList();
      }, 30 * 1000);
    },
    /**
     * 发送信息
     */
    onHandleSendMessage() {
      this.chatList.push({
        user: this.openid,
        nickName: this.nickName,
        avatarUrl: this.avatarUrl,
        content: this.inputContent,
      });

      // 滚动到底部
      this.scrollToBottom();

      const msg = this.inputContent;
      const data = {
        senderOpenid: this.openid,
        receiverOpenid: this.friendInfo.openid,
        content: msg,
        createTime: formateDate(Date.now()),
      };
      this.inputContent = "";
      // 添加记录
      chatMessageAdd(data);

      if (this.friendInfo.openid === "robot_small_fool") {
        uni.request({
          url: "http://api.qingyunke.com/api.php",
          method: "GET",
          data: {
            key: "free",
            appid: 0,
            msg: msg,
          },
          success: (res) => {
            const data = res.data;
            if (data?.result === 0) {
              this.chatList.push({
                user: this.friendInfo.openid,
                nickName: this.friendInfo.nickName,
                avatarUrl: this.friendInfo.avatarUrl,
                content: data.content,
              });
              const params = {
                senderOpenid: this.friendInfo.openid,
                receiverOpenid: this.openid,
                content: data.content,
                createTime: formateDate(Date.now()),
              };
              // 添加记录
              chatMessageAdd(params);
            } else {
              uni.showToast({
                title: "获取信息失败",
                icon: "none",
              });
            }

            // 滚动到底部
            this.scrollToBottom();

            console.log("success", res);
          },
          fail: (err) => {
            console.log("err", err);
            uni.showToast({
              title: "获取信息失败",
              icon: "none",
            });
          },
        });
      }
    },
    /**
     * 滚动到最底部
     */
    scrollToBottom() {
      this.$nextTick(() => {
        this.scrollTop = 9999999 + this.count++;
      });
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  background-color: #f8f8f8;
  min-height: 100vh;

  .header {
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    background: linear-gradient(135deg, #4a90e2, #87ceeb);
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 100;

    &__title {
      color: #fff;
      font-size: 32rpx;
      font-weight: 600;
    }
  }

  .main {
    background-color: #f5f5f5;
    background-image: linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px);
    background-size: 20px 20px;
    padding: 30rpx;
    box-sizing: border-box;
    height: calc(100vh - 220rpx);
    max-height: calc(100% - 190rpx);
    overflow: hidden;

    .item-content {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
      margin-bottom: 40rpx;
      position: relative;
      
      .avatar-wrapper {
        width: 80rpx;
        height: 80rpx;
        border-radius: 16rpx;
        overflow: hidden;
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
      }

      &__text {
        flex: 0 0 auto;
        max-width: calc(100vw - 240rpx);
        word-break: break-all;
        padding: 20rpx 24rpx;
        box-sizing: border-box;
        background-color: #fff;
        color: #333;
        border-radius: 16rpx;
        margin-left: 24rpx;
        position: relative;
        font-size: 28rpx;
        line-height: 1.5;
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

        &::before {
          position: absolute;
          content: "";
          width: 0;
          padding: 0;
          top: 28rpx;
          border: 12rpx solid transparent;
          border-right-color: #fff;
          left: -24rpx;
          margin-top: -6rpx;
        }
      }

      &--me {
        flex-direction: row-reverse;
        justify-content: flex-end;

        .item-content__text {
          margin-right: 24rpx;
          margin-left: 0;
          background-color: #95ec69;
          color: #2c2c2c;
          box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

          &::before {
            display: none;
          }

          &::after {
            position: absolute;
            content: "";
            width: 0;
            padding: 0;
            top: 28rpx;
            border: 12rpx solid transparent;
            border-left-color: #95ec69;
            right: -24rpx;
            margin-top: -12rpx;
          }
        }
      }
    }
  }

  .footer {
    width: 100%;
    height: 120rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 30rpx;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

    &__input {
      flex: 1;
      margin-right: 20rpx;

      :deep(.input-box) {
        background-color: #f5f5f5;
        border-radius: 36rpx;
        padding: 0 24rpx;
        height: 72rpx;
        line-height: 72rpx;

        .uni-input-wrapper {
          height: 100%;
        }

        .uni-input-input {
          font-size: 28rpx;
          color: #333;
        }
      }
    }

    &__button {
      width: 140rpx;

      :deep(.send-btn) {
        height: 72rpx;
        border-radius: 36rpx;
        font-size: 28rpx;
        background: linear-gradient(135deg, #4a90e2, #87ceeb);
        border: none;
        box-shadow: 0 2rpx 8rpx rgba(74, 144, 226, 0.3);
        transition: all 0.3s ease;

        &:active {
          transform: scale(0.95);
        }

        &--disabled {
          opacity: 0.6;
          background: #ccc;
        }
      }
    }
  }
}
</style>
