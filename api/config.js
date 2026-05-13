/**
 * 系统配置相关接口
 * 提供系统配置的获取和更新功能（如幸运转盘配置等）
 */
import request from '@/api/index'

/**
 * 更新系统配置
 * @param {Object} data - 请求参数
 * @param {string} data.key - 配置键名
 * @param {Object} data.value - 配置值
 * @returns {Promise}
 */
export function updateConfig(data) {
  return request({
    name: 'system_config_update',
    data
  })
}

/**
 * 获取系统配置
 * @param {Object} data - 请求参数
 * @param {string} data.key - 配置键名
 * @returns {Promise}
 */
export function getConfig(data) {
  return request({
    name: 'system_config_get',
    data
  })
}
