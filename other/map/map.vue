<template>
  <view class="map-page">
    <map
      style="width: 100%; height: 100%"
      :latitude="latitude"
      :longitude="longitude"
      :markers="covers"
      :show-location="true"
    />
  </view>
</template>

<script>
/**
 * 位置共享页
 * 在地图上展示用户实时位置，支持自动定位和位置标记
 * 使用 WGS-84 转 GCJ-02 坐标转换，解决微信小程序定位偏移问题
 */
import formateDate from "@/utils/formateDate.js";
import { mapAdd, mapList } from "@/api/map";
import { wgs84ToGcj02 } from "@/utils/coordinate.js";
export default {
  data() {
    return {
      /** 默认纬度（北京） */
      latitude: 39.909,
      /** 默认经度（北京） */
      longitude: 116.39742,
      /** 地图标记点列表 */
      covers: [],
      /** 定时刷新定时器 */
      timer: null,
    };
  },
  onLoad() {
    this.checkLocationPermission();
  },
  created() {
    this.timer = setInterval(this.setPosition, 1000 * 60);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    /**
     * 检查定位权限，已授权则直接定位，未授权则请求授权
     */
    checkLocationPermission() {
      uni.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userLocation']) {
            this.setPosition();
          } else {
            uni.authorize({
              scope: 'scope.userLocation',
              success: () => {
                this.setPosition();
              },
              fail: () => {
                uni.showModal({
                  title: '位置授权',
                  content: '需要获取您的位置信息才能使用位置共享功能，是否前往设置开启权限？',
                  confirmText: '去设置',
                  success: (modalRes) => {
                    if (modalRes.confirm) {
                      uni.openSetting({
                        success: (settingRes) => {
                          if (settingRes.authSetting['scope.userLocation']) {
                            this.setPosition();
                          } else {
                            this.getMapPositionList();
                            uni.showToast({ title: '未授权定位，无法共享位置', icon: 'none' });
                          }
                        }
                      });
                    } else {
                      this.getMapPositionList();
                    }
                  }
                });
              }
            });
          }
        },
        fail: () => {
          this.getMapPositionList();
        }
      });
    },
    /**
     * 设置点位坐标信息
     * 先获取WGS-84坐标，再转换为GCJ-02坐标，确保地图显示准确
     */
    setPosition() {
      uni.getLocation({
        type: "wgs84",
        success: (res) => {
          const gcj02 = wgs84ToGcj02(res.longitude, res.latitude);
          this.latitude = gcj02.lat;
          this.longitude = gcj02.lng;

          mapAdd({
            createTime: formateDate(new Date().getTime()),
            longitude: gcj02.lng,
            latitude: gcj02.lat,
            speed: res.speed,
          }).then(() => {
            this.getMapPositionList();
          });
        },
        fail: (err) => {
          console.error('获取位置失败:', err);
          this.getMapPositionList();
          if (err.errMsg && err.errMsg.includes('auth deny')) {
            uni.showModal({
              title: '位置授权',
              content: '位置权限已被拒绝，是否前往设置开启？',
              confirmText: '去设置',
              success: (modalRes) => {
                if (modalRes.confirm) {
                  uni.openSetting();
                }
              }
            });
          } else {
            uni.showToast({ title: '获取位置失败，请检查定位服务', icon: 'none' });
          }
        },
      });
    },
    /**
     * 获取地图点位信息列表
     */
    getMapPositionList() {
      mapList().then((res) => {
        this.covers = res?.map((item, index) => {
          const gcj02 = wgs84ToGcj02(item.longitude, item.latitude);
          return {
            id: index,
            latitude: gcj02.lat,
            longitude: gcj02.lng,
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
