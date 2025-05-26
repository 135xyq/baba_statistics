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
import {weightGetMonthChart} from '@/api/weight';
const colorList = ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"];
export default {
  data() {
    return {
      date: new Date(),
      chartData: {},
      //您可以通过修改 config-ucharts.js 文件中下标为 ['line'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
      opts: {
        color: [colorList[Math.floor(Math.random() * colorList.length)]],
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
              min: 40,
              max: 120,
              title: "体重（KG）",
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
    console.log(11);
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
      weightGetMonthChart({
        date: this.date
      }).then(data=>{
        const value = Object.values(data);
        let max = Math.max(...value);
        max = max % 10 === 0 ? max : Math.ceil(max / 10) * 10
        const min = Math.min(...value);
        this.chartData = {
          categories: Object.keys(data),
          series: [
            {
              name: "体重",
              data: value,
            },
          ],
        };
        
        this.opts.yAxis.splitNumber = 10;
        this.opts.yAxis.data[0].max = max;
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
