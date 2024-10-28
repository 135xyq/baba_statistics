<template>
  <view>
    <view class="header">
      <view class="header-button">
        <u-button text="新增选项" @click="onAdd"
          color="linear-gradient(to right, rgb(66, 83, 216), rgb(213, 51, 186))"></u-button>
      </view>
    </view>
    <view>
      <u-swipe-action>
        <u-swipe-action-item v-for="(item,index) in dataList" :key="item" :options="options"
          @click="itemClick(item,$event)">
          <view class="swipe-action u-border-top u-border-bottom">
            <view class="swipe-action__content">
              <text class="swipe-action__content__text">{{item.text}}( 概率: {{item.range}})</text>
            </view>
          </view>
        </u-swipe-action-item>
      </u-swipe-action>
    </view>
    <view>
      <u-popup :show="show" mode="center" :closeable="true" @close="close">
        <view class="form">
          <u--form labelPosition="left" :model="luckyData" :rules="rules" ref="uForm">
            <u-form-item label="名称" prop="text" borderBottom>
              <u--input v-model="luckyData.text" border="none" maxlength="20"></u--input>
            </u-form-item>
            <u-form-item label="概率" borderBottom>
              <u-slider v-model="luckyData.range" step="1" min="0" max="10" :showValue="true"></u-slider>
            </u-form-item>
          </u--form>
          <u-button text="保存" @click="onSave"
            color="linear-gradient(to right, rgb(66, 83, 216), rgb(213, 51, 186))"></u-button>
        </view>
      </u-popup>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        openid:'',
        show: false,
        luckyData: {
          text: '',
          range: 1
        },
        type: 'add',
        dataList: [],
        rules: {
          'text': {
            type: 'string',
            required: true,
            message: '请填写名称',
            trigger: ['blur']
          }
        },
        options: [{
          text: '删除',
          style: {
            backgroundColor: '#f56c6c',
          }
        }, {
          text: '编辑',
          style: {
            backgroundColor: '#3c9cff',
          }
        }]
      };
    },
    created() {

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
            this.dataList = res.result.data
          }
        })
      },
      onAdd() {
        this.luckyData = {
          text: '',
          range: 1
        }
        this.type = 'add'
        this.show = true
      },
      onSave() {
        this.$refs.uForm.validate().then(res => {
          if (this.type === 'add') {
            uniCloud.callFunction({
              name: "lucky_add",
              data: {
                openid: this.openid,
                text: this.luckyData.text,
                range: this.luckyData.range
              },
              success: (res) => {
                uni.showToast({
                  title: '新增成功',
                  icon: 'success'
                })
                this.show = false
                this.getList()
              }
            })
          }else{
            uniCloud.callFunction({
              name: "lucky_edit",
              data: this.luckyData,
              success: (res) => {
                uni.showToast({
                  title: '修改成功',
                  icon: 'success'
                })
                this.show = false
                this.getList()
              }
            })
          }
        }).catch(errors => {
        })
      },
      close() {
        this.show = false
      },
      itemClick(item, e) {
        if (e.index === 1) {
          this.luckyData = {
            ...item
          }
          this.type = 'edit'
          this.show = true
        } else {

          uni.showModal({
            title: '提示',
            content: '确定删除选项？',
            success: (res) => {
              if (res.confirm) {
                uniCloud.callFunction({
                  name: "lucky_delete",
                  data: item,
                  success: (res) => {
                    this.getList()
                    uni.showToast({
                      title: '删除成功',
                      icon: 'success'
                    })
                  }
                })
              }
            }
          })

        }
      }
    },
  }
</script>

<style lang="scss">
  .u-page {
    padding: 0;
  }

  .u-demo-block__title {
    padding: 10px 0 2px 15px;
  }

  .swipe-action {
    border-bottom: 1px solid #eee;

    &__content {
      padding: 25rpx 0;

      &__text {
        font-size: 15px;
        color: $u-main-color;
        padding-left: 30rpx;
      }
    }
  }

  .header {
    margin: 30rpx;
  }

  .form {
    padding: 60rpx 40rpx 40rpx 40rpx;
  }
</style>