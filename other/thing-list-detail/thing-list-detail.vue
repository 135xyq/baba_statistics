<template>
  <view>
    <view v-if="loading">
      <u-loading-page text="加载中..." />
    </view>
    <view class="list" v-else-if="dataList.length > 0">
      <u-list @scrolltolower="scrolltolower">
        <u-list-item v-for="(item, index) in dataList" :key="item._id || index">
          <u-cell :title="`拉粑粑记录`" :value="formateDate(item.time)" />
        </u-list-item>
      </u-list>
      <u-loadmore :status="loadStatus" />
    </view>
    <view class="empty" v-else>
      <u-empty text="暂无记录" mode="list" />
    </view>
  </view>
</template>

<script>
/**
 * 拉屎记录详情页
 * 展示指定用户的拉屎记录详情信息，支持分页加载
 */
  import formateDate from "@/utils/formateDate.js"
  import {thingGetList} from '@/api/thing';
  export default {
    data() {
      return {
        dataList: [],
        nickName: '',
        openid: '',
        page: 1,
        limit: 30,
        total: 0,
        loading: false,
        loadStatus: 'loadmore'
      }
    },
    onLoad(user) {
      this.nickName = user.nickName
      this.openid = user.openid
      if (this.openid) {
        this.page = 1
        this.dataList = []
        this.getList()
      } else {
        uni.switchTab({
          url: '/pages/login/login'
        })
      }
    },
    methods: {
      formateDate,
      /**
       * 获取据列表
       */
      getList() {
        this.loading = this.page === 1 && this.dataList.length === 0
        this.loadStatus = 'loading'
        thingGetList({
          page: this.page,
          limit: this.limit,
          openid: this.openid
        }).then(res=>{
          this.dataList = [...this.dataList, ...res?.list]
          this.total = res.total
          this.loading = false
          this.loadStatus = this.page * this.limit < this.total ? 'loadmore' : 'nomore'
        })
      },
      /**
       * 滚动到底
       */
      scrolltolower() {
        if (this.page * this.limit < this.total) {
          this.page++
          this.getList()
        }
      },

    }
  }
</script>

<style lang="scss">
.list {
  padding: 10rpx 30rpx;
}
.empty {
  margin-top: 200rpx;
}
</style>