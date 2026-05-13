<template>
  <view class="container">
    <uni-forms
      ref="baseForm"
      :rules="rules"
      :modelValue="dataInfo"
      label-width="100"
    >
      <uni-forms-item
        label="题目类型:"
        name="type"
        required
      >
        <uni-data-select
          v-model="dataInfo.type"
          :localdata="typeList"
        />
      </uni-forms-item>
      <uni-forms-item
        label="做题数量:"
        name="totalNumber"
        required
      >
        <uni-number-box
          :min="0"
          :max="1000"
          v-model="dataInfo.totalNumber"
        ></uni-number-box>
      </uni-forms-item>
      <uni-forms-item
        label="错题数量:"
        name="errorNumber"
        required
      >
        <uni-number-box
          :min="0"
          :max="1000"
          v-model="dataInfo.errorNumber"
        />
      </uni-forms-item>
      <uni-forms-item
        label="做题时间:"
        required
      >
        <uni-datetime-picker
          returnType="timestamp"
          v-model="dataInfo.time"
          :clear-icon="false"
        />
      </uni-forms-item>
      <uni-forms-item label="做题时长:">
        <view
          class="form-time"
          @click="timeShow = true"
        >
          {{ dataInfo.useTime }}
        </view>
        <u-picker
          :show="timeShow"
          ref="uPicker"
          :columns="timeColumns"
          @confirm="onTimePickerConfirm"
          @cancel="timeShow = false"
          confirmColor="#d81e06"
          title="选择做题时长"
        />
      </uni-forms-item>
    </uni-forms>
    <u-button
      :text="type === 'add' ? '新增记录' : '修改记录'"
      @click="onAdd"
      :disabled="loading"
      color="linear-gradient(to right, rgb(66, 83, 216), rgb(213, 51, 186))"
    />
  </view>
</template>

<script>
/**
 * 添加做题记录页
 * 新增或编辑做题记录，包含题目类型、做题数量、错题数量、做题时间和做题时长
 */
import { formateDateHMS } from "@/utils/formateDate.js";
import { problemAdd, problemEdit } from '@/api/problem';
export default {
  data() {
    return {
      /** 是否正在加载 */
      loading: false,
      /** 操作类型：add新增 / edit编辑 */
      type: "add",
      /** 题目数据 */
      dataInfo: {
        type: "",
        totalNumber: 0,
        errorNumber: 0,
        time: Date.now(),
        useTime: "00:00:00",
      },
      /** 题目类型列表 */
      typeList: [
        { text: "言语理解", value: 1 },
        { text: "资料分析", value: 2 },
        { text: "判断推理", value: 3 },
        { text: "数量关系", value: 4 },
        { text: "常识判断", value: 5 },
        { text: "政治理论", value: 6 },
        { text: "申论", value: 7 },
      ],
      /** 表单校验规则 */
      rules: {
        type: {
          rules: [{ required: true, errorMessage: "请选择题目类型" }],
          label: "题目类型",
          validateTrigger: "submit",
        },
        totalNumber: {
          rules: [{ maximum: 999, minimum: 1, errorMessage: "做题数量不合法" }],
          label: "做题数量",
          validateTrigger: "submit",
        },
        errorNumber: {
          rules: [{ maximum: 999, minimum: 0, errorMessage: "错题数量不合法" }],
          label: "错题数量",
          validateTrigger: "submit",
        },
      },
      /** 时间选择器列数据 */
      timeColumns: [[], [], []],
      /** 时间选择器是否显示 */
      timeShow: false,
    };
  },
  onReady() {
    this.$refs.baseForm.setRules(this.rules);
  },
  onLoad(query) {
    this.initTimeColumns();

    if (query.date) {
      const now = new Date();
      const [year, month, day] = query.date.split("-");
      const targetDate = new Date(year, month - 1, day, now.getHours(), now.getMinutes(), now.getSeconds());
      this.dataInfo.time = targetDate.getTime();
    }

    if (query.useTime) {
      this.dataInfo.useTime = formateDateHMS(Number(query.useTime));
    } else {
      this.dataInfo.useTime = "00:00:00";
    }

    if (query.data) {
      const problemData = JSON.parse(query.data);
      let useTime = "00:00:00";
      if (problemData.useTime) {
        useTime = formateDateHMS(problemData.useTime);
      }

      this.dataInfo = {
        type: problemData.type,
        totalNumber: problemData.totalNumber,
        errorNumber: problemData.errorNumber,
        time: typeof problemData.time === 'number' ? problemData.time : new Date(problemData.time).getTime(),
        useTime: useTime,
        _id: problemData._id,
      };
      this.type = "edit";
    } else {
      this.dataInfo = {
        ...this.dataInfo,
        type: "",
        totalNumber: 0,
        errorNumber: 0,
      };
      this.type = "add";
    }
  },
  methods: {
    /**
     * 初始化时间选择器列数据（时、分、秒）
     */
    initTimeColumns() {
      for (let i = 0; i < 24; i++) {
        this.timeColumns[0][i] = i < 10 ? "0" + i : "" + i;
      }
      for (let i = 0; i <= 59; i++) {
        const val = i < 10 ? "0" + i : "" + i;
        this.timeColumns[1][i] = val;
        this.timeColumns[2][i] = val;
      }
    },
    /**
     * 时间选择器确认回调
     * @param {Object} e - 选择器返回值
     */
    onTimePickerConfirm(e) {
      this.timeShow = false;
      this.dataInfo.useTime = e.value.join(":");
    },
    /**
     * 根据类型值获取类型文本
     * @param {number} value - 类型值
     * @returns {string} 类型文本
     */
    getText(value) {
      const item = this.typeList.find(t => t.value === value);
      return item ? item.text : "未知类型";
    },
    /**
     * 提交表单（新增或编辑）
     */
    onAdd() {
      if (this.loading) {
        this.loading = false;
        return;
      }
      this.$refs.baseForm
        .validate((err) => {
          if (!err) {
            if (this.dataInfo.errorNumber > this.dataInfo.totalNumber) {
              uni.showToast({ title: "错题数量不合法", icon: "error" });
              return;
            }
            const [hours, minutes, seconds] = this.dataInfo.useTime.split(":");
            const useTime = Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
            const data = {
              ...this.dataInfo,
              useTime: useTime,
              typeName: this.getText(this.dataInfo.type),
            };

            const requestFn = this.type === "add" ? problemAdd : problemEdit;
            requestFn(data).then(() => {
              uni.showToast({
                title: this.type === "add" ? "新增成功" : "修改成功",
                icon: "success",
              });
              setTimeout(() => {
                uni.navigateBack();
              }, 1000);
            });
          }
        })
        .then(() => {});
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
