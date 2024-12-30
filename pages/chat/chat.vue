<template>
  <view class="container">
    <uni-list border>
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
  padding: 20rpx;
  .item {
    display: flex;
    align-items: center;

    &__name {
      margin-left: 20rpx;
    }
  }
}
</style>
