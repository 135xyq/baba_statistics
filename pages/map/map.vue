<template>
  <view class="map-page">
    <map style="width: 100%; height: 100%;" :latitude="latitude" :longitude="longitude" :markers="covers">
    </map>
  </view>
</template>

<script>
  import formateDate from "@/utils/formateDate.js"
  import amap from '@/common/amap-wx.130.js';
  export default {
    data() {
      return {
        openid: '',
        id: 10, // 使用 marker点击事件 需要填写id
        title: '位置共享',
        latitude: 39.909,
        longitude: 116.39742,
        covers: []
      }
    },
    onLoad() {
      //    var myAmapFun = new amap.AMapWX({key:'088aba46bf9480933be1ad184b0b4097'});
      // myAmapFun.getRegeo({
      //      success: function(data){
      //        //成功回调
      //        console.log(data);
      //      },
      //      fail: function(info){
      //        //失败回调
      //        console.log(info)
      //      }
      //    })
      if (this.$store.state.userInfo?.userInfo?.openid) {
        const state = this.$store.state.userInfo?.userInfo
        this.openid = state.openid
        if (this.openid) {
          uni.getLocation({
            type: 'wgs84',
            isHighAccuracy: true,
            cacheTimeout: 10,
            success: res => {
              console.log('当前位置的经度：' + res.longitude, res);
              console.log('当前位置的纬度：' + res.latitude);

              let x = res.longitude
              let y = res.latitude
              let x_pi = (3.14159265358979324 * 3000.0) / 180.0
              let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi)
              let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi)
              let lngs = z * Math.cos(theta) + 0.0065
              let lats = z * Math.sin(theta) + 0.006

              console.log(lats, lngs);
              this.latitude = lats
              this.longitude = lngs

              uniCloud.callFunction({
                name: "map_add",
                data: {
                  openid: this.openid,
                  createTime: formateDate(new Date().getTime()),
                  longitude: lngs,
                  latitude: lats,
                  speed: res.speed
                },
                success: (res) => {
                  this.getMapPositionList()
                }
              })
            },
            fail(err) {
              console.log(err);
            }
          });
        }
      } else {
        uni.switchTab({
          url: '/pages/login/login'
        })
      }


    },
    methods: {
      getMapPositionList() {
        uniCloud.callFunction({
          name: "map_list",
          success: (res) => {
            this.covers = res.result.data.map(item => {
              return {
                latitude: item.latitude,
                longitude: item.longitude,
                width: 40,
                height: 50,
                iconPath: item.avatarUrl,
                label: {
                  content: item.nickName,
                  color: '#FFF',
                  borderColor: '#d81e06',
                  borderWidth: 1,
                  padding: 5,
                  bgColor: '#d81e06',
                  borderRadius: 5,
                  textAlign: 'center'
                }
              }
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .map-page {
    height: 100vh;
  }
</style>