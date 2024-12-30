<template>
  <view class="container">
    <!-- 名字-->
    <u-sticky>
      <view class="header">{{ friendInfo.nickName }}</view>
    </u-sticky>
    <!-- 聊天内容-->
    <view
      class="main"
      ref="chatMessageRef"
    >
      <scroll-view
        :scroll-top="scrollTop"
        scroll-y
        :show-scrollbar="false"
        class="chat-scroll-view"
        style="height: 100%"
      >
        <view
          class="item"
          v-for="(item, index) in chatList"
          :key="index"
        >
          <view
            class="item-content"
            :class="{ 'item-content--me': item.user === openid }"
          >
            <view>
              <u-avatar
                :src="item.avatarUrl"
                size="40"
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
        />
      </view>
      <view class="footer__button">
        <u-button
          :disabled="!inputContent.trim()"
          type="success"
          @click="onHandleSendMessage"
          text="发送"
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
  .header {
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
    color: #fff;
    font-size: 36rpxpx;
    font-weight: bold;
    background-color: #3b3a3f;
  }

  .main {
    background-color: #f5f5f5;
    background-size: cover;
    padding: 40rpx;
    box-sizing: border-box;
    height: calc(100vh - 240rpx);
    max-height: calc(100% - 210rpx);
    overflow: hidden;

    .item-content {
      display: flex;
      flex-direction: row;
      justify-content: left;
      align-items: flex-start;
      margin-bottom: 30rpx;
      position: relative;

      &__text {
        flex: 0 0 auto;
        max-width: calc(100vw - 200rpx);
        word-break: break-all;
        padding: 16rpx;
        box-sizing: border-box;
        background-color: #fff;
        color: #333;
        border-radius: 12rpx;
        margin-left: 20rpx;
        position: relative;

        &::before {
          position: absolute;
          content: "";
          width: 0;
          padding: 0;
          top: 28rpx;
          border: 12rpx solid transparent;
          border-right-color: #fff;
          left: -24rpx;
          margin-top: -6px;
        }
      }

      &--me {
        flex-direction: row-reverse;
        justify-content: right;
        .item-content__text {
          margin-right: 20rpx;
          background-color: #98e855;
          position: relative;

          &::before {
            z-index: -1;
          }

          &::after {
            position: absolute;
            content: "";
            width: 0;
            padding: 0;
            top: 28rpx;
            border: 12rpx solid transparent;
            border-left-color: #98e855;
            right: -24rpx;
            margin-top: -12rpx;
          }
        }
      }
    }
  }

  .footer {
    width: 100%;
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 10rpx;
    background-color: #2e2a2a1c;

    &__input {
      width: calc(100vw - 200rpx);
    }

    &__button {
      margin-left: 20rpx;
      width: 150rpx;
    }
  }
}
</style>
