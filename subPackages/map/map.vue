<template>
  <view class="map-page">
    <map
      style="width: 100%; height: 100%"
      :latitude="latitude"
      :longitude="longitude"
      :markers="covers"
    />
  </view>
</template>

<script>
import formateDate from "@/utils/formateDate.js";
import amap from "@/common/amap-wx.130.js";
import { mapAdd, mapList } from "@/api/map";
export default {
  data() {
    return {
      openid: "",
      id: 10, // 使用 marker点击事件 需要填写id
      title: "位置共享",
      latitude: 39.909,
      longitude: 116.39742,
      covers: [],
      timer: null,
    };
  },
  onLoad() {
    this.setPosition();
  },
  created() {
    this.timer = setInterval(this.setPosition, 1000 * 60);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    /**
     * 设置点位坐标信息
     */
    setPosition() {
      uni.getLocation({
        type: "gcj02",
        isHighAccuracy: true,
        cacheTimeout: 10,
        success: (res) => {
          console.log("当前位置的经度：" + res.longitude, res);
          console.log("当前位置的纬度：" + res.latitude);

          let x = res.longitude;
          let y = res.latitude;

          let lngs = x;
          let lats = y;
          this.latitude = lats;
          this.longitude = lngs;

          mapAdd({
            createTime: formateDate(new Date().getTime()),
            longitude: lngs,
            latitude: lats,
            speed: res.speed,
          }).then(() => {
            this.getMapPositionList();
          });
        },
        fail(err) {
          this.getMapPositionList();
          uni.showToast({
            title: err || "获取地址信息失败",
          });
        },
      });
    },
    /**
     * 获取地图点位信息列表
     */
    getMapPositionList() {
      mapList().then((res) => {
        this.covers = res?.map((item, index) => {
          return {
            id: index,
            latitude: item.latitude,
            longitude: item.longitude,
            width: 40,
            height: 50,
            iconPath: item.avatarUrl,
            label: {
              content: item.nickName,
              color: "#FFF",
              borderColor: "#d81e06",
              borderWidth: 1,
              padding: 5,
              bgColor: "#d81e06",
              borderRadius: 5,
              textAlign: "center",
            },
          };
        });
      });
    },
  },
};
</script>

<style scoped>
.map-page {
  height: 100vh;
}
</style>
