<template>
  <view>
    <view class="date">
      <picker
        fields="month"
        mode="date"
        :value="date"
        start="2024-09-01"
        end="2099-12-31"
        @change="bindDateChange"
      >
        <view class="date-text">{{ date }}</view>
      </picker>
    </view>
    <view class="charts-box">
      <qiun-data-charts
        type="line"
        :opts="opts"
        :chartData="chartData"
      />
    </view>
  </view>
</template>

<script>
import {problemGetMonthLine} from '@/api/problem';

export default {
  data() {
    return {
      date: new Date(),
      typeList: [
        {
          text: "全部题目",
          value: "all",
        },
        {
          text: "言语理解",
          value: "yanyu",
        },
        {
          text: "资料分析",
          value: "ziliao",
        },
        {
          text: "判断推理",
          value: "panduan",
        },
        {
          text: "数量关系",
          value: "shuliang",
        },
        {
          text: "常识判断",
          value: "changshi",
        },
      ],
      chartData: {},
      //您可以通过修改 config-ucharts.js 文件中下标为 ['line'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
      opts: {
        color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
        padding: [20, 10, 20, 15],
        enableScroll: false,
        legend: {},
        xAxis: {
          disableGrid: true,
          rotateLabel: true,
        },
        yAxis: {
          gridType: "dash",
          dashLength: 2,
          showTitle: true,
          data: [
            {
              min: 0,
              max: 100,
              title: "正确率（%）",
              titleOffsetY: -10,
            },
          ],
        },
        extra: {
          line: {
            type: "straight",
            width: 2,
            activeType: "hollow",
          },
        },
      },
    };
  },
  created() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    this.date = year + "-" + (month < 10 ? "0" + month : month);
  },
  onReady() {
    this.getData();
  },
  methods: {
    /**
     * 选中日期
     * @param e
     */
    bindDateChange(e) {
      this.date = e.detail.value;
      this.getData();
    },
    /**
     * 获取数据
     */
    getData() {
      problemGetMonthLine({
        date: this.date
      }).then(data=>{
        const categories = Object.keys(data);
        const series = this.typeList.map((item) => {
          return {
            name: item.text,
            connectNulls: true,
            data: [],
          };
        });
        const values = Object.values(data);
        for (let i = 0; i < values.length; i++) {
          for (let j = 0; j < this.typeList.length; j++) {
            if (values[i][this.typeList[j].value]) {
              const tempData = values[i][this.typeList[j].value];
              series[j].data[i] =
                tempData.totalNumber > 0
                  ? (((tempData.totalNumber - tempData.errorNumber) / tempData.totalNumber) * 100).toFixed(2)
                  : 0;
            } else {
              series[j].data[i] = null;
            }
          }
        }

        this.chartData = {
          categories,
          series,
        };
      })
    },
  },
};
</script>

<style scoped>
.date {
  width: 100%;
}

.date-text {
  margin-top: 10rpx;
  font-size: 20px;
  padding-left: 5rpx;
  font-weight: 700;
  color: #d81e06;
}

/* 请根据实际需求修改父元素尺寸，组件自动识别宽高 */
.charts-box {
  width: 100%;
  height: 300px;
  margin-left: 15rpx;
}
</style>
