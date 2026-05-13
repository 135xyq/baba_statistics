/**
 * 体重相关接口
 * 提供体重记录的增删查改及统计功能
 */
import request from "./index.js"

/**
 * 获取月份体重列表
 * @param {Object} data - 请求参数
 * @param {string} data.year - 年份
 * @param {string} data.month - 月份
 * @returns {Promise}
 */
export function weightGetMonth(data) {
  return request({
    name: 'weight_get_month',
    data
  })
}

/**
 * 获取月份体重列表（图表使用）
 * @param {Object} data - 请求参数
 * @param {string} data.year - 年份
 * @param {string} data.month - 月份
 * @returns {Promise}
 */
export function weightGetMonthChart(data) {
  return request({
    name: 'weight_month_chart',
    data
  })
}

/**
 * 获取当天体重列表
 * @param {Object} data - 请求参数
 * @param {string} data.date - 日期
 * @returns {Promise}
 */
export function weightGetDay(data) {
  return request({
    name: 'weight_get_day',
    data
  })
}

/**
 * 新增体重记录
 * @param {Object} data - 请求参数
 * @param {number} data.weight - 体重值
 * @returns {Promise}
 */
export function weightAdd(data) {
  return request({
    name: 'weight_add',
    data
  })
}

/**
 * 修改体重记录
 * @param {Object} data - 请求参数
 * @param {string} data._id - 记录ID
 * @returns {Promise}
 */
export function weightEdit(data) {
  return request({
    name: 'weight_edit',
    data
  })
}

/**
 * 删除体重记录
 * @param {Object} data - 请求参数
 * @param {string} data._id - 记录ID
 * @returns {Promise}
 */
export function weightDelete(data) {
  return request({
    name: 'weight_delete',
    data
  })
}
