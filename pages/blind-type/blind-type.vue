<template>
  <view>
    <view class="header">
      <view class="header-button">
        <u-button text="新增盲盒类型" @click="onAdd"
          color="linear-gradient(to right, rgb(66, 83, 216), rgb(213, 51, 186))"></u-button>
      </view>
    </view>
    <view class="uni-container">
      <uni-table ref="table" :loading="loading" border stripe emptyText="暂无更多数据">
        <uni-tr>
          <uni-th align="center">名称</uni-th>
          <uni-th align="center">日期</uni-th>
          <uni-th align="center">操作</uni-th>
        </uni-tr>
        <uni-tr v-for="(item, index) in tableData" :key="index">
          <uni-td align="center">{{ item.name }}</uni-td>
          <uni-td align="center">{{ item.createTime }}</uni-td>
          <uni-td align="center">
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
        <u--form labelPosition="left" :model="blindTypeDataForm" :rules="rules" ref="uForm">
          <u-form-item label="名称" prop="name" borderBottom>
            <u--input v-model="blindTypeDataForm.name" border="none" maxlength="20"></u--input>
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
        // 盲盒类型表单
        blindTypeDataForm: {
          name: ''
        },
        // 类型
        type: 'add',
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
        }
      } else {
        uni.switchTab({
          url: '/pages/login/login'
        })
      }
    },
    methods: {
      /**
       * 获取表格数据
       */
      getDataList() {
        this.loading = true
        uniCloud.callFunction({
          name: "blind_type_list",
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
                name: "blind_type_delete",
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
        this.blindTypeDataForm = {
          name: ''
        }
        this.isShowDialog = true
      },
      /**
       * 编辑
       * @param {Object} data
       */
      onEdit(data) {
        this.blindTypeDataForm = {
          _id: data._id,
          name: data.name
        }

        this.type = 'edit'
        this.isShowDialog = true
      },
      /**
       * 关闭弹窗
       */
      onCloseDialog() {
        this.isShowDialog = false
        this.blindTypeDataForm = {
          name: ''
        }
      },
      /**
       * 提交信息
       */
      onSave() {
        this.$refs.uForm.validate().then(res => {
          if (this.type === 'add') {
            const now = new Date().getTime()
            uniCloud.callFunction({
              name: "blind_type_add",
              data: {
                openid: this.openid,
                name: this.blindTypeDataForm.name,
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
              name: "blind_type_edit",
              data: this.blindTypeDataForm,
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
      }

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

  .form {
    padding: 60rpx 40rpx 40rpx 40rpx;
  }
</style>