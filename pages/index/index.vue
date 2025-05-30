<template>
  <view>
    <u-notice-bar v-if="showDateText" :text="showDateText" mode="closable" color="#d81e06" bgColor="white"
      duration="2000" />
    <view class="operate">
       <u-avatar :src="imgSrc" size="150" @click="onAdd" />
    </view>
    <view class="ranking">
      <u-avatar :src="rankingImg" size="40" @click="onGetRankingPage" />
    </view>
    <view class="count">
      你总共拉了
      <span style="color: red">{{ total }}</span>
      次粑粑了！
    </view>
    <view class="list" v-if="dataList.length > 0">
      <view class="title">今日拉粑粑的记录：</view>
      <u-list>
        <u-list-item v-for="(item, index) in dataList" :key="index">
          <u-cell :title="`第${index + 1}次拉粑粑`" :value="formateDate(item.time)" @click="onDelete(item)" />
        </u-list-item>
      </u-list>
    </view>
    <view>
      <!-- 新增体重记录 -->
      <uni-fab :pattern="pattern" horizontal="right" vertical="bottom" :pop-menu="false"
        @fabClick="onAddWeightRecord" />
    </view>
    <!-- 新增记录弹窗 -->
    <view>
      <u-popup :show="isShowWeightDialog" mode="center" :closeable="true" @close="isShowWeightDialog = false">
        <view class="weight-form">
          <u--form labelPosition="left" :model="weightForm" ref="uForm">
            <u-form-item label="体重" borderBottom>
              <u--input placeholder="请输入体重" border="surround" v-model="weightForm.value" type='digit' clearable>
                <tempalte slot="suffix">
                  <view>KG</view>
                </tempalte>
              </u--input>
            </u-form-item>
          </u--form>
          <u-button text="保存" @click="onWeightInfoSave" color="linear-gradient(to right, rgb(66, 83, 216), rgb(213, 51, 186))" />
        </view>
      </u-popup>
    </view>
    <!-- 想说的话 -->
    <want-say />
    <!-- 自定义导航 -->
    <custom-tab />
  </view>
</template>

<script>
  import img from "@/static/aoligei.jpg";
  import rankingImg from "@/static/img/ranking-active.png";
  import weightImg from "@/static/img/weight_add.png";
  import formateDate from "@/utils/formateDate.js";
  import {
    noticeGet
  } from "@/api/notice.js";
  import {
    thingAdd,
    thingCount,
    thingDelete,
    thingGetToday
  } from "@/api/thing";
  import {
    weightAdd
  } from "@/api/weight.js"
  export default {
    data() {
      return {
        imgSrc: img,
        // 排名的图片
        rankingImg,
        // 拉粑粑总数
        total: 0,
        // 体重照片
        weightImg,
        dataList: [],
        // 悬浮按钮配置
        pattern: {
          color: "#7A7E83",
          backgroundColor: "#fff",
          selectedColor: "#d81e06",
          buttonColor: "#d81e06",
          iconColor: "#fff",
          icon: "flag-filled",
        },
        // 通告栏展示的文本
        showDateText: "",
        // 定时器
        timer: null,
        // 通告栏数据
        noticeData: {},
        // 显示体重弹窗
        isShowWeightDialog: false,
        // 体重新增表单
        weightForm:{
          value: ''
        }
      };
    },
    onShow() {
      this.getTotal();
      this.getTodayList();
      this.getNoticeData();
    },
    created() {
      this.timer = setInterval(() => {
        this.calculateTimeUntil();
      }, 60000);
    },
    beforeDestroy() {
      clearInterval(this.timer);
    },
    methods: {
      formateDate,
      /**
       * 获取通告栏内容
       */
      getNoticeData() {
        noticeGet().then((res) => {
          this.noticeData = res?.length > 0 ? {
            ...res[0]
          } : {};
          this.calculateTimeUntil();
        });
      },
      /**
       * 获取当天的粑粑信息
       */
      getTodayList() {
        thingGetToday().then((res) => {
          this.dataList = res || [];
        });
      },
      /**
       * 获取拉粑粑的总数
       */
      getTotal() {
        thingCount().then((res) => {
          this.total = res;
        });
      },
      /**
       * 删除粑粑信息
       * @param item
       */
      onDelete(item) {
        uni.showModal({
          title: "提示",
          content: "你是不是想要偷偷删除拉屎记录？拉屎大王还想耍赖？",
          cancelText: "不是哒",
          confirmText: "就耍赖",
          success: (res) => {
            if (res.confirm) {
              thingDelete(item).then(() => {
                this.getTotal();
                this.getTodayList();
                uni.showToast({
                  title: `你差点就成为拉屎之王了，可惜了`,
                  icon: "none",
                  duration: 2000,
                });
              });
            } else if (res.cancel) {
              uni.showToast({
                title: "你真是个诚实的拉屎大王!",
                icon: "none",
                duration: 2000,
              });
            }
          },
        });
      },
      /**
       * 新增
       */
      onAdd() {
        uni.showModal({
          title: "提示",
          content: "你已经是拉屎大王了，确定还要拉粑粑吗？",
          success: (res) => {
            if (res.confirm) {
              thingAdd().then((res) => {
                this.getTotal();
                this.getTodayList();
                uni.showToast({
                  title: `你真是拉屎大王,你今天已经拉了${res}次粑粑了！`,
                  icon: "none",
                  duration: 2000,
                });
              });
            } else if (res.cancel) {
              uni.showToast({
                title: "差点让你成为拉屎大王!",
                icon: "none",
                duration: 2000,
              });
            }
          },
        });
      },
      /**
       * 新增体重记录
       */
      onAddWeightRecord() {
        this.isShowWeightDialog = true
      },
      /**
       * 保存体重信息
       */
      onWeightInfoSave(){
        const regex = /^[+-]?(?:\d+\.\d{1,2}|\d+|\.\d{1,2})$/;
        
        if(!regex.test(this.weightForm.value)){
          uni.showToast({
            title: "输入的体重不正常",
            icon: "none",
            duration: 2000,
          });
        }else{
          weightAdd({
            value: this.weightForm.value,
            createTime: formateDate(Date.now())
          }).then(()=>{
            uni.showToast({
              title: "记录体重成功",
              icon: "success",
              duration: 2000,
            });
            this.isShowWeightDialog = false
          })
        }
      },
      /**
       * 前往排行榜页面
       */
      onGetRankingPage() {
        uni.navigateTo({
          url: "/subPackages/ranking/ranking",
        });
      },
      /**
       * 获取指定日期距离现在还有多久
       */
      calculateTimeUntil() {
        if (!this.noticeData.isShow) {
          return "";
        }
        if (this.noticeData.isTimeDown) {
          if (!this.noticeData.content || !this.noticeData.time) {
            return "";
          }
          // 获取当前日期和目标日期
          const now = new Date();
          const target = new Date(this.noticeData.time);

          // 计算时间差（以毫秒为单位）
          const timeDiff = target - now;

          // 如果时间差小于0，表示目标日期已经过去
          if (timeDiff < 0) {
            return "倒计时已过期";
          }

          // 计算天数、小时、分钟和秒数
          const seconds = Math.floor((timeDiff / 1000) % 60);
          const minutes = Math.floor((timeDiff / 1000 / 60) % 60);
          const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
          const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

          this.showDateText = `距离${this.noticeData.content}还有${days}天${hours}时${minutes}分`;
        } else {
          this.showDateText = this.noticeData.content;
        }
      },
    },
  };
</script>

<style>
  .operate {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 100rpx;
    position: relative;
    transition: transform 0.3s ease;
    /* 添加过渡效果 */
  }

  .operate:hover {
    transform: scale(1.05);
    /* 鼠标悬停时放大 */
  }

  .ranking {
    position: absolute;
    right: 20px;
    top: 80rpx;
    transition: transform 0.3s ease;
  }

  .ranking:hover {
    transform: scale(1.1);
  }

  .count {
    text-align: center;
    margin-top: 3rpx;
    font-size: 50rpx;
    font-weight: 800;
    color: #333;
  }

  ::v-deep .u-list {
    max-height: 600rpx !important;
    overflow-y: auto;
  }

  .title {
    padding: 20rpx 30rpx 10rpx 30rpx;
    font-weight: 600;
    font-size: 40rpx;
    color: #555;
  }
  
  .weight-form {
    padding: 60rpx 40rpx 40rpx 40rpx;
  }

  .uni-fab__circle{
    bottom: 200rpx !important;
  }
</style>