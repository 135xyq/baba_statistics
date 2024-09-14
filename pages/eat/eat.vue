<template>
  <view>
    <view class="set">
      <u-icon name="setting-fill" size="40" @click="onHandleGoPageSet"></u-icon>
    </view>
    <view class="choose" v-if="prizes.length > 0">
      <LuckyWheel ref="myLucky" width="700rpx" height="700rpx" :blocks="blocks" :prizes="prizes" :buttons="buttons"
        :defaultStyle="defaultStyle" @start="startCallBack" @end="endCallBack" />
    </view>
  </view>

</template>

<script>
  import LuckyWheel from '@/components/@lucky-canvas/uni/lucky-wheel'
  export default {
    components: {
      LuckyWheel
    },
    data() {
      return {
        blocks: [{
          padding: '0',
          background: '#ff6164'
        }],
        openid:'',
        colorList: ['#2dca94','#1859b4','#a52c2c','#500c0c','#a27878','#c02288','#a3ca1a','#df790c','#1c70e5','#3123b0','#ba15da','#df1c8c'],
        prizes: [],
        buttons: [{
            radius: '50px',
            background: '#ff6164'
          },
          {
            radius: '45px',
            background: '#ff6164'
          },
          {
            radius: '40px',
            background: '#ff6164',
            pointer: true,
            fonts: [{
              text: '开始\n选择',
              top: '-20px',
              fontColor: '#FFF',
              fontWeight: 600
            }]
          },
        ],
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
      getList() {
        uniCloud.callFunction({
          name: "lucky_list",
          data: {
            openid: this.openid
          },
          success: (res) => {
            this.prizes = res.result.data.map((item,index) => {
              return {
                range: item.range,
                fonts: [{
                  text: item.text,
                  top: '10%',
                  fontColor: '#fff'
                }],
                background: this.colorList[index% this.colorList.length]
              }

            })
          }
        })
      },
      // 点击抽奖按钮触发回调
      startCallBack() {
        const time = Math.max(3000, this.prizes.length * 500)
        // 先开始旋转
        this.$refs.myLucky.play()
        // 使用定时器来模拟请求接口
        setTimeout(() => {
          // 调用stop停止旋转并传递中奖索引
          this.$refs.myLucky.stop()
        }, time)
      },
      // 抽奖结束触发回调
      endCallBack(prize) {
        // 奖品详情
        uni.showModal({
          title: '提示',
          content: '恭喜你抽中了：' + prize.fonts[0].text,
          showCancel: false
        });
      },
      onHandleGoPageSet() {
        uni.navigateTo({
          url: '/pages/eatSet/eatSet'
        })
      }
    }
  }
</script>

<style scoped>
  .choose {
    margin-top: 20rpx;
  }

  .set {
    display: flex;
    justify-content: flex-end;
    padding-right: 40rpx;
    margin-top: 80rpx;
  }
</style>