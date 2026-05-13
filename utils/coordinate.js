/**
 * 坐标转换工具
 * 提供 WGS-84 到 GCJ-02 的坐标转换，解决微信小程序定位偏移问题
 */

const PI = Math.PI;
const A = 6378245.0;
const EE = 0.00669342162296594323;

/**
 * 判断坐标是否在中国境外
 * @param {number} lng - 经度
 * @param {number} lat - 纬度
 * @returns {boolean}
 */
function outOfChina(lng, lat) {
  return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
}

/**
 * 纬度转换辅助函数
 */
function transformLat(lng, lat) {
  let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
  ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
  return ret;
}

/**
 * 经度转换辅助函数
 */
function transformLng(lng, lat) {
  let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
  ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
  return ret;
}

/**
 * WGS-84 坐标转 GCJ-02 坐标
 * 解决微信小程序中 uni.getLocation 返回的坐标与地图组件坐标系不一致导致的偏移问题
 * @param {number} lng - WGS-84经度
 * @param {number} lat - WGS-84纬度
 * @returns {{ lng: number, lat: number }} GCJ-02坐标
 */
export function wgs84ToGcj02(lng, lat) {
  if (outOfChina(lng, lat)) {
    return { lng, lat };
  }
  let dlat = transformLat(lng - 105.0, lat - 35.0);
  let dlng = transformLng(lng - 105.0, lat - 35.0);
  const radlat = lat / 180.0 * PI;
  let magic = Math.sin(radlat);
  magic = 1 - EE * magic * magic;
  const sqrtmagic = Math.sqrt(magic);
  dlat = (dlat * 180.0) / ((A * (1 - EE)) / (magic * sqrtmagic) * PI);
  dlng = (dlng * 180.0) / (A / sqrtmagic * Math.cos(radlat) * PI);
  return { lng: lng + dlng, lat: lat + dlat };
}

export default { wgs84ToGcj02 }
