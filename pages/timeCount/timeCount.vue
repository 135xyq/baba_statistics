<template>
  <view class="stopwatch-container">
    <!-- 底部tab -->
    <view>
      <u-tabbar
        activeColor="#d81e06"
        @change="clickTab"
        :value="tabValue"
        :fixed="true"
        :placeholder="true"
        :safeAreaInsetBottom="true"
      >
        <u-tabbar-item
          text="秒表"
          icon="clock"
        />
        <u-tabbar-item
          text="计时器"
          icon="calendar"
        />
      </u-tabbar>
    </view>
    <!-- 秒表 -->
    <view v-if="tabValue === 0">
      <!-- 秒表显示部分 -->
      <view class="time-display">
        <view class="time">
          <view class="time__custom">
            <text class="time__custom__item">{{ formatTime(hours) }}</text>
          </view>
          <text class="time__doc">:</text>
          <view class="time__custom">
            <text class="time__custom__item">{{ formatTime(minutes) }}</text>
          </view>
          <text class="time__doc">:</text>
          <view class="time__custom">
            <text class="time__custom__item">{{ formatTime(seconds) }}</text>
          </view>
        </view>
      </view>

      <!-- 控制按钮 -->
      <view class="buttons">
        <button
          class="save"
          @click="onSaveProblem"
        >
          保存做题记录
        </button>
        <button
          class="cancle"
          @click="resetStopwatch"
        >
          重置
        </button>
        <button
          @click="startStopwatch"
          v-if="!isRunning"
        >
          开始
        </button>
        <button
          class="stop"
          @click="pauseStopwatch"
          v-if="isRunning"
        >
          暂停
        </button>
      </view>
    </view>
    <!-- 倒计时 -->
    <view v-if="tabValue === 1">
      <u-count-down
        ref="countDown"
        :time="initTime"
        format="HH:mm:ss"
        :autoStart="false"
        millisecond
        @change="onChange"
        @finish="onTimeFinish"
      >
        <view class="time">
          <view class="time__custom">
            <text class="time__custom__item">{{ formatTime(timeData.hours) }}</text>
          </view>
          <text class="time__doc">:</text>
          <view class="time__custom">
            <text class="time__custom__item">{{ formatTime(timeData.minutes) }}</text>
          </view>
          <text class="time__doc">:</text>
          <view class="time__custom">
            <text class="time__custom__item">{{ formatTime(timeData.seconds) }}</text>
          </view>
        </view>
      </u-count-down>
      <!-- 时间选择 -->
      <u-picker
        :show="timeShow"
        ref="uPicker"
        :columns="timeColumns"
        @confirm="onTimePickerConfirm"
        @cancel="timeShow = false"
        confirmColor="#d81e06"
      />
      <!-- 控制按钮 -->
      <view class="buttons time-buttons">
        <button
          class="cancle"
          @click="onResetTime"
        >
          选择时间
        </button>
        <button
          @click="onStartTime"
          v-if="!isRunningTime"
        >
          开始
        </button>
        <button
          class="stop"
          @click="onPauseTime"
          v-if="isRunningTime"
        >
          暂停
        </button>
      </view>
    </view>
  </view>
</template>

<script>
const key = "timeCoutKey";
const timeCoutIndex = "timeCoutIndex";
const timeKey = "timeKey";
export default {
  data() {
    return {
      startTime: "",
      seconds: 0, // 秒
      minutes: 0, // 分
      hours: 0, // 时
      tempCount: 0,
      count: 0,
      intervalId: null, // 用于保存定时器ID
      // 判断秒表是否在运行
      isRunning: false,
      // 底部Tab选中
      tabValue: 0,
      // 倒计时显示的时间
      timeData: {},
      timeColumns: [[], [], []],
      // 倒计时当前时间
      currentTime: 1,
      // 倒计时时间
      initTime: 1,
      // 选择时间弹窗
      timeShow: false,
      // 倒计时是否正在进行
      isRunningTime: false,
      // 是否是第一次结束
      isNotFirstTime: false,
    };
  },
  created() {
    this.isNotFirstTime = false;
  },
  mounted() {
    const data = uni.getStorageSync(key);
    if (data) {
      if (data.isRunning) {
        this.tempCount = data.count + Math.floor((new Date().getTime() - data.time) / 1000);
        this.count = this.tempCount;
        this.startStopwatch();
      } else {
        this.tempCount = data.count;
        this.count = this.tempCount;
        this.hours = Math.max(Math.floor(this.tempCount / 3600), 0);
        this.minutes = Math.max(Math.floor((this.tempCount - this.hours * 3600) / 60), 0);
        this.seconds = this.tempCount % 60;
      }
    }

    const data1 = uni.getStorageSync(timeKey);
    if (data1) {
      if (data1.isRunning) {
        this.initTime = Math.max(0, data1.currentTime - (new Date().getTime() - data1.time));
        this.currentTime = this.initTime;
        this.isNotFirstTime = false;

        setTimeout(() => {
          this.onStartTime();
        }, 500);
      } else {
        this.initTime = data1.currentTime;
        this.currentTime = this.initTime;
      }
    } else {
      this.currentTime = 0;
      this.initTime = 0;
    }

    const index = uni.getStorageSync(timeCoutIndex);
    if (index) {
      this.tabValue = index;
    } else {
      this.tabValue = 0;
    }

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
  },
  onShow() {
    this.setScreenOn();
  },
  /**
   * 组件销毁的时候判断是否已经离开当前页面，如果正在运行则保存数据
   */
  beforeDestroy() {
    this.clearScreenOn();

    uni.setStorageSync(key, {
      count: this.count,
      time: new Date().getTime(),
      isRunning: this.isRunning,
    });

    uni.setStorageSync(timeKey, {
      initTime: this.initTime,
      currentTime: this.currentTime,
      isRunning: this.isRunningTime,
      time: new Date().getTime(),
    });

    uni.setStorageSync(timeCoutIndex, this.tabValue);
  },
  methods: {
    setScreenOn() {
      uni.setKeepScreenOn({
        keepScreenOn: true,
        success: () => {
          console.log("屏幕常亮已设置");
        },
        fail: (err) => {
          console.error("设置屏幕常亮失败", err);
        },
      });
    },
    // 取消屏幕常亮
    clearScreenOn() {
      uni.setKeepScreenOn({
        keepScreenOn: false,
        success: () => {
          console.log("屏幕常亮已取消");
        },
        fail: (err) => {
          console.error("取消屏幕常亮失败", err);
        },
      });
    },
    // 格式化时间，确保个位数时前面加 0
    formatTime(time) {
      return time < 10 ? "0" + time : time;
    },

    // 开始秒表
    startStopwatch() {
      if (!this.isRunning) {
        this.isRunning = true;
        this.startTime = new Date().getTime();
        this.intervalId = setInterval(() => {
          this.seconds = this.tempCount + Math.floor((new Date().getTime() - this.startTime) / 1000);
          this.count = this.seconds;
          this.hours = Math.max(Math.floor(this.seconds / 3600), 0);
          this.minutes = Math.max(Math.floor((this.seconds - this.hours * 3600) / 60), 0);
          this.seconds = this.seconds % 60;
        }, 500); // 每秒更新一次
      }
    },

    // 暂停秒表
    pauseStopwatch() {
      if (this.isRunning) {
        clearInterval(this.intervalId);
        this.tempCount = this.count;
        this.isRunning = false;
      }
    },

    // 重置秒表
    resetStopwatch() {
      clearInterval(this.intervalId);
      this.startTime = "";
      this.seconds = 0;
      this.minutes = 0;
      this.hours = 0;
      this.count = 0;
      this.tempCount = 0;
      this.isRunning = false;
    },
    /**
     * 切换底部Tab
     * @param {Object} e
     */
    clickTab(e) {
      this.tabValue = e;
      if (this.tabValue === 0) {
        this.resetStopwatch();
        this.currentTime = 0;
        this.time = 0;
        this.isRunningTime = false;
        this.isNotFirstTime = false;

        this.$refs.countDown?.reset();
        this.timeData = {};
      } else {
        this.resetStopwatch();
        this.currentTime = 0;
        this.time = 0;
        this.isRunningTime = false;
        this.isNotFirstTime = false;

        this.$refs.countDown?.reset();
        this.timeData = {};
      }
    },
    /**
     * @param {Object} e
     */
    onChange(e) {
      this.timeData = e;
      const { hours, minutes, seconds } = e;
      this.currentTime = (Number(hours * 3600) + Number(minutes * 60) + Number(seconds)) * 1000;
    },
    onTimeFinish() {
      console.log(this.currentTime, this.isNotFirstTime);
      if (this.isNotFirstTime && this.currentTime === 0) {
        this.isRunningTime = false;
        const bgAudioManager = uni.getBackgroundAudioManager();
        bgAudioManager.title = "倒计时";
        bgAudioManager.singer = "粑粑先生助手";
        bgAudioManager.src =
          "https://mp-47222cf8-47ac-4463-a5d0-2a8b8cb4b608.cdn.bspapp.com/cloudstorage/音频/y2090.mp3";
        this.isNotFirstTime = false;
      }
    },
    // 开始倒计时
    onStartTime() {
      if (!this.isRunningTime && this.currentTime > 0) {
        this.isRunningTime = true;
        this.isNotFirstTime = true;
        this.$refs.countDown?.start();
      }
    },

    // 暂停倒计时
    onPauseTime() {
      if (this.isRunningTime) {
        this.$refs.countDown.pause();
        this.isRunningTime = false;
      }
    },

    // 重置倒计时
    onResetTime() {
      this.timeShow = true;
      this.currentTime = 0;
      this.isRunningTime = false;
      this.isNotFirstTime = false;
      this.$refs.countDown.reset();
    },
    onTimePickerConfirm(e) {
      const [hour, minutes, seconds] = e.value;
      this.initTime = (Number(hour * 3600) + Number(minutes * 60) + Number(seconds)) * 1000;
      this.currentTime = this.initTime / 1000;
      // this.isRunningTime = false
      this.timeShow = false;
      // this.onStartTime()
    },
    /**
     * 保存做题记录
     */
    onSaveProblem() {
      uni.navigateTo({
        url: "/pages/problem-add/problem-add?useTime=" + this.count,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.stopwatch-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.time-display {
  font-size: 48px;
  margin-bottom: 20px;
}

.buttons {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.buttons button {
  margin: 10px;
  padding: 5px 15px;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  background: linear-gradient(to right, rgb(94, 216, 143), rgb(208, 213, 115));
  color: white;
}

.buttons .cancle {
  background: linear-gradient(to right, rgb(208, 194, 216), rgb(213, 185, 193));
}

.buttons .save {
  background: linear-gradient(to right, rgb(66, 83, 216), rgb(213, 51, 186));
}

.buttons .stop {
  background: linear-gradient(to right, rgb(216, 131, 125), rgb(192, 94, 77));
}

.time-buttons {
  margin-top: 20px;
}

.time {
  display: flex;
  align-items: center;
  justify-content: center;

  &__custom {
    width: 100px;
    height: 80px;
    background-color: #0e0c0cf0;
    border-radius: 4px;
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    justify-content: center;
    align-items: center;

    &__item {
      color: #fff;
      font-size: 56px;
      text-align: center;
    }
  }

  &__doc {
    color: #0e0c0cf0;
    font-size: 50px;
    padding: 0px 4px;
  }

  &__item {
    color: #606266;
    font-size: 15px;
    margin-right: 4px;
  }
}
</style>
