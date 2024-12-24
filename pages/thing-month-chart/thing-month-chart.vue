<template>
  <view class="charts-box">
    <qiun-data-charts
      type="line"
      :opts="opts"
      :chartData="chartData"
    />
  </view>
</template>

<script>
import {thingGetMonthChart} from '@/api/thing';

const colorList = ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"];
export default {
  data() {
    return {
      chartData: {},
      //您可以通过修改 config-ucharts.js 文件中下标为 ['line'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
      opts: {
        color: [colorList[Math.floor(Math.random() * colorList.length)]],
        padding: [15, 10, 20, 15],
        enableScroll: false,
        xAxis: {
          disableGrid: true,
          rotateLabel: true,
        },
        yAxis: {
          showTitle: true,
          splitNumber: 3,
          disableGrid: true,
          data: [
            {
              min: 0,
              max: 3,
              title: "拉屎次数",
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
        legend: {
          show: false,
        },
      },
    };
  },
  onReady() {
    this.getData();
  },
  methods: {
    /**
     * 获取折线图数据
     */
    getData() {
      thingGetMonthChart().then(data=>{
        const value = Object.values(data);
        const max = Math.max(...value);
        const min = Math.min(...value);
        this.chartData = {
          categories: Object.keys(data),
          series: [
            {
              name: "拉屎次数",
              data: value,
            },
          ],
        };

        this.opts.yAxis.splitNumber = max;
        this.opts.yAxis.data[0].max = max;
      })
    },
  },
};
</script>

<style scoped >
/* 请根据实际需求修改父元素尺寸，组件自动识别宽高 */
.charts-box {
  width: 100%;
  height: 300px;
  margin-left: 15rpx;
}
</style>
