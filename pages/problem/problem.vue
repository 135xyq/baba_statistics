<template>
  <view>
    <uni-calendar :date="date" @monthSwitch="monthSwitch" class="uni-calendar--hook" :selected="selected"
      @change="onChange" />
    <view>
      <uni-fab :pattern="pattern" horizontal="right" vertical="bottom" :pop-menu="false" @fabClick="onAddRecord" />
    </view>
    <view v-if="dataList.length > 0" class="use-time">
      <text style="color: #d81e06;margin-right: 5px">{{ date }} </text>
      <text>做题时长：</text>
      <text class="use-time-text">{{ formateDateHMS(useTimeAll) }}</text>
    </view>
    <view class="use-time" style="text-align: center;" v-else>
      <text style="color: #d81e06;margin-right: 5px">{{ date }} </text>
      <text>还没做题</text>
    </view>
    <view v-if="isLoading" class="loading">
      <u-loading-icon color="#d81e06" textColor="#d81e06" vertical text="努力加载中..." />
    </view>
    <view v-else>
      <view class="list">
        <uni-card v-for="(item, index) in dataList" :key="index" :title="item.typeName" :extra="formateTime(item.time)">
          <view class="list-body">
            <view class="list-body-item">
              <text class="list-body-item__label">答题数量：</text>
              <text class="list-body-item__value list-body-item__value--total">{{ item.totalNumber }}</text>
            </view>
            <view class="list-body-item">
              <text class="list-body-item__label">错题数量：</text>
              <text class="list-body-item__value list-body-item__value--error">{{ item.errorNumber }}</text>
            </view>
            <view class="list-body-item">
              <text class="list-body-item__label">答题时长：</text>
              <text class="list-body-item__value list-body-item__value--warning">
                {{ formateDateHMS(item.useTime || 0) }}
              </text>
            </view>
            <view class="list-body-item">
              <text class="list-body-item__label">正确率：</text>
              <text class="list-body-item__value list-body-item__value--rotate" :style="{
                color: ((item.totalNumber - item.errorNumber) / item.totalNumber) * 100 < 60 ? '#fa3534' : '#19be6b',
              }">
                {{
                  item.totalNumber > 0
                    ? (((item.totalNumber - item.errorNumber) / item.totalNumber) * 100).toFixed(2) + "%"
                    : 0 + "%"
                }}
              </text>
            </view>
            <view class="buttons">
              <u-button @click="onEdit(item)" :custom-style="{ width: '36px', height: '36px', marginRight: '10px' }"
                shape="circle" type="primary" icon="edit-pen-fill" />
              <u-button @click="onDelete(item)" :custom-style="{ width: '36px', height: '36px' }" shape="circle"
                type="error" icon="trash-fill" />
            </view>
          </view>
        </uni-card>
        <view class="chart" v-if="roundChartData.length > 0">
          <qiun-data-charts type="pie" :opts="opts" :chartData="chartData" />
        </view>
        <view class="chart1" v-if="roundChartData.length > 0">
          <qiun-data-charts type="mix" :opts="opts1" :chartData="chartData1" />
        </view>
      </view>
    </view>
    <!-- 自定义导航 -->
    <custom-tab />
  </view>
</template>

<script>
import { formateDate, formateDateHMS } from "@/utils/formateDate.js";
import formateTime from "@/utils/formateDate.js";
import { problemDelete, problemGetDay, problemGetMonth, problemGetRoundChart } from '@/api/problem';
const colorList = ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"];
const colorList1 = ["#73C0DE", "#FC8452", "#9A60B4", "#ea7ccc"];
const colorList2 = ["#1890FF", "#91CB74", "#FAC858", "#EE6666"];
export default {
  data() {
    return {
      selected: [],
      pattern: {
        color: "#7A7E83",
        backgroundColor: "#fff",
        selectedColor: "#d81e06",
        buttonColor: "#d81e06",
        iconColor: "#fff",
      },
      // 加载中
      isLoading: false,
      // 做题数据列表
      dataList: [],
      // 做题时间
      useTimeAll: 0,
      // 当前日期
      date: formateDate(new Date().getTime()),
      // 日期信息
      monthDate: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
      },
      roundChartData: [],
      chartData: {},
      //您可以通过修改 config-ucharts.js 文件中下标为 ['pie'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
      opts: {
        color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
        padding: [5, 5, 5, 5],
        enableScroll: false,
        tooltip: {
          show: false,
          formatter: (item) => {
            return `${item.typeName}: 10000`;
          },
        },
        extra: {
          pie: {
            activeOpacity: 0.5,
            activeRadius: 10,
            offsetAngle: 0,
            labelWidth: 15,
            border: false,
            borderWidth: 3,
            borderColor: "#FFFFFF",
            linearType: "custom",
          },
        },
      },
      chartData1: {},
      //您可以通过修改 config-ucharts.js 文件中下标为 ['column'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
      opts1: {
        color: colorList,
        padding: [30, 15, 10, 15],
        enableScroll: false,
        legend: {},
        xAxis: {
          disableGrid: true,
        },
        yAxis: {
          disabled: false,
          disableGrid: false,
          splitNumber: 5,
          gridType: "dash",
          dashLength: 4,
          gridColor: "#CCCCCC",
          padding: 10,
          showTitle: true,
          data: [
            {
              position: "left",
              min: 0,
              title: "题目数量",
              titleOffsetY: -10,
            },
            {
              position: "right",
              min: 0,
              max: 100,
              title: "正确率",
              textAlign: "left",
              titleOffsetY: -10,
            },
          ],
        },
        extra: {
          mix: {
            column: {
              type: "group",
              width: 30,
              activeBgColor: "#000000",
              activeBgOpacity: 0.08,
              meterBorder: 3,
              meterFillColor: "#EBFBD6",
            },
          },
        },
      },
    };
  },
  onShow() {
    this.getMonthData();
    this.getTodayData();
    this.getRoundChartsData();
  },

  methods: {
    formateDateHMS,
    formateTime,
    /**
     * 更改月份
     * @param date
     */
    monthSwitch(date) {
      this.monthDate = {
        ...date,
      };
      this.getMonthData();
    },
    /**
     * 新增
     */
    onAddRecord() {
      uni.navigateTo({
        url: "/pages/problem-add/problem-add?date=" + this.date,
      });
    },
    /**
     * 删除
     * @param item
     */
    onDelete(item) {
      uni.showModal({
        title: "提示",
        content: "确定删除该记录？",
        success: (res) => {
          if (res.confirm) {
            problemDelete(item).then(() => {
              this.getMonthData();
              this.getTodayData();
              this.getRoundChartsData();
              uni.showToast({
                title: `删除成功`,
                icon: "none",
                duration: 2000,
              });
            })
          }
        },
      });
    },
    /**
     * 编辑
     * @param item
     */
    onEdit(item) {
      uni.navigateTo({
        url: "/pages/problem-add/problem-add?data=" + JSON.stringify(item),
      });
    },
    /**
     * 获取指定天的数据
     */
    getTodayData() {
      this.isLoading = true;
      problemGetDay({ date: this.date, }).then(res => {
        this.dataList = res.list;
        this.useTimeAll = res.useTimeAll;
        this.isLoading = false;
      })
    },
    /**
     * 修改选中日期
     * @param time 选中的日期
     */
    onChange(time) {
      this.isLoading = true;
      this.date = time.fulldate;
      this.monthDate = {
        year: time.year,
        month: time.month,
      };
      problemGetDay({ date: time.fulldate }).then(res => {
        this.dataList = res.list;
        this.useTimeAll = res.useTimeAll;
        this.isLoading = false;
      })
      this.getRoundChartsData();
    },
    /**
     * 获取月份的做题信息，正确率
     */
    getMonthData() {
      this.isLoading = true;
      problemGetMonth({ date: this.monthDate, }).then(data => {
        this.selected = [];
        for (let key in data) {
          const item = data[key];
          if (item.count !== 0) {
            let rotate = 0;
            if (item.totalNumber > 0) {
              // console.log(item);
              rotate = (((item.totalNumber - item.errorNumber) / item.totalNumber) * 100).toFixed(2);
            }
            this.selected.push({
              date: key,
              info: rotate + "%",
            });
          }
        }
        this.isLoading = false;
      })
    },
    /**
     * 获取圆环图数据
     */
    getRoundChartsData() {
      this.isLoading = true;
      problemGetRoundChart({ date: this.date, }).then(data => {
        this.roundChartData = data.map((item) => {
          return {
            name: item._id.typeName,
            value: item.totalNumber,
            labelText: item._id.typeName + ":" + item.totalNumber,
          };
        });

        this.chartData = {
          series: [
            {
              data: this.roundChartData,
            },
          ],
        };

        // 类型
        const category = data.map((item) => item._id.typeName);
        // 总题数
        const totalNumber = data.map((item) => item.totalNumber);
        // 错误题数
        const errorNumber = data.map((item) => item.errorNumber);
        const rotate = [];
        for (let i = 0; i < totalNumber.length; i++) {
          if (totalNumber[i] > 0) {
            rotate[i] = (((totalNumber[i] - errorNumber[i]) / totalNumber[i]) * 100).toFixed(2);
          } else {
            rotate[i] = 0;
          }
        }

        this.chartData1 = {
          categories: category,
          series: [
            {
              name: "总题数",
              type: "column",
              color: colorList1[Math.floor(Math.random() * colorList1.length)],
              data: totalNumber,
            },
            {
              name: "错题数",
              type: "column",
              color: colorList2[Math.floor(Math.random() * colorList2.length)],
              data: errorNumber,
            },
            {
              name: "正确率",
              type: "line",
              index: 1,
              color: "#158c15",
              data: rotate,
            },
          ],
        };
        this.isLoading = false;
      })
    },
  },
};
</script>

<style scoped lang="scss">
.list {
  padding-bottom: 100rpx;

  &-body {
    &-item {
      position: relative;

      &__label {
        font-weight: 600;
      }

      &__value {
        font-weight: 700;

        &--total {
          color: #2979ff;
        }

        &--error {
          color: #fa3534;
        }

        &--warning {
          color: #ff9900;
        }

        &--rotate {
          color: #19be6b;
        }
      }
    }
  }

  .buttons {
    position: absolute;
    display: flex;
    top: 60px;
    right: 30rpx;
  }

  .chart {
    width: 100%;
    height: 300px;
    margin-bottom: 40rpx;
  }

  .chart1 {
    width: 100%;
    height: 380px;
  }
}

.use-time {
  padding: 10px 15px;
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;

  &-text {
    color: #e8990a;
    font-size: 22px;
  }
}

.loading {
  margin-top: 200rpx;
}
::v-deep .uni-fab__circle{
  bottom: 200rpx !important;
}
</style>
