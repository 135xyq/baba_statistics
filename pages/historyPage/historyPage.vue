<template>
  <view>
    <uni-calendar class="uni-calendar--hook" :selected="selected" @change="onChange" />
    <view class="list">
      <u-list>
        <u-list-item v-for="(item, index) in dataList" :key="index">
          <u-cell :title="`第${index + 1}次拉粑粑`" :value="formateTime(item.time)"></u-cell>
        </u-list-item>
      </u-list>
    </view>
  </view>
</template>

<script>
  import {
    formateDate
  } from "@/utils/formateDate.js"
  import formateTime from "@/utils/formateDate.js"
  export default {
    data() {
      return {
        selected: [],
        openId: '',
        dataList: []
      }
    },
    onShow() {
      if (this.$store.state.userInfo?.userInfo?.openid) {
        const state = this.$store.state.userInfo?.userInfo
        this.openId = state.openid
        this.getDayList()
        this.getTodayList()
      } else {
        uni.navigateBack()
      }
    },

    methods: {
      formateTime,
      onChange(time) {
        console.log(time);
        uniCloud.callFunction({
          name: "get_day_thing",
          data: {
            openid: this.openId,
            date: time.fulldate
          },
          success: (res) => {
            this.dataList = res.result.data
          }
        })
      },
      // 获取当天的数据列表
      getTodayList() {
        uniCloud.callFunction({
          name: "get_today_thing",
          data: {
            openid: this.openId
          },
          success: (res) => {
            this.dataList = res.result.data
          }
        })
      },
      // 获取当天的数据列表
      getDayList() {
        uniCloud.callFunction({
          name: "get_month_thing",
          data: {
            openid: this.openId
          },
          success: (res) => {
            const data =res.result.data
            for(let key in data) {
              if(data[key]!==0){
                this.selected.push({
                  date: key,
                  info: data[key] + '次'
                })
              }
            }
          }
        })
      },
    }
  }
</script>

<style>

</style>