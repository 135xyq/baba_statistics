<template>
  <view>
    <uni-calendar :date="date" @monthSwitch="monthSwitch" class="uni-calendar--hook" :selected="selected"
      @change="onChange" />
    <view class="list">
      <u-list>
        <u-list-item v-for="(item, index) in dataList" :key="index">
          <u-cell :title="`${formateTime(item.time)} 的体重`" :value="`${item.value} KG`" @click="onDelete(item)" />
        </u-list-item>
      </u-list>
    </view>
  </view>
</template>

<script>
  import {
    formateDate
  } from "@/utils/formateDate.js";
  import formateTime from "@/utils/formateDate.js";
  import {
    weightGetMonth,
    weightGetDay,
    weightDelete
  } from "@/api/weight";
  export default {
    data() {
      return {
        date: formateDate(new Date().getTime()),
        monthDate: {
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
        },
        selected: [],
        dataList: [],
      };
    },
    created() {
      this.getDayList();
      this.getTodayList();
    },

    methods: {
      formateTime,
      /**
       * 切换月份
       * @param date
       */
      monthSwitch(date) {
        this.monthDate = {
          ...date,
        };
        this.getDayList();
      },
      /**
       * 切换日期
       * @param time
       */
      onChange(time) {
        weightGetDay({
          date: time.fulldate
        }).then((res) => {
          this.dataList = res;
        });
      },
      /**
       * 获取当天的数据列表
       */
      getTodayList() {
        weightGetDay({
          date: this.date
        }).then(res => {
          this.dataList = res
        })
      },
      /**
       * 获取指定月份的数据列表
       */
      getDayList() {
        weightGetMonth({
          date: this.monthDate
        }).then(data => {
          this.selected = [];
          for (let key in data) {
            if (data[key]) {
              this.selected.push({
                date: key,
                info: data[key] + "KG",
              });
            }
          }
        })
      },
      /**
       * 删除记录
       * @param {Object} item
       */
      onDelete(item) {
        uni.showModal({
          title: "提示",
          content: "你是不是想要删除体重记录",
          cancelText: "不是哒",
          confirmText: "是哒",
          success: (res) => {
            if (res.confirm) {
              weightDelete(item).then(() => {
                this.getDayList();
                this.getTodayList();
                uni.showToast({
                  title: `删除成功了！`,
                  icon: "none",
                  duration: 2000,
                });
              });
            }
          },
        });
      },
    },
  };
</script>

<style></style>