<template>
  <view class="container">
    <uni-forms
      ref="baseForm"
      :modelValue="dataInfo"
      label-position="top"
      label-width="100"
    >
      <uni-forms-item
        label="通告栏内容:"
        name="content"
        required
      >
        <textarea
          v-model="dataInfo.content"
          auto-height
          placeholder="请输入通告栏内容"
        />
      </uni-forms-item>
      <uni-forms-item
        label="截止时间:"
        required
      >
        <uni-datetime-picker
          returnType="timestamp"
          v-model="dataInfo.time"
          :clear-icon="false"
        />
      </uni-forms-item>
      <uni-forms-item
        label="是否显示:"
        required
      >
        <switch
          :checked="dataInfo.isShow"
          @change="onChangeShow"
        />
      </uni-forms-item>
      <uni-forms-item
        label="是否是倒计时模式:"
        required
      >
        <switch
          :checked="dataInfo.isTimeDown"
          @change="onChangeTimeDown"
        />
      </uni-forms-item>
      <uni-forms-item
        v-if="previewShow"
        label="展示效果预览为:"
        required
      >
        <u-notice-bar
          :text="previewShow"
          color="#d81e06"
          bgColor="white"
          duration="2000"
        />
      </uni-forms-item>
    </uni-forms>
    <u-button
      text="保存"
      @click="onAdd"
      color="linear-gradient(to right, rgb(66, 83, 216), rgb(213, 51, 186))"
    ></u-button>
  </view>
</template>
<script>
import { noticeGet, noticeAdd, noticeEdit } from "@/api/notice.js";
export default {
  data() {
    return {
      dataInfo: {
        content: "",
        time: "",
        isShow: true,
        // 是否倒计时样式
        isTimeDown: true,
      },
    };
  },
  computed: {
    // 预览效果
    previewShow() {
      if (this.dataInfo.isTimeDown) {
        if (!this.dataInfo.content || !this.dataInfo.time) {
          return "";
        }
        // 获取当前日期和目标日期
        const now = new Date();
        const target = new Date(this.dataInfo.time);

        // 计算时间差（以毫秒为单位）
        const timeDiff = target - now;

        // 如果时间差小于0，表示目标日期已经过去
        if (timeDiff < 0) {
          return "目标日期已过去";
        }

        // 计算天数、小时、分钟和秒数
        const seconds = Math.floor((timeDiff / 1000) % 60);
        const minutes = Math.floor((timeDiff / 1000 / 60) % 60);
        const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        return `距离${this.dataInfo.content}还有${days}天${hours}时${minutes}分`;
      } else {
        return this.dataInfo.content;
      }
    },
  },
  created() {
    this.getData();
  },
  methods: {
    onChangeShow(e) {
      this.dataInfo.isShow = e.detail.value;
    },
    onChangeTimeDown(e) {
      this.dataInfo.isTimeDown = e.detail.value;
    },
    /**
     * 获取列表数据
     */
    getData() {
      noticeGet().then((res) => {
        this.dataInfo =
          res.length > 0
            ? { ...res[0] }
            : {
                content: "",
                time: "",
                isShow: true,
                // 是否倒计时样式
                isTimeDown: true,
              };
      });
    },
    onAdd() {
      if (!this.dataInfo._id) {
        noticeAdd(this.dataInfo).then(() => {
          uni.showToast({
            title: "保存成功",
            icon: "success",
          });
        });
      } else {
        noticeEdit(this.dataInfo).then(() => {
          uni.showToast({
            title: "保存成功",
            icon: "success",
          });
        });
      }
    },
  },
};
</script>

<style scoped>
.container {
  padding: 20rpx 30rpx;
}

.form-time {
  line-height: 36px;
}
</style>
