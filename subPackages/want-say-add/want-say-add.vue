<template>
  <view>
    <!-- 新增表单 -->
    <view class="form">
      <u--form
        labelWidth="auto"
        labelPosition="top"
        :model="addForm"
      >
        <u-form-item
          label="发送的内容:"
          prop="content"
          borderBottom
        >
          <u--textarea
            v-model="addForm.content"
            border="surround"
            placeholder="请输入内容"
            count
            maxlength="200"
          />
        </u-form-item>
        <u-form-item
          label="要发送的对象:"
          prop="content"
          borderBottom
        >
          <uni-data-select
            v-model="addForm.toUserOpenId"
            :localdata="userList"
          />
        </u-form-item>
        <u-form-item label="是否发送:">
          <u-switch
            v-model="addForm.status"
            activeColor="#d81e06"
          />
        </u-form-item>
        <u-form-item label="字体颜色:">
          <div
            class="color-show"
            :style="{ background: fontColor }"
            @click="onOpenColorChoose"
          />
          <t-color-picker
            ref="colorPicker"
            :color="addForm.color"
            @confirm="onColorConfirm"
          />
        </u-form-item>
      </u--form>
      <view class="button">
        <u-button
          text="查看预览效果"
          @click="isWantSayShow = true"
          color="linear-gradient(to right, rgb(213, 51, 186), rgb(66, 83, 216))"
          :disabled="!addForm.content"
        />
      </view>
      <view class="button">
        <u-button
          text="保存"
          @click="onSave"
          color="linear-gradient(to right, rgb(66, 83, 216), rgb(213, 51, 186))"
        />
      </view>
    </view>
    <!-- 预览效果 -->
    <u-modal
      :show="isWantSayShow"
      title="想对你说"
    >
      <template slot="default">
        <view
          class="want-say-content"
          :style="{ color: fontColor }"
        >
          {{ addForm.content }}
        </view>
      </template>
      <u-button
        slot="confirmButton"
        @click="isWantSayShow = false"
        color="linear-gradient(to right, rgb(66, 83, 216), rgb(213, 51, 186))"
      >
        收到了
      </u-button>
    </u-modal>
  </view>
</template>

<script>
import formateDate from "@/utils/formateDate.js";
import { wantSayAdd, wantSayEdit } from "@/api/wantSay";
import { userGetList } from "@/api/user";
import tColorPicker from "@/components/t-color-picker/t-color-picker.vue";
export default {
  components: {
    tColorPicker,
  },
  data() {
    return {
      // 获取用户列表
      userList: [],
      // 新增表单数据
      addForm: {
        // 内容
        content: "",
        // 对谁发送
        toUserOpenId: "",
        // 开启
        status: true,
        // 颜色
        color: { r: 241, g: 148, b: 138, a: 0.5 },
      },
      openid: "",
      // 类型，新增或编辑
      type: "add",
      // 预览效果查看
      isWantSayShow: false,
    };
  },
  computed: {
    // 字体颜色
    fontColor() {
      return `rgba(${this.addForm.color.r},${this.addForm.color.g},${this.addForm.color.b},${this.addForm.color.a})`;
    },
  },
  onLoad(options) {
    this.type = options.type;
    if (this.type === "edit") {
      this.addForm = JSON.parse(options.data);
      const color = this.addForm.color ? JSON.parse(this.addForm?.color): { r: 241, g: 148, b: 138, a: 0.5 }
      this.$set(this.addForm, "color", color)
    }
    this.getUserList();
  },
  methods: {
    /**
     * 获取用户列表
     */
    getUserList() {
      userGetList({
        type: "list",
      }).then((res) => {
        this.userList = res?.map((item) => {
          return {
            text: item.nickName,
            value: item.openid,
          };
        });
      });
    },
    /**
     * 颜色选择确认
     * @param e
     */
    onColorConfirm(e) {
      this.$set(this.addForm, "color", e.rgba)
    },
    /**
     * 打开颜色选择器
     */
    onOpenColorChoose() {
      this.$refs.colorPicker?.open();
    },
    /**
     * 保存
     */
    onSave() {
      if (this.type === "edit") {
        const data = {
          ...this.addForm,
          color: JSON.stringify(this.addForm.color),
        };
        wantSayEdit(data).then(() => {
          uni.showToast({
            title: "修改成功",
            icon: "success",
          });
          setTimeout(() => {
            uni.navigateBack();
          }, 1000);
        });
      } else {
        const now = new Date().getTime();
        wantSayAdd({
          ...this.addForm,
          createTime: formateDate(now),
          color: JSON.stringify(this.addForm.color),
        }).then(() => {
          uni.showToast({
            title: "新增成功",
            icon: "success",
          });
          setTimeout(() => {
            uni.navigateBack();
          }, 1000);
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.form {
  padding: 20rpx 20rpx 0 20rpx;
}

.button {
  margin-top: 60rpx;
}

.color-show {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
}

.want-say-content {
  margin: 50rpx 0;
  text-align: left;
  font-size: 36rpx;
  color: #ec5a86;
  font-weight: 600;
}
</style>
