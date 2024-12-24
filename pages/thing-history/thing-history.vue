<template>
  <view>
    <uni-calendar
      :date="date"
      @monthSwitch="monthSwitch"
      class="uni-calendar--hook"
      :selected="selected"
      @change="onChange"
    />
    <view class="list">
      <u-list>
        <u-list-item
          v-for="(item, index) in dataList"
          :key="index"
        >
          <u-cell
            :title="`第${index + 1}次拉粑粑`"
            :value="formateTime(item.time)"
          ></u-cell>
        </u-list-item>
      </u-list>
    </view>
  </view>
</template>

<script>
import { formateDate } from "@/utils/formateDate.js";
import formateTime from "@/utils/formateDate.js";
import {thingGetDay, thingGetMonth, thingGetToday} from "@/api/thing";
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
      thingGetDay({ date: time.fulldate }).then((res) => {
        this.dataList = res;
      });
    },
    /**
     * 获取当天的数据列表
     */
    getTodayList() {
      thingGetToday().then(res=>{
        this.dataList = res
      })
    },
    /**
     * 获取指定月份的数据列表
     */
    getDayList() {
      thingGetMonth({date: this.monthDate}).then(data =>{
        this.selected = [];
        for (let key in data) {
          if (data[key] !== 0) {
            this.selected.push({
              date: key,
              info: data[key] + "次",
            });
          }
        }
      })
    },
  },
};
</script>

<style></style>
