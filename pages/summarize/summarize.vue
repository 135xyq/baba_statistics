<template>
  <view class="container">
    <view class="loading" v-if="isLoading">
      <u-loading-icon color="#d81e06" textColor="#d81e06" vertical text="努力加载中..."></u-loading-icon>
    </view>
    <view v-else>
      <!-- 时间 -->
      <view class="date">
        <image src="@/static/img/mine/日历.png" class="date__icon" />
        {{showDate}}
      </view>
      <!-- 拉屎数量 -->
      <view class="thing">
        <view>共拉了<text class="thing__count">{{dataInfo.thing}}</text>坨</view>
        <image src="@/static/img/home-active.png" class="thing__icon" />
      </view>
      <!-- 刷题 -->
      <view class="problem">
        <view class="problem-time problem-item">做题时长为
          <text class="problem__count problem-time__count">{{formateDateHMS(dataInfo.useTime || 0)}}</text>
        </view>
        <view class="problem-count problem-item">刷题总数量为
          <text class="problem__count problem-count__count">{{dataInfo.totalNumber}}</text>道
        </view>
        <view class="probelm-true problem-item">正确率为
          <text class="problem__count problem-true__count">{{trueNumber}}%</text>
        </view>
      </view>
      <!-- 想说的话 -->
      <view class="say">
        <view class="say-get">
          共收到别人的悄悄话
          <text class="say-get__count">{{dataInfo.wantSayGet}}</text>条
        </view>
        <view class="say-send">
          共发送悄悄话
          <text class="say-send__count">{{dataInfo.wantSaySend}}</text>条
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import {formateDateHMS} from "@/utils/formateDate.js"
  export default {
    data() {
      return {
        openid:'',
        // 数据
        dataInfo:{
          errorNumber: 0,
          thing: 0,
          totalNumber: 0,
          useTime: 0,
          wantSayGet: 0,
          wantSaySend: 0
        },
        // 正在加载
        isLoading: false,
        type: '',
        date:{}
      }
    },
    computed:{
      // 正确率
      trueNumber(){
        if(this.dataInfo.totalNumber > 0) {
          return ((this.dataInfo.totalNumber - this.dataInfo.errorNumber) / this.dataInfo.totalNumber * 100).toFixed(2)
        }else{
          return 0
        }
      },
      // 显示的时间
      showDate() {
        if(this.type === 'year') {
          return this.date.year
        }else{
          return this.date.year + '年' + this.date.month + '月'
        }
      }
    },
    onLoad(value) {
      if (this.$store.state.userInfo?.userInfo?.openid) {
        const state = this.$store.state.userInfo?.userInfo
        this.openid = state.openid
        this.type = value.type
        this.date = JSON.parse(value.date)
        this.getData()
      }else{
        uni.navigateTo({
          url:'/pages/login/login'
        })
      }
    },
    methods: {
      formateDateHMS,
      /**
       * 获取数据
       */
      getData(type,date) {
        this.isLoading = true
        uniCloud.callFunction({
          name: "summarize",
          data: {
            type: this.type,
            date: this.date,
            openid: this.openid
          },
          success: (res) => {
            this.dataInfo = res.result.data
            this.isLoading = false
          },
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .container {
    height: 100vh;
    background: linear-gradient(to bottom right, #ffe9a6, #ffd866);
    /* 浅黄色到橙色的渐变 */
    color: #333;
    font-family: Arial, sans-serif;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    vertical-align: center;
  }
  
  .loading{
    margin-top: 400rpx;
  }

  .date {
    font-size: 80rpx;
    font-weight: 900;
    display: flex;
    align-items: center;
    margin-bottom: 50rpx;

    &__icon {
      width: 80rpx;
      height: 80rpx;
      margin-right: 15rpx;
    }
  }

  .thing,
  .problem,
  .say {
    margin-left: 40rpx;
    padding: 20rpx 30rpx;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    margin-top: 20rpx;
    font-size: 40rpx;
    font-weight: 600;

  }

  .thing {
    display: flex;
    align-items: center;
    margin-bottom: 40rpx;

    &__icon {
      width: 50rpx;
      height: 50rpx;
      margin-left: 15rpx;
    }

    &__count {
      font-weight: 700;
      font-size: 70rpx;
      color: #e63262;
      margin: 0 6rpx;
    }
  }

  .problem {
    &-item {
      margin-bottom: 20rpx;
    }

    &__count {
      font-weight: 700;
      font-size: 70rpx;
      color: #e63262;
      margin: 0 6rpx;
    }

    .problem-time__count {
      color: #2e9e88;
    }

    .problem-count__count {
      color: #ad9b11;
    }

    .problem-true__count {
      color: #00b000;
    }
  }
  
  .say{
    &-get{
      margin-bottom: 20rpx;
      &__count{
        font-weight: 700;
        font-size: 70rpx;
        color: #e63262;
        margin: 0 6rpx;
      }
    }
    &-send{
      &__count{
        font-weight: 700;
        font-size: 70rpx;
        color: #51e6b0;
        margin: 0 6rpx;
      }
    }
  }
</style>