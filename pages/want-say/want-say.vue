<template>
  <view class="container">
    <u-subsection :list="tabList" :current="currentTab" mode="subsection" @change="onTabChange" activeColor="#d81e06"
      inactiveColor="#7A7E83" />
    <view class="loading" v-if="isLoading">
      <u-loading-icon color="#d81e06" textColor="#d81e06" vertical text="努力加载中..."></u-loading-icon>
    </view>
    <view v-else>
      <view v-if="list.length > 0" class="list">
        <uni-card v-for="item in list" :key="item._id" :title="item.toUserName" :extra="item.createTime"
          :thumbnail="item.avatarUrl">
          <template v-slot:title>
            <view class="card-title">
              <view class="left">
                <u-avatar :src="currentTab === 0 ? item.toUserAvatarUrl : item.avatarUrl" size="40" />
                <view class="left-info">
                  <view class="left-info__name">{{currentTab === 0 ? item.toUserNickName : item.nickName}}</view>
                  <view class="left-info__date">{{item.createTime}}</view>
                </view>
              </view>
              <view class="right-operate">
                <u-switch v-model="item.status" v-if="currentTab!==1" activeColor="#d81e06"
                  @change="onHandleStatusChange(item)" />
              </view>
            </view>
          </template>
          <text class="uni-body" @longpress="onHandleLongPress(item)">{{item.content}}</text>
        </uni-card>
      </view>
      <view v-else class="empty">
        <u-empty mode="message" width="1" text="暂时无话可说" />
      </view>
    </view>
    <!-- 操作菜单 -->
    <view>
      <u-action-sheet 
        :closeOnClickOverlay="true" 
        :closeOnClickAction="true" 
        :actions="actionList" 
        :show="isShowAction"
        @close="isShowAction = false"
        @select="onHandleSelectAction"
      />
    </view>
    <view>
      <!-- 前往新增页面 -->
      <uni-fab :pattern="pattern" horizontal="right" vertical="bottom" :pop-menu="false"
        @fabClick="onAddPage"></uni-fab>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // tab列表
        tabList: ['已发送', '收到'],
        // 当前的tab
        currentTab: 0,
        // 列表
        list: [],
        openid: '',
        isLoading: true,
        // 悬浮按钮配置
        pattern: {
          color: '#7A7E83',
          backgroundColor: '#fff',
          selectedColor: '#d81e06',
          buttonColor: '#d81e06',
          iconColor: '#fff',
          icon: 'plusempty'
        },
        // 是否显示操作菜单
        isShowAction: false,
        // 操作列表
        actionList: [{
            name: '修改',
            color: '#000',
            fontSize: '20'
          },
          {
            name: '删除',
            color: '#d81e06',
            fontSize: '20'
          },
        ],
        // 当前要操作的数据
        currentInfo:{}
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
      /**
       * 切换tab
       * @param {Object} index
       */
      onTabChange(index) {
        this.currentTab = index
        this.getList()
      },
      /**
       * 获取列表
       */
      getList() {
        this.isLoading = true
        uniCloud.callFunction({
          name: "want-say-list",
          data: {
            openid: this.openid,
            type: this.currentTab
          },
          success: (res) => {
            this.list = res.result.data
            this.isLoading = false
          }
        })
      },
      /**
       * 状态编辑
       * @param {Object} data
       */
      onHandleStatusChange(data) {
        console.log(data);
        uniCloud.callFunction({
          name: "want_say_edit_status",
          data,
          success: (res) => {
            this.getList()
          },
          fail() {
            data.status = !data.status
          }
        })
      },
      /**
       * 前往新增或编辑页面
       */
      onAddPage() {
        uni.navigateTo({
          url: '/pages/want-say-add/want-say-add?type=add'
        })
      },
      /**
       * 长按内容，出现编辑和删除的操作弹窗
       * @param {Object} data 数据
       */
      onHandleLongPress(data) {
        this.isShowAction = true
        this.currentInfo = {...data}
      },
      /**
       * 点击操作后的回调
       * @param {Object} e
       */
      onHandleSelectAction(e){
        const name = e.name
        if(name === '修改'){
          uni.navigateTo({
            url:`/pages/want-say-add/want-say-add?type=edit&data=${JSON.stringify(this.currentInfo)}`
          })
        }else if(name === '删除') {
          uni.showModal({
            title: '提示',
            content: '确定要删除想对他说的话？',
            cancelText: '点错了',
            confirmText: '确定',
            success: (res) => {
              if (res.confirm) {
                uniCloud.callFunction({
                  name: "want_say_delete",
                  data: {
                    _id:this.currentInfo._id
                  },
                  success: (res) => {
                    this.getList()
                    uni.showToast({
                      title: `删除成功`,
                      icon: 'success',
                      duration: 2000
                    });
                  }
                })
              }
            },
          });
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .loading,
  .empty {
    margin-top: 400rpx;
  }

  .card-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15rpx;
    border-bottom: 1px solid #e6e6e6;


    .left {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }

    .left-info {
      margin-left: 12rpx;

      &__name {
        font-size: 30rpx;
      }

      &__date {
        margin-top: 10rpx;
        font-size: 26rpx;
        color: #919191;
      }
    }
  }
</style>