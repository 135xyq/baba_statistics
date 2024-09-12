<template>
  <view class="list" v-if="dataList.length > 0">
    <u-list @scrolltolower="scrolltolower">
      <u-list-item v-for="(item, index) in dataList" :key="index">
        <u-cell :title="`拉粑粑记录`" :value="formateDate(item.time)"></u-cell>
      </u-list-item>
    </u-list>
  </view>
</template>

<script>
  import formateDate from "@/utils/formateDate.js"
  export default {
    data() {
      return {
        dataList: [],
        nickName: '',
        openid: '',
        page: 1,
        limit: 30,
        total: 0
      }
    },
    onLoad(user) {
      this.nickName = user.nickName
      this.openid = user.openid
      if (this.openid) {
        this.getList()
      } else {
        uni.switchTab({
          url: '/pages/history/history'
        })
      }
    },
    methods: {
      formateDate,
      // 获取据列表
      getList() {
        uniCloud.callFunction({
          name: "get_thing_list",
          data: {
            openid: this.openid,
            page: this.page,
            limit: this.limit
          },
          success: (res) => {
            this.dataList = [...this.dataList, ...res.result.data?.list]
            this.total = res.result.data.total
          }
        })
      },
      scrolltolower() {
        if (this.page * this.limit < this.total) {
          this.page++
          this.getList()
        }
      },

    }
  }
</script>

<style>

</style>