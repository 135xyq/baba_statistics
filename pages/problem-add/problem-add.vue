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
        <!-- 时间选择 -->
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
import { formateDateHMS } from "@/utils/formateDate.js";
import {problemAdd, problemEdit} from '@/api/problem';
export default {
  data() {
    return {
      // 是否正在加载
      loading: false,
      type: "add",
      // 题目数据
      dataInfo: {
        type: "",
        totalNumber: 0,
        errorNumber: 0,
        time: new Date(),
        useTime: "00:00:00",
      },
      // 题目类型
      typeList: [
        {
          text: "言语理解",
          value: 1,
        },
        {
          text: "资料分析",
          value: 2,
        },
        {
          text: "判断推理",
          value: 3,
        },
        {
          text: "数量关系",
          value: 4,
        },
        {
          text: "常识判断",
          value: 5,
        },
        {
          text: "申论",
          value: 6,
        },
      ],
      rules: {
        type: {
          rules: [
            // 校验 name 不能为空
            {
              required: true,
              errorMessage: "请选择题目类型",
            },
          ],
          // 当前表单域的字段中文名，可不填写
          label: "题目类型",
          validateTrigger: "submit",
        },
        totalNumber: {
          rules: [
            // 校验 name 不能为空
            {
              maximum: 999,
              minimum: 1,
              errorMessage: "做题数量不合法",
            },
          ],
          // 当前表单域的字段中文名，可不填写
          label: "做题数量",
          validateTrigger: "submit",
        },
        errorNumber: {
          rules: [
            // 校验 name 不能为空
            {
              maximum: 999,
              minimum: 0,
              errorMessage: "错题数量不合法",
            },
          ],
          // 当前表单域的字段中文名，可不填写
          label: "错题数量",
          validateTrigger: "submit",
        },
      },
      // 时间选择器
      timeColumns: [[], [], []],
      // 时间选择器是否显示
      timeShow: false,
    };
  },
  onReady() {
    // 需要在onReady中设置规则
    this.$refs.baseForm.setRules(this.rules);
  },
  onLoad(query) {
    // 初始化时间选择器
    for (let i = 0; i < 24; i++) {
      if (i < 10) {
        this.timeColumns[0][i] = "0" + i;
      } else {
        this.timeColumns[0][i] = i + "";
      }
    }
    for (let i = 0; i <= 59; i++) {
      if (i < 10) {
        this.timeColumns[1][i] = "0" + i;
        this.timeColumns[2][i] = "0" + i;
      } else {
        this.timeColumns[1][i] = i + "";
        this.timeColumns[2][i] = i + "";
      }
    }

    // 接收参数
    if (query.date) {
      const now = new Date();
      const hour = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const [year, month, day] = query.date.split("-");
      this.dataInfo.time = new Date(year, month - 1, day, hour, minutes, seconds);
    }
    if (query.useTime) {
      this.dataInfo.useTime = formateDateHMS(query.useTime);
    } else {
      this.dataInfo.useTime = "00:00:00";
    }

    // 有数据就是编辑
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
        time: problemData.time,
        useTime: useTime,
        _id: problemData._id,
      };

      this.type = "edit";
    } else {
      // 新增
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
     * 时间选择器确认
     * @param e
     */
    onTimePickerConfirm(e) {
      this.timeShow = false;
      this.dataInfo.useTime = e.value.join(":");
    },
    /**
     * 获取类型文本
     * @param value
     * @returns {string|*|string}
     */
    getText(value) {
      for (let key in this.typeList) {
        if (value === this.typeList[key].value) {
          return this.typeList[key].text;
        }
      }
      return "未知类型";
    },
    /**
     * 添加题目
     */
    onAdd() {
      if (this.loading) {
        this.loading = false;
        return;
      }
      this.$refs.baseForm
        .validate((err) => {
          // 如果校验成功 ，err 返回 null
          if (!err) {
            if (this.dataInfo.errorNumber > this.dataInfo.totalNumber) {
              uni.showToast({
                title: "错题数量不合法？",
                icon: "error",
              });
              return;
            }
            const [hours, minutes, seconds] = this.dataInfo.useTime.split(":");
            const useTime = Number(hours * 3600) + Number(minutes * 60) + Number(seconds);
            if (this.type === "add") {
              const data = {
                ...this.dataInfo,
                useTime: useTime,
                typeName: this.getText(this.dataInfo.type),
              }
              problemAdd(data).then(()=>{
                uni.showToast({
                  title: "新增成功",
                  icon: "success",
                });
                setTimeout(() => {
                  uni.navigateBack();
                }, 1000);
              })
            } else {
              const data = {
                ...this.dataInfo,
                useTime: useTime,
                typeName: this.getText(this.dataInfo.type),
              }
              problemEdit(data).then(()=>{
                uni.showToast({
                  title: "修改成功",
                  icon: "success",
                });
                setTimeout(() => {
                  uni.navigateBack();
                }, 1000);
              })
            }
          }
        })
        .then(() => {
          // res 返回 null
        });
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
