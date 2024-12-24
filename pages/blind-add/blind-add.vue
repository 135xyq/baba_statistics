<template>
  <view>
    <view class="header">
      <view class="header-button">
        <u-button
          text="新增盲盒"
          @click="onAdd"
          color="linear-gradient(to right, rgb(66, 83, 216), rgb(213, 51, 186))"
        />
      </view>
    </view>
    <view class="uni-container">
      <uni-table
        ref="table"
        :loading="loading"
        border
        stripe
        emptyText="暂无更多数据"
      >
        <uni-tr>
          <uni-th align="center">名称</uni-th>
          <uni-th align="center">价格</uni-th>
          <uni-th align="center">图片</uni-th>
          <uni-th align="center">类型</uni-th>
          <uni-th align="center">备注</uni-th>
          <uni-th align="center">时间</uni-th>
          <uni-th align="center">操作</uni-th>
        </uni-tr>
        <uni-tr
          v-for="(item, index) in tableData"
          :key="index"
        >
          <uni-td align="center">
            <view class="item">{{ item.name }}</view>
          </uni-td>
          <uni-td
            align="center"
            class="item"
          >
            {{ item.price }}
          </uni-td>
          <uni-td
            align="center"
            class="item"
          >
            <image
              class="image"
              :src="item.coverImg"
              @click="onPreviewImage(item)"
            ></image>
          </uni-td>
          <uni-td
            align="center"
            class="item"
          >
            {{ item.typeName }}
          </uni-td>
          <uni-td
            align="center"
            class="item"
          >
            {{ item.remark }}
          </uni-td>
          <uni-td
            align="center"
            class="item"
          >
            {{ item.createTime }}
          </uni-td>
          <uni-td
            align="center"
            class="item"
          >
            <view class="uni-group">
              <button
                class="uni-button"
                size="mini"
                type="primary"
                @click="onEdit(item)"
              >
                修改
              </button>
              <button
                class="uni-button"
                size="mini"
                type="warn"
                @click="onDelete(item)"
              >
                删除
              </button>
            </view>
          </uni-td>
        </uni-tr>
      </uni-table>
      <view class="uni-pagination-box">
        <uni-pagination
          :page-size="pageSize"
          :current="pageCurrent"
          :total="total"
          @change="change"
        />
      </view>
    </view>
    <u-popup
      :show="isShowDialog"
      mode="center"
      :closeable="true"
      @close="onCloseDialog"
    >
      <view class="form">
        <u--form
          labelPosition="left"
          :model="blindDataForm"
          :rules="rules"
          ref="uForm"
        >
          <u-form-item
            label="名称"
            prop="name"
            borderBottom
          >
            <u--input
              v-model="blindDataForm.name"
              border="none"
              maxlength="20"
            />
          </u-form-item>
          <u-form-item
            label="类型"
            prop="coverImg"
            borderBottom
          >
            <uni-data-select
              v-model="blindDataForm.type"
              :localdata="typeList"
            />
          </u-form-item>
          <u-form-item
            label="价格"
            prop="price"
            borderBottom
          >
            <u--input
              v-model="blindDataForm.price"
              border="none"
              maxlength="20"
            />
          </u-form-item>
          <u-form-item
            label="图片"
            prop="coverImg"
            borderBottom
          >
            <u-avatar
              @click="onHandleSetAvatar"
              :src="blindDataForm.coverImg"
              shape="square"
              size="80"
            />
          </u-form-item>
          <u-form-item
            label="备注"
            prop="coverImg"
            borderBottom
          >
            <u--textarea
              v-model="blindDataForm.remark"
              placeholder="请输入备注"
              random-bg-color
              autoHeight
              maxlength="120"
              count
            />
          </u-form-item>
        </u--form>
        <u-button
          text="保存"
          @click="onSave"
          color="linear-gradient(to right, rgb(66, 83, 216), rgb(213, 51, 186))"
        />
      </view>
    </u-popup>
  </view>
</template>

<script>
import formateDate from "@/utils/formateDate.js";
import { blindAdd, blindDelete, blindEdit, blindList, blindTypeList } from "@/api/blind";
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
      openid: "",
      // 数据是否正在加载
      loading: false,
      // 是否显示弹窗
      isShowDialog: false,
      // 盲盒表单
      blindDataForm: {
        name: "",
        coverImg: "",
        price: "",
        remark: "",
        type: "",
      },
      // 类型列表
      typeList: [],
      // 类型
      type: "add",
      // 是否正在上传图片
      isUploadImg: false,
      // 校验规则
      rules: {
        name: {
          type: "string",
          required: true,
          message: "请填写名称",
          trigger: ["blur"],
        },
      },
    };
  },
  onShow() {
    this.getDataList();
    this.getCategoryList();
  },
  methods: {
    /**
     * 获取分类列表
     */
    getCategoryList() {
      blindTypeList({
        page: 1,
        limit: 100,
      }).then((res) => {
        this.typeList = res?.list.map((item) => {
          return {
            text: item.name,
            value: item._id,
          };
        });
      });
    },
    /**
     * 获取表格数据
     */
    getDataList() {
      this.loading = true;
      blindList({ page: this.pageCurrent, limit: this.pageSize }).then((res) => {
        this.tableData = res.list;
        this.total = res.total;
        this.loading = false;
      });
    },
    /**
     * 分页
     */
    change() {
      this.getDataList();
    },
    /**
     * 选择图片
     */
    async onHandleSetAvatar() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          this.blindDataForm.coverImg = res.tempFilePaths[0];
          this.isUploadImg = true;
        },
      });
    },
    /**
     * 删除数据
     * @param {Object} data
     */
    onDelete(data) {
      uni.showModal({
        title: "提示",
        content: `确定要删除${data.name}`,
        success: (res) => {
          if (res.confirm) {
            blindDelete({ _id: data._id }).then(() => {
              uni.showToast({
                icon: "success",
                title: "删除成功！",
              });
              this.getDataList();
            });
          }
        },
      });
    },
    /**
     * 新增
     */
    onAdd() {
      this.type = "add";
      this.blindDataForm = {
        name: "",
        coverImg: "",
        price: "",
        remark: "",
        type: "",
      };
      this.isShowDialog = true;
    },
    /**
     * 编辑
     * @param {Object} data
     */
    onEdit(data) {
      this.blindDataForm = {
        ...data,
      };

      this.type = "edit";
      this.isShowDialog = true;
    },
    /**
     * 关闭弹窗
     */
    onCloseDialog() {
      this.isShowDialog = false;
      this.blindDataForm = {
        name: "",
        coverImg: "",
        price: "",
        remark: "",
        type: "",
      };
    },
    /**
     * 提交信息
     */
    onSave() {
      this.$refs.uForm
        .validate()
        .then(async () => {
          let img;
          if (this.isUploadImg) {
            img = await this.getFileId();
          }
          // 新增
          if (this.type === "add") {
            const now = new Date().getTime();
            const data = { ...this.blindDataForm, coverImg: img, createTime: formateDate(now), time: now };
            blindAdd(data).then(() => {
              uni.showToast({
                title: "新增成功",
                icon: "success",
              });
              this.isShowDialog = false;
              this.getDataList();
            });
          } else {
            const data = { ...this.blindDataForm, ...this.blindDataForm, coverImg: img };
            blindEdit(data).then(() => {
              uni.showToast({
                title: "修改成功",
                icon: "success",
              });
              this.isShowDialog = false;
              this.getDataList();
            });
          }
        })
        .catch(() => {});
    },
    // 获取所有的id结果
    getFileId() {
      return new Promise(async (resolve) => {
        const result = await uniCloud.uploadFile({
          filePath: this.blindDataForm.coverImg,
          cloudPath: new Date().getTime() + "-" + Math.random(0, 1),
        });
        resolve(result.fileID);
      });
    },
    /**
     * 图片预览
     * @param {Object} data
     */
    onPreviewImage(data) {
      if (data.coverImg) {
        uni.previewImage({
          current: data.coverImg,
          urls: [data.coverImg],
        });
      }
    },
  },
};
</script>

<style scoped>
.header {
  margin: 30rpx;
}

.uni-group {
  display: flex;
  align-items: center;
}

.item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.image {
  width: 150rpx;
  height: 150rpx;
}

.form {
  padding: 60rpx 40rpx 40rpx 40rpx;
}
</style>
