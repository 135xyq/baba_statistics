<template>
  <view>
    <view class="header">
      <view class="header-button">
        <u-button text="新增盲盒" @click="onAdd"
          color="linear-gradient(to right, rgb(66, 83, 216), rgb(213, 51, 186))"></u-button>
      </view>
    </view>
    <view class="uni-container">
      <uni-table ref="table" :loading="loading" border stripe emptyText="暂无更多数据">
        <uni-tr>
          <uni-th align="center">名称</uni-th>
          <uni-th align="center">价格</uni-th>
          <uni-th align="center">图片</uni-th>
          <uni-th align="center">类型</uni-th>
          <uni-th align="center">备注</uni-th>
          <uni-th align="center">时间</uni-th>
          <uni-th align="center">操作</uni-th>
        </uni-tr>
        <uni-tr v-for="(item, index) in tableData" :key="index">
          <uni-td align="center">
            <view class="item">{{ item.name }}</view>
          </uni-td>
          <uni-td align="center"class="item">{{ item.price }}</uni-td>
          <uni-td align="center" class="item">
            <image class="image" :src="item.coverImg"></image>
          </uni-td>
           <uni-td align="center" class="item">{{ item.type }}</uni-td>
            <uni-td align="center" class="item">{{ item.remark }}</uni-td>
          <uni-td align="center" class="item">{{ item.createTime }}</uni-td>
          <uni-td align="center" class="item">
            <view class="uni-group">
              <button class="uni-button" size="mini" type="primary" @click="onEdit(item)">修改</button>
              <button class="uni-button" size="mini" type="warn" @click="onDelete(item)">删除</button>
            </view>
          </uni-td>
        </uni-tr>
      </uni-table>
      <view class="uni-pagination-box">
        <uni-pagination :page-size="pageSize" :current="pageCurrent" :total="total" @change="change" />
      </view>
    </view>
    <u-popup :show="isShowDialog" mode="center" :closeable="true" @close="onCloseDialog">
      <view class="form">
        <u--form labelPosition="left" :model="blindDataForm" :rules="rules" ref="uForm">
          <u-form-item label="名称" prop="name" borderBottom>
            <u--input v-model="blindDataForm.name" border="none" maxlength="20"></u--input>
          </u-form-item>
          <u-form-item label="类型" prop="coverImg" borderBottom>
              <uni-data-select v-model="blindDataForm.type" :localdata="typeList"></uni-data-select>
          </u-form-item>
          <u-form-item label="价格" prop="price" borderBottom>
            <u--input v-model="blindDataForm.price" border="none" maxlength="20"></u--input>
          </u-form-item>
          <u-form-item label="图片" prop="coverImg" borderBottom>
            <u-avatar @click="onHandleSetAvatar" :src="blindDataForm.coverImg" shape="square" size="80"></u-avatar>
          </u-form-item>
          <u-form-item label="备注" prop="coverImg" borderBottom>
          <u--textarea v-model="blindDataForm.remark" placeholder="请输入备注" random-bg-color autoHeight maxlength="120" count></u--textarea>
          </u-form-item>
        </u--form>
        <u-button text="保存" @click="onSave"
          color="linear-gradient(to right, rgb(66, 83, 216), rgb(213, 51, 186))"></u-button>
      </view>
    </u-popup>
  </view>
</template>


<script>
  import formateDate from "@/utils/formateDate.js"
  export default {
    data() {
      return {
        tableData: [],
        // 每页数据量
        pageSize: 10,
        // 当前页
        pageCurrent: 1,
        // 数据总量
        total: 0,
        openid: '',
        // 数据是否正在加载
        loading: false,
        // 是否显示弹窗
        isShowDialog: false,
        // 盲盒表单
        blindDataForm: {
          name: '',
          coverImg: '',
          price:'',
          remark:'',
          type:''
        },
        // 类型列表
        typeList: [],
        // 类型
        type: 'add',
        // 是否正在上传图片
        isUploadImg: false,
        // 校验规则
        rules: {
          'name': {
            type: 'string',
            required: true,
            message: '请填写名称',
            trigger: ['blur']
          }
        },
      }
    },
    onShow() {
      if (this.$store.state.userInfo?.userInfo?.openid) {
        const state = this.$store.state.userInfo?.userInfo
        this.openid = state.openid
        if (this.openid) {
          this.getDataList()
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
            this.typeList = res.result.data?.list.map(item=>{
              return {
                text: item.name,
                value: item._id
              }
            })
          }
        })
      },
      /**
       * 获取表格数据
       */
      getDataList() {
        this.loading = true
        uniCloud.callFunction({
          name: "blind_list",
          data: {
            openid: this.openid,
            page: this.pageCurrent,
            limit: this.pageSize
          },
          success: (res) => {
            this.tableData = res.result.data.list
            this.total = res.result.data.total
            this.loading = false
          }
        })
      },
      /**
       * 分页
       * @param {Object} e
       */
      change(e) {
        this.getDataList()
      },
      /**
       * 修改头像
       */
      async onHandleSetAvatar() {
        uni.chooseImage({
          count: 1,
          success: res => {
            this.blindDataForm.coverImg = res.tempFilePaths[0]
            this.isUploadImg = true
          }
        })
      },
      /**
       * 删除数据
       * @param {Object} data
       */
      onDelete(data) {
        uni.showModal({
          title: '提示',
          content: `确定要删除${data.name}`,
          success: (res) => {
            if (res.confirm) {
              uniCloud.callFunction({
                name: "blind_delete",
                data: {
                  _id: data._id
                },
                success: (res) => {
                  uni.showToast({
                    icon: 'success',
                    title: '删除成功！'
                  })
                  this.getDataList()
                }
              })

            }
          }
        });

      },
      /**
       * 新增
       */
      onAdd() {
        this.type = 'add'
        this.blindDataForm = {
          name: '',
          coverImg: '',
          price:'',
          remark:'',
          type:''
        },
        this.isShowDialog = true
      },
      /**
       * 编辑
       * @param {Object} data
       */
      onEdit(data) {
        this.blindDataForm = {
          ...data
        }

        this.type = 'edit'
        this.isShowDialog = true
      },
      /**
       * 关闭弹窗
       */
      onCloseDialog() {
        this.isShowDialog = false
        this.blindDataForm = {
          name: '',
          coverImg: '',
          price:'',
          remark:'',
          type:''
        }
      },
      /**
       * 提交信息
       */
      onSave() {
        this.$refs.uForm.validate().then(async res => {
          let img
          if(this.isUploadImg) {
             img = await this.getFileId()
          }
          if (this.type === 'add') {
            const now = new Date().getTime()
            uniCloud.callFunction({
              name: "blind_add",
              data: {
                openid: this.openid,
                ...this.blindDataForm,
                coverImg: img,
                createTime: formateDate(now),
                time: now
              },
              success: (res) => {
                uni.showToast({
                  title: '新增成功',
                  icon: 'success'
                })
                this.isShowDialog = false
                this.getDataList()
              }
            })
          } else {
            uniCloud.callFunction({
              name: "blind_edit",
              data: {
                ...this.blindDataForm,
                coverImg: img,
              },
              success: (res) => {
                uni.showToast({
                  title: '修改成功',
                  icon: 'success'
                })
                this.isShowDialog = false
                this.getDataList()
              }
            })
          }
        }).catch(errors => {})
      },
      // 获取所有的id结果
      getFileId() {
        return new Promise(async resolve => {
          const result = await uniCloud.uploadFile({
            filePath: this.blindDataForm.coverImg,
            cloudPath: new Date().getTime() + '-' + Math.random(0,1)
          })
          resolve(result.fileID)
        })
      },

    }
  }
</script>

<style scoped>
  .header {
    margin: 30rpx;
  }

  .uni-group {
    display: flex;
    align-items: center;
  }
  
  .item{
    display: flex;
    align-items: center;
    justify-content: center;
  }

  
  .image{
    width: 150rpx;
    height: 150rpx;
  }

  .form {
    padding: 60rpx 40rpx 40rpx 40rpx;
  }
</style>