<template>
  <view>
    <view v-if="wantSayInfo.length > 0">
      <u-modal
        v-for="(item, index) in wantSayInfo"
        :key="item._id"
        :show="wantSayShow[index]"
        :title="item.nickName + '想对你说'"
      >
        <template slot="default">
          <view class="want-say-content" :style="{ color: setFontColor(item) }">
            {{ item.content }}
          </view>
        </template>
        <u-button
          slot="confirmButton"
          @click="onHandleCloseWantSayModal(index)"
          color="linear-gradient(to right, rgb(66, 83, 216), rgb(213, 51, 186))"
        >
          收到了
        </u-button>
      </u-modal>
    </view>
  </view>
</template>

<script>
  import {wantSayGet} from '@/api/wantSay';

  export default {
    name:"want-say",
    data() {
      return {
        // 想说的话数据
        wantSayInfo: [],
        // 是否关闭
        wantSayShow: [],
      };
    },
    created() {
      this.getWantSay();
    },
    methods: {
      /**
       * 获取想说的话列表
       */
      getWantSay() {
        wantSayGet().then(res=>{
          this.wantSayInfo = res || [];
          this.wantSayShow = new Array(this.wantSayInfo?.length).fill(false);
          if (this.wantSayInfo?.length > 0) {
            this.wantSayShow[0] = true;
          }
        })
      },
      /**
       * 关闭想说的话弹窗
       */
      onHandleCloseWantSayModal(index) {
        this.wantSayShow[index] = false;
        if (this.wantSayShow?.length > index + 1) {
          this.wantSayShow[index + 1] = true;
        }
        this.$forceUpdate();
      },
      /**
       * 设置字体颜色
       * @param data
       * @returns {string}
       */
      setFontColor(data){
        if(data.color) {
          const item = data.color? JSON.parse(data?.color): { r: 241, g: 148, b: 138, a: 0.5 }
          return `rgba(${item.r},${item.g},${item.b},${item.a})`;
        }
      }
    },
  }
</script>

<style scoped>
.want-say-content {
  margin: 50rpx 0;
  text-align: left;
  font-size: 36rpx;
  color: #ec5a86;
  font-weight: 600;
}
</style>