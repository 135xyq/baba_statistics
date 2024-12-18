<template>
  <view>
    <uni-calendar :date="date" @monthSwitch="monthSwitch" class="uni-calendar--hook" :selected="selected"
      @change="onChange" />
    <view>
      <uni-fab :pattern="pattern" horizontal="right" vertical="bottom" :pop-menu="false"
        @fabClick="onAddRecord"></uni-fab>
    </view>
    <view v-if="dataList.length > 0" class="use-time">{{date}} 做题时长：<text
        class="use-time-text">{{formateDateHMS(useTimeAll)}}</text>
    </view>
    <view class="use-time" style="text-align: center;" v-else>{{date}} 还没做题</view>
    <view v-if="isLoading" class="loading">
      <u-loading-icon color="#d81e06" textColor="#d81e06" vertical text="努力加载中..."></u-loading-icon>
    </view>
    <view v-else>
      <view class="list">
        <uni-card v-for="(item,index) in dataList" :key="index" :title="item.typeName" :extra="formateTime(item.time)">
          <view class="list-body">
            <view class="list-body-item">
              <text class="list-body-item__label">答题数量：</text>
              <text class="list-body-item__value list-body-item__value--total">{{item.totalNumber}} </text>
            </view>
            <view class="list-body-item">
              <text class="list-body-item__label">错题数量：</text>
              <text class="list-body-item__value list-body-item__value--error">{{item.errorNumber}} </text>
            </view>
            <view class="list-body-item">
              <text class="list-body-item__label">答题时长：</text>
              <text class="list-body-item__value list-body-item__value--warning"">{{formateDateHMS(item.useTime || 0)}} </text>
      			</view>
      			<view class=" list-body-item">
                <text class="list-body-item__label">正确率：</text>
                <text class="list-body-item__value list-body-item__value--rotate"
                  :style="{color: ((item.totalNumber - item.errorNumber) / item.totalNumber * 100) <  60 ? '#fa3534':'#19be6b'}">{{item.totalNumber > 0 ?((item.totalNumber - item.errorNumber) / item.totalNumber * 100).toFixed(2) + '%' : (0 + '%')}}
                </text>
            </view>
            <view class="buttons">
              <u-button @click="onEdit(item)" :custom-style="{width:  '36px',height:'36px',marginRight:'10px'}"
                shape="circle" type="primary" icon="edit-pen-fill"></u-button>
              <u-button @click="onDelete(item)" :custom-style="{width:  '36px',height:'36px'}" shape="circle"
                type="error" icon="trash-fill"></u-button>
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
  </view>
</template>

<script>
  import {
    formateDate,
    formateDateHMS
  } from "@/utils/formateDate.js"
  import formateTime from "@/utils/formateDate.js"
  const colorList = ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
    "#ea7ccc"
  ]
  const colorList1 = ["#73C0DE", "#FC8452", "#9A60B4", "#ea7ccc"]
  const colorList2 = ["#1890FF", "#91CB74", "#FAC858", "#EE6666"]
  export default {
    data() {
      return {
        selected: [],
        openId: '',
        pattern: {
          color: '#7A7E83',
          backgroundColor: '#fff',
          selectedColor: '#d81e06',
          buttonColor: '#d81e06',
          iconColor: '#fff'
        },
        // 加载中
        isLoading: false,
        // 做题数据列表
        dataList: [],
        // 做题时间
        useTimeAll: 0,
        date: formateDate(new Date().getTime()),
        monthDate: {
          year: (new Date()).getFullYear(),
          month: (new Date()).getMonth() + 1
        },
        roundChartData: [],
        chartData: {},
        //您可以通过修改 config-ucharts.js 文件中下标为 ['pie'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
        opts: {
          color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
            "#ea7ccc"
          ],
          padding: [5, 5, 5, 5],
          enableScroll: false,
          tooltip: {
            show: false,
            formatter: (item) => {
              return `${item.typeName}: 10000`;
            }
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
              linearType: "custom"
            }
          }
        },
        chartData1: {},
        //您可以通过修改 config-ucharts.js 文件中下标为 ['column'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
        opts1: {
          color: colorList,
          padding: [30, 15, 10, 15],
          enableScroll: false,
          legend: {},
          xAxis: {
            disableGrid: true
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
            data: [{
                position: "left",
                min: 0,
                title: "题目数量",
                titleOffsetY: -10
              },
              {
                position: "right",
                min: 0,
                max: 100,
                title: "正确率",
                textAlign: "left",
                titleOffsetY: -10
              }
            ]
          },
          extra: {
            mix: {
              column: {
                type: "group",
                width: 30,
                activeBgColor: "#000000",
                activeBgOpacity: 0.08,
                meterBorder: 3,
                meterFillColor: "#EBFBD6"
              }
            }
          }
        }

      }
    },
    onShow() {
      if (this.$store.state.userInfo?.userInfo?.openid) {
        const state = this.$store.state.userInfo?.userInfo
        this.openId = state.openid
        this.getDayList()
        this.getTodayData()
        this.getRoundChartsData()
      } else {
        uni.switchTab({
          url: '/pages/login/login'
        })
      }
    },

    methods: {
      formateDateHMS,
      formateTime,
      monthSwitch(date) {
        this.monthDate = {
          ...date
        }
        this.getDayList()
      },
      onAddRecord() {
        uni.navigateTo({
          url: '/pages/addProblem/addProblem?date=' + this.date
        })
      },
      onDelete(item) {
        uni.showModal({
          title: '提示',
          content: '确定删除该记录？',
          success: (res) => {
            if (res.confirm) {
              uniCloud.callFunction({
                name: "problem_delete",
                data: item,
                success: (res) => {
                  this.getDayList()
                  this.getTodayData()
                  this.getRoundChartsData()
                  uni.showToast({
                    title: `删除成功`,
                    icon: 'none',
                    duration: 2000
                  });
                }
              })
            }
          },
        });
      },
      onEdit(item) {
        uni.navigateTo({
          url: '/pages/addProblem/addProblem?data=' + JSON.stringify(item)
        })
      },
      getTodayData() {
        this.isLoading = true
        uniCloud.callFunction({
          name: "problem_get_day",
          data: {
            openid: this.openId,
            date: this.date
          },
          success: (res) => {
            // console.log(res);
            this.dataList = res.result.data.list
            this.useTimeAll = res.result.data.useTimeAll
            this.isLoading = false
          }
        })
      },
      onChange(time) {
        this.isLoading = true
        // console.log(time);
        this.date = time.fulldate
        this.monthDate = {
          year: time.year,
          month: time.month
        }
        uniCloud.callFunction({
          name: "problem_get_day",
          data: {
            openid: this.openId,
            date: time.fulldate
          },
          success: (res) => {
            // console.log(res);
            this.dataList = res.result.data.list
            this.useTimeAll = res.result.data.useTimeAll
            this.isLoading = false
          }
        })
        this.getRoundChartsData()
      },
      // 获取当天的数据列表
      getDayList() {
        this.isLoading = true
        uniCloud.callFunction({
          name: "problem_get_month",
          data: {
            openid: this.openId,
            date: this.monthDate
          },
          success: (res) => {
            const data = res.result.data
            this.selected = []
            for (let key in data) {
              const item = data[key]
              if (item.count !== 0) {
                let rotate = 0
                if (item.totalNumber > 0) {
                  // console.log(item);
                  rotate = ((item.totalNumber - item.errorNumber) / item.totalNumber * 100)
                    .toFixed(2)
                }
                this.selected.push({
                  date: key,
                  info: rotate + '%'
                })
              }
            }
            this.isLoading = false
          }
        })
      },
      getRoundChartsData() {
        this.isLoading = true
        uniCloud.callFunction({
          name: "problem_round_chart",
          data: {
            openid: this.openId,
            date: this.date
          },
          success: (res) => {
            const data = res.result.data
            this.roundChartData = data.map(item => {
              return {
                name: item._id.typeName,
                value: item.totalNumber,
                labelText: item._id.typeName + ":" + item.totalNumber
              }
            })


            this.chartData = {
              series: [{
                data: this.roundChartData
              }]
            }

            const category = data.map(item => item._id.typeName)
            const totalNumber = data.map(item => item.totalNumber)
            const errorNumber = data.map(item => item.errorNumber)
            const rotate = []
            for (var i = 0; i < totalNumber.length; i++) {
              if (totalNumber[i] > 0) {
                rotate[i] = ((totalNumber[i] - errorNumber[i]) / totalNumber[i] * 100).toFixed(2)
              } else {
                rotate[i] = 0
              }
            }
            // console.log(rotate);
            this.chartData1 = {
              categories: category,
              series: [{
                name: '总题数',
                type: "column",
                color: colorList1[Math.floor(Math.random() * colorList1.length)],
                data: totalNumber
              }, {
                name: '错题数',
                type: "column",
                color: colorList2[Math.floor(Math.random() * colorList2.length)],
                data: errorNumber
              }, {
                name: '正确率',
                type: "line",
                index: 1,
                color: "#158c15",
                data: rotate
              }]
            }
            this.isLoading = false
          }
        })
      }
    }
  }
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
            color: #ff9900
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

  .loging {
    margin-top: 200rpx;
  }
</style>