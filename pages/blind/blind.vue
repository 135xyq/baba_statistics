<template>
  <view class="blind-container">
    <view class="left-list">
      <u-list>
        <u-list-item v-for="(item, index) in typeListData" :key="item._id">
          <view class="list-item" :class="{active:item._id === activeCategory}"
            @click="onHandleChangeCategory(item._id)">
            {{item.name}}
          </view>
        </u-list-item>
      </u-list>
    </view>
    <view class="right-list">
      <scroll-view v-if="dataList.length > 0" scroll-y="true" scroll-top="0">
        <view v-for="item in dataList" :key="item">
          <uni-card :title="item.name" :sub-title="item.createTime " :extra=" item.price? item.price +'元' : ''" padding="10px 0">
            <image class="right-list__img" :src="item.coverImg"></image>
            <text class="uni-body uni-mt-5">{{item.remark}}</text>
          </uni-card>
        </view>
      </scroll-view>
      <u-empty v-else mode="data">
      </u-empty>
    </view>
    <view>
      <!-- 前往新增和编辑页面 -->
      <uni-fab ref="fab" :pattern="pattern" horizontal="right" vertical="bottom" :pop-menu="true" :content="content"
        @trigger="onAddBlind"></uni-fab>
    </view>
  </view>
</template>

<script>
  import rankingImg from "@/static/img/ranking-active.png"
  export default {
    data() {
      return {
        rankingImg,
        // 类型列表
        typeListData: [],
        // 数据列表
        dataList: [],
        openid: '',
        // 当前选中的类型
        activeCategory: '',
        // 悬浮按钮配置
        pattern: {
          color: '#7A7E83',
          backgroundColor: '#fff',
          selectedColor: '#d81e06',
          buttonColor: '#d81e06',
          iconColor: '#fff',
          icon: 'compose'
        },
        content: [{
            iconPath: '/static/img/blind-add-type.png',
            selectedIconPath: '/static/img/blind-add-type-active.png',
            text: '类型',
            active: false
          },
          {
            iconPath: '/static/img/blind-add.png',
            selectedIconPath: '/static/img/blind-add-active.png',
            text: '盲盒',
            active: false
          }
        ]
      };
    },
    computed: {

    },
    onShow() {
      if (this.$store.state.userInfo?.userInfo?.openid) {
        const state = this.$store.state.userInfo?.userInfo
        this.openid = state.openid
        if (this.openid) {
          this.getCategoryList()
        }
      } else {
        uni.switchTab({
          url: '/pages/login/login'
        })
      }
    },
    methods: {
      /**
       * 获取分类列表
       */
      getCategoryList() {
        uniCloud.callFunction({
          name: "blind_type_list",
          data: {
            openid: this.openid,
            page: 1,
            limit: 100
          },
          success: (res) => {
            this.typeListData = res.result.data.list
            if (this.typeListData?.length > 0) {
              this.activeCategory = this.typeListData[0]._id
              this.getDataList()
            }
          }
        })
      },
      /**
       * 获取对应分类的数据列表
       */
      getDataList() {
        uniCloud.callFunction({
          name: "blind_list",
          data: {
            openid: this.openid,
            page: 1,
            limit: 100,
            type: this.activeCategory
          },
          success: (res) => {
            this.dataList = res.result.data.list
          }
        })
      },
      /**
       * 切换分类，重新获取资源
       * @param {Object} id
       */
      async onHandleChangeCategory(id) {
        this.activeCategory = id
        this.getDataList()
      },
      onAddBlind(item) {
        this.content = [{
            iconPath: '/static/img/blind-add-type.png',
            selectedIconPath: '/static/img/blind-add-type-active.png',
            text: '类型',
            active: false
          },
          {
            iconPath: '/static/img/blind-add.png',
            selectedIconPath: '/static/img/blind-add-active.png',
            text: '盲盒',
            active: false
          }
        ]
        
        const index = item.index
        this.$refs.fab.close()
        
        if(index === 0) {
          uni.navigateTo({
            url: '/pages/blind-type/blind-type'
          })
        }else{
          uni.navigateTo({
            url: '/pages/blind-add/blind-add'
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .blind-container {
    position: relative;
    width: 100%;
  }

  .left-list {
    position: fixed;
    // top: 0;
    width: 35%;
    overflow: hidden;
    background-color: #7a7e8373;
    color: #FFF;

    .list-item {
      color: black;
      height: 100rpx;
      line-height: 100rpx;
      padding: 2px 10px;
      overflow: hidden;
      border-left: 3px solid transparent;

      &.active {
        background-color: #d81e0661;
        font-weight: 600;
        color: #FFF;
        border-left: 3px solid #d81e06;
      }
    }
  }

  .right-list {
    width: 65%;
    // background-color: red;
    color: #eee;
    position: absolute;
    left: 35%;
    padding-bottom: 50px;

    ::v-deep .right-list__img {
      width: 100%;
      max-height: 300rpx;
    }
  }
</style>