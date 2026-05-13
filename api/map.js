/**
 * 地图相关接口
 * 提供位置共享的添加和查询功能
 */
import request from '@/api/index'

/**
 * 新增地图位置信息
 * @param {Object} data - 请求参数
 * @param {string} data.openid - 用户openid
 * @param {number} data.latitude - 纬度
 * @param {number} data.longitude - 经度
 * @returns {Promise}
 */
export function mapAdd(data) {
  return request({
    name: 'map_add',
    data
  })
}

/**
 * 获取地图位置列表
 * @param {Object} data - 请求参数
 * @returns {Promise}
 */
export function mapList(data) {
  return request({
    name: 'map_list',
    data
  })
}
