<template>
  <view>
    <view class="operate">
      <u-avatar :src="imgSrc" size="150" @click="onAdd"></u-avatar>
    </view>
    <view class="ranking">
      <u-avatar :src="rankingImg" size="40" @click="onGetRankingPage"></u-avatar>
    </view>
    <view class="count">你总共拉了<span style="color: red">{{total}}</span>次粑粑了！</view>
    <view class="list" v-if="dataList.length > 0">
      <view class="title">今日拉粑粑的记录：</view>
      <u-list>
        <u-list-item v-for="(item, index) in dataList" :key="index">
          <u-cell :title="`第${index + 1}次拉粑粑`" :value="formateDate(item.time)" @click="onDelete(item)"></u-cell>
        </u-list-item>
      </u-list>
    </view>
    <view>
      <!-- 前往计时器页面 -->
      <uni-fab :pattern="pattern" horizontal="right" vertical="bottom" :pop-menu="false"
        @fabClick="onAddRecord"></uni-fab>
    </view>
  </view>
</template>

<script>
  import img from "@/static/aoligei.jpg"
  import rankingImg from "@/static/img/ranking-active.png"
  import formateDate from "@/utils/formateDate.js"
  export default {
    data() {
      return {
        imgSrc: img,
        rankingImg,
        openid: '',
        total: 0,
        dataList: [],
        // 悬浮按钮配置
        pattern: {
          color: '#7A7E83',
          backgroundColor: '#fff',
          selectedColor: '#d81e06',
          buttonColor: '#d81e06',
          iconColor: '#fff',
          icon: 'calendar'
        },
      }
    },
    onShow() {
      if (this.$store.state.userInfo?.userInfo?.openid) {
        const state = this.$store.state.userInfo?.userInfo
        this.openid = state.openid
        if (this.openid) {
          this.getTotal()
          this.getTodayList()
        }
      } else {
        uni.switchTab({
          url: '/pages/login/login'
        })
      }
    },
    methods: {
      formateDate,
      // 获取当天的数据列表
      getTodayList() {
        uniCloud.callFunction({
          name: "get_today_thing",
          data: {
            openid: this.openid
          },
          success: (res) => {
            this.dataList = res.result.data
          }
        })
      },
      getTotal() {
        uniCloud.callFunction({
          name: "thing_count",
          data: {
            openid: this.openid
          },
          success: (res) => {
            this.total = res.result.data
          }
        })
      },
      onDelete(item) {
        uni.showModal({
          title: '提示',
          content: '你是不是想要偷偷删除拉屎记录？拉屎大王还想耍赖？',
          cancelText: '不是哒',
          confirmText: '就耍赖',
          success: (res) => {
            if (res.confirm) {
              if (!this.openid) {
                if (this.$store.state.userInfo?.userInfo?.openid) {
                  const state = this.$store.state.userInfo?.userInfo
                  this.openid = state.openid
                  if (this.openid) {
                    this.getTotal()
                    this.getTodayList()
                  }
                } else {
                  uni.switchTab({
                    url: '/pages/login/login'
                  })
                }
              } else {
                uniCloud.callFunction({
                  name: "delete_thing",
                  data: item,
                  success: (res) => {
                    this.getTotal()
                    this.getTodayList()
                    uni.showToast({
                      title: `你差点就成为拉屎之王了，可惜了`,
                      icon: 'none',
                      duration: 2000
                    });
                  }
                })
              }

            } else if (res.cancel) {
              uni.showToast({
                title: '你真是个诚实的拉屎大王!',
                icon: 'none',
                duration: 2000
              });
            }
          },
        });
      },
      /**
       * 新增
       */
      onAdd() {
        uni.showModal({
          title: '提示',
          content: '你已经是拉屎大王了，确定还要拉粑粑吗？',
          success: (res) => {
            if (res.confirm) {
              if (!this.openid) {
                if (this.$store.state.userInfo?.userInfo?.openid) {
                  const state = this.$store.state.userInfo?.userInfo
                  this.openid = state.openid
                  if (this.openid) {
                    this.getTotal()
                    this.getTodayList()
                  }
                } else {
                  uni.switchTab({
                    url: '/pages/login/login'
                  })
                }
              } else {
                uniCloud.callFunction({
                  name: "thing_add",
                  data: {
                    openid: this.openid
                  },
                  success: (res) => {
                    this.getTotal()
                    this.getTodayList()
                    uni.showToast({
                      title: `你真是拉屎大王,你今天已经拉了${res.result.data}次粑粑了！`,
                      icon: 'none',
                      duration: 2000
                    });
                  }
                })
              }

            } else if (res.cancel) {
              uni.showToast({
                title: '差点让你成为拉屎大王!',
                icon: 'none',
                duration: 2000
              });
            }
          }
        });

      },
      /**
       * 前往定时器页面
       */
      onAddRecord() {
        uni.navigateTo({
          url: '/pages/timeCount/timeCount'
        })
      },
      /**
       * 前往排行榜
       */
      onGetRankingPage() {
        uni.navigateTo({
          url: '/pages/ranking/ranking'
        })
      }
    }
  }
</script>

<style>
  .operate {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 100rpx;
    position: relative;
  }
  
  .ranking{
    position: absolute;
    right: 20px;
    top: 30px;
  }

  .count {
    text-align: center;
    margin-top: 3rpx;
    font-size: 50rpx;
    font-weight: 800;
  }


  ::v-deep .u-list {
    max-height: 600rpx !important;
  }

  .title {
    padding: 20rpx 30rpx 10rpx 30rpx;
    font-weight: 600;
  }
</style>