<template>
  <view>
    <u-notice-bar v-if="showDateText" :text="showDateText" mode="closable" color="#d81e06" bgColor="white"
      duration="2000" />
    <view class="operate" :class="{ 'animate': isAnimate }">
       <u-avatar :src="imgSrc" size="150" @click="onAdd" />
    </view>
    <!-- 粑粑元素 -->
    <view class="poop-container">
      <view 
        v-for="poop in poops" 
        :key="poop.id"
        class="poop"
        :class="{ 'poop-falling': poop.isFalling, 'poop-rising': !poop.isFalling }"
        :style="{
          left: poop.left,
          width: `${poop.size}px`,
          height: `${poop.size}px`,
          animationDelay: `${poop.delay}s`,
          animationDuration: `${poop.duration}s`,
          '--rotate': `${poop.rotate}deg`,
          '--tx': `${poop.translateX}px`,
          '--hue': poop.hue,
          '--brightness': poop.brightness
        }"
      />
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
        },
        // 动画状态
        isAnimate: false,
        // 粑粑元素数组
        poops: []
      };
    },
    onShow() {
      const openid =  this.$store.state.userInfo?.userInfo?.openid;
      if(openid){
        this.getTotal();
        this.getTodayList();
        this.getNoticeData();
        this.timer = setInterval(() => {
          this.calculateTimeUntil();
        }, 60000);
      }else{
        this.total = 0
        this.dataList = []
        this.showDateText = ''
        this.noticeData = {}
        this.isShowWeightDialog = false
        this. weightForm = {
          value: ''
        }
      }
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
        // 触发动画
        this.isAnimate = true;
        setTimeout(() => {
          this.isAnimate = false;
        }, 500);
        
        
        uni.showModal({
          title: "提示",
          content: "你已经是拉屎大王了，确定还要拉粑粑吗？",
          success: (res) => {
            if (res.confirm) {
              // 生成粑粑元素
              this.generatePoops();
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
       * 生成粑粑元素，采用更加平滑有趣的动画逻辑
       */
      generatePoops() {
        // 清空现有元素
        this.poops = [];
        
        // 优化元素数量，保证性能与视觉的清爽度
        const count = 45; 
        for (let i = 0; i < count; i++) {
          // 随机水平起始位置 (分布在 0% - 100%)
          const left = Math.random() * 100;
          // 大小错落有致，增加层次感
          const size = 15 + Math.random() * 25;
          // 动画延迟时间，让元素分批出现，更有节奏感
          const delay = Math.random() * 1.5;
          // 动画持续时间，不同元素速度不同更显自然
          const duration = 2.5 + Math.random() * 3.5;
          // 掉落方向控制 (70%概率下落，30%概率上升)
          const isFalling = Math.random() > 0.3; 
          
          // 随机旋转度数 (正反转都有，幅度在半圈到两圈之间)
          const rotate = (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 540); 
          // 水平飘移距离，产生风吹的效果
          const translateX = (Math.random() - 0.5) * 300; 
          
          // 色彩微调，保持图原本风格的同时有些许光影差异，更加优雅
          const hue = Math.floor(Math.random() * 40) - 20; 
          const brightness = 85 + Math.random() * 30; 
          
          this.poops.push({
            id: i,
            left: `${left}%`,
            size: size,
            delay: delay,
            duration: duration,
            isFalling: isFalling,
            rotate: rotate,
            translateX: translateX,
            hue: hue,
            brightness: brightness
          });
        }
        
        // 确保所有动画播放完毕后再清理 (1.5s延迟 + 6s动画时长 = 7.5s，保留一定缓冲)
        setTimeout(() => {
          this.poops = [];
        }, 8000);
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
          url: "/other/ranking/ranking",
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

  .operate.animate {
    animation: clickEffect 0.5s ease;
  }

  @keyframes clickEffect {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(0.7);
    }
    100% {
      transform: scale(1);
    }
  }

  .poop-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
    overflow: hidden; /* 防止飘出屏幕范围产生滚动条 */
  }

  .poop {
    position: absolute;
    background-image: url('@/static/便便.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 50%;
    /* 使用柔和的光影滤镜替代之前强烈的颜色变换，显得更优雅 */
    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1)) hue-rotate(calc(var(--hue, 0) * 1deg)) brightness(calc(var(--brightness, 100) * 1%));
    opacity: 0;
  }

  .poop.poop-falling {
    top: -50px;
    animation: poopFall ease-in-out forwards;
  }

  .poop.poop-rising {
    bottom: -50px;
    animation: poopRise ease-in-out forwards;
  }

  @keyframes poopFall {
    0% {
      transform: translate3d(0, 0, 0) rotate(0deg) scale(0.5);
      opacity: 0;
    }
    15% {
      /* 刚出现时略微放大，模拟弹出效果 */
      opacity: 1;
      transform: translate3d(calc(var(--tx) * 0.2), 15vh, 0) rotate(calc(var(--rotate) * 0.2)) scale(1.2);
    }
    85% {
      opacity: 1;
    }
    100% {
      transform: translate3d(var(--tx), 110vh, 0) rotate(var(--rotate)) scale(0.8);
      opacity: 0;
    }
  }

  @keyframes poopRise {
    0% {
      transform: translate3d(0, 0, 0) rotate(0deg) scale(0.5);
      opacity: 0;
    }
    15% {
      opacity: 1;
      transform: translate3d(calc(var(--tx) * 0.2), -15vh, 0) rotate(calc(var(--rotate) * 0.2)) scale(1.2);
    }
    85% {
      opacity: 1;
    }
    100% {
      transform: translate3d(var(--tx), -110vh, 0) rotate(var(--rotate)) scale(0.8);
      opacity: 0;
    }
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