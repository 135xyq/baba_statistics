<template>
  <view class="history-container">
    <view class="tab">
      <u-tabs :list="list" @click="change" :current="current" lineColor="#d81e06"></u-tabs>
    </view>
    <view class="list" v-if="dataList.length > 0">
      <view class="title">
        <view class="title__number">排名</view>
        <view class="title__name">姓名</view>
        <view class="title__count">次数</view>
      </view>
      <view class="list-item" v-for="(item,index) in dataList" :key="item.openid" @click="onDetail(item)">
        <view class="list-item__number"> 
          <u-avatar v-if="index === 0" :src="firstImg" size="40" />
          <u-avatar v-if="index === 1" :src="secondImg" size="40" />
          <text v-if="index >= 2">{{index + 1}}</text>
        </view>
        <view class="list-item__name">
          <u-avatar :src="item.avatarUrl"size="40" />
          <text class="list-item__name__text">{{item.nickName}}</text>
        </view>
        <view class="list-item__count">{{item.count}}</view>
      </view>
    </view>
    <view v-else>
      <u-empty text="还没有人拉粑粑" mode="list"></u-empty>
    </view>
  </view>
</template>

<script>
  import firstImg from "@/static/img/first.png"
    import secondImg from "@/static/img/second.png"
  export default {
    data() {
      return {
        firstImg,
        secondImg,
        dataList: [],
        current: 0,
        list: [{
          name: '今日排行榜',
        }, {
          name: '月度排行榜',
        }, {
          name: '年度排行榜'
        }, {
          name: '总排行榜'
        }]
      }
    },
    onShow() {
      this.current = 0
      this.getHistory(0)
    },
    methods: {
      change(item) {
        this.getHistory(item.index)
      },
      async getHistory(type) {
        uni.showLoading({
          title: '加载中...'
        })
        this.dataList = []
        await uniCloud.callFunction({
          name: "get_total_list",
          data: {
            type: type
          },
          success: (res) => {
            this.dataList = res.result.data
          }
        })
        uni.hideLoading()
      },
      onDetail(item) {
        console.log(item);
        uni.navigateTo({
          url: `/pages/listDetail/listDetail?nickName=${item.nickName}&openid=${item.openid}`
        })
      }

    }
  }
</script>

<style lang="scss">
  .list {
    padding: 10rpx 30rpx;

    .title {
      margin: 10rpx 0;
      font-weight: 700;
      font-size: 40rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;


      &__number {
        width: calc(100% / 3);
        text-align: center;
      }

      &__name {
        width: calc(100% / 3);
        text-align: center;
      }

      &__count {
        width: calc(100% / 3);
        text-align: center;
      }
    }

    &-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15rpx;
      font-size: 32rpx;
      font-weight: 600;
      border-bottom: 1px solid #eee;

      &--first {
        color: white;
        background-color: red;
      }

      &__number {
        width: calc(100% / 3);
        text-align: center;
        display: flex;
        justify-content: center;
      }

      &__name {
        width: calc(100% / 3);
        text-align: center;
        justify-content: center;
        display: flex;
        align-items: center;
        
        &__text{
          margin-left: 10rpx;
        }
      }

      &__count {
        width: calc(100% / 3);
        text-align: center;
      }
    }

  }
</style>