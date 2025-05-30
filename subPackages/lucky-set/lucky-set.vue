<template>
  <view>
    <view class="header">
      <view class="header-button">
        <u-button
          text="新增选项"
          @click="onAdd"
          color="linear-gradient(to right, rgb(66, 83, 216), rgb(213, 51, 186))"
        />
      </view>
    </view>
    <view>
      <u-swipe-action>
        <u-swipe-action-item
          v-for="(item, index) in dataList"
          :key="item"
          :options="options"
          @click="itemClick(item, $event)"
        >
          <view class="swipe-action u-border-top u-border-bottom">
            <view class="swipe-action__content">
              <text class="swipe-action__content__text">{{ item.text }}( 概率: {{ item.range }})</text>
            </view>
          </view>
        </u-swipe-action-item>
      </u-swipe-action>
    </view>
    <view>
      <u-popup
        :show="show"
        mode="center"
        :closeable="true"
        @close="close"
      >
        <view class="form">
          <u--form
            labelPosition="left"
            :model="luckyData"
            :rules="rules"
            ref="uForm"
          >
            <u-form-item
              label="名称"
              prop="text"
              borderBottom
            >
              <u--input
                v-model="luckyData.text"
                border="none"
                maxlength="20"
              ></u--input>
            </u-form-item>
            <u-form-item
              label="概率"
              borderBottom
            >
              <u-slider
                v-model="luckyData.range"
                step="1"
                min="0"
                max="10"
                :showValue="true"
              ></u-slider>
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
  </view>
</template>

<script>
import { luckyAdd, luckyDelete, luckyEdit, luckyList } from "@/api/lucky";

export default {
  data() {
    return {
      // 表单弹窗
      show: false,
      luckyData: {
        text: "",
        range: 1,
      },
      // 类型
      type: "add",
      // 数据列表
      dataList: [],
      rules: {
        text: {
          type: "string",
          required: true,
          message: "请填写名称",
          trigger: ["blur"],
        },
      },
      options: [
        {
          text: "删除",
          style: {
            backgroundColor: "#f56c6c",
          },
        },
        {
          text: "编辑",
          style: {
            backgroundColor: "#3c9cff",
          },
        },
      ],
    };
  },
  onShow() {
    this.getList();
  },
  methods: {
    /**
     * 获取列表
     */
    getList() {
      luckyList().then((res) => {
        this.dataList = res;
      });
    },
    /**
     * 新增
     */
    onAdd() {
      this.luckyData = {
        text: "",
        range: 1,
      };
      this.type = "add";
      this.show = true;
    },
    /**
     * 编辑或保存
     */
    onSave() {
      this.$refs.uForm
        .validate()
        .then(() => {
          if (this.type === "add") {
            luckyAdd({
              text: this.luckyData.text,
              range: this.luckyData.range,
            }).then(() => {
              uni.showToast({
                title: "新增成功",
                icon: "success",
              });
              this.close();
              this.getList();
            });
          } else {
            luckyEdit(this.luckyData).then(() => {
              uni.showToast({
                title: "修改成功",
                icon: "success",
              });
              this.close();
              this.getList();
            });
          }
        })
        .catch(() => {});
    },
    /**
     * 关闭弹窗
     */
    close() {
      this.show = false;
    },
    /**
     * 删除或编辑
     * @param item
     * @param e
     */
    itemClick(item, e) {
      if (e.index === 1) {
        this.luckyData = {
          ...item,
        };
        this.type = "edit";
        this.show = true;
      } else {
        uni.showModal({
          title: "提示",
          content: "确定删除选项？",
          success: (res) => {
            if (res.confirm) {
              luckyDelete(item).then(() => {
                this.getList();
                uni.showToast({
                  title: "删除成功",
                  icon: "success",
                });
              });
            }
          },
        });
      }
    },
  },
};
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
