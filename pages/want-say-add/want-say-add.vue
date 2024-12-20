<template>
  <view>
    <!-- 新增表单 -->
    <view class="form">
      <u--form labelWidth="auto" labelPosition="top" :model="addForm">
        <u-form-item label="发送的内容:" prop="content" borderBottom>
          <u--textarea v-model="addForm.content" border="surround" placeholder="请输入内容" count maxlength="200" />
        </u-form-item>
        <u-form-item label="要发送的对象:" prop="content" borderBottom>
          <uni-data-select v-model="addForm.toUserOpenId" :localdata="userList" />
        </u-form-item>
        <u-form-item label="是否发送:">
          <u-switch v-model="addForm.status" activeColor="#d81e06"></u-switch>
        </u-form-item>
      </u--form>
      <view class="button">
        <u-button text="保存" @click="onSave"
          color="linear-gradient(to right, rgb(66, 83, 216), rgb(213, 51, 186))"></u-button>
      </view>
    </view>
  </view>
</template>

<script>
  import formateDate from "@/utils/formateDate.js"
  export default {
    data() {
      return {
        // 获取用户列表
        userList: [],
        // 新增表单数据
        addForm: {
          // 内容
          content: '',
          // 对谁发送
          toUserOpenId: '',
          // 开启
          status: true
        },
        openid: '',
        // 类型，新增或编辑
        type:'add'
      }
    },
    onLoad(options) {
      this.type = options.type
      if(this.type === 'edit') {
        this.addForm = JSON.parse(options.data)
      }
      if (this.$store.state.userInfo?.userInfo?.openid) {
        const state = this.$store.state.userInfo?.userInfo
        this.openid = state.openid
        if (this.openid) {
          this.getUserList()
        }
      } else {
        uni.switchTab({
          url: '/pages/login/login'
        })
      }
    },
    methods: {
      /**
       * 获取用户列表
       */
      getUserList() {
        uniCloud.callFunction({
          name: "get_user_list",
          data: {
            openid: this.openid,
            type: 'list'
          },
          success: (res) => {
            this.userList = res.result.data?.map(item => {
              return {
                text: item.nickName,
                value: item.openid
              }
            })
          },
        })
      },
      /**
       * 保存
       */
      onSave() {
        if(this.type === 'edit') {
          uniCloud.callFunction({
            name: "want_say_edit",
            data: {
              ...this.addForm,
            },
            success: (res) => {
              uni.showToast({
                title: '修改成功',
                icon: 'success'
              })
              setTimeout(()=>{
                uni.navigateBack()
              },1000)
            }
          })
        }else{
          const now = new Date().getTime()
          uniCloud.callFunction({
            name: "want_say_add",
            data: {
              openid: this.openid,
              ...this.addForm,
              createTime: formateDate(now),
            },
            success: (res) => {
              uni.showToast({
                title: '新增成功',
                icon: 'success'
              })
              setTimeout(()=>{
                uni.navigateBack()
              },1000)
            }
          })
        }
        
      }
    }
  }
</script>

<style scoped lang="scss">
  .form {
    padding: 20rpx 20rpx 0 20rpx;
  }

  .button {
    margin-top: 60rpx;
  }
</style>