/**
 * 做题记录相关接口
 * 提供做题记录的增删查改及统计功能
 */
import request from "./index.js"

/**
 * 新增做题记录
 * @param {Object} data - 请求参数
 * @param {string} data.date - 日期
 * @param {number} data.total - 总题数
 * @param {number} data.correct - 正确数
 * @returns {Promise}
 */
export function problemAdd(data) {
  return request({
    name: 'problem_add',
    data
  })
}

/**
 * 编辑做题记录
 * @param {Object} data - 请求参数
 * @param {string} data._id - 记录ID
 * @returns {Promise}
 */
export function problemEdit(data) {
  return request({
    name: 'problem_edit',
    data
  })
}

/**
 * 删除做题记录
 * @param {Object} data - 请求参数
 * @param {string} data._id - 记录ID
 * @returns {Promise}
 */
export function problemDelete(data) {
  return request({
    name: 'problem_delete',
    data
  })
}

/**
 * 获取指定天的做题记录
 * @param {Object} data - 请求参数
 * @param {string} data.date - 日期
 * @returns {Promise}
 */
export function problemGetDay(data) {
  return request({
    name: 'problem_get_day',
    data
  })
}

/**
 * 获取指定月份的做题统计（正确率）
 * @param {Object} data - 请求参数
 * @param {string} data.year - 年份
 * @param {string} data.month - 月份
 * @returns {Promise}
 */
export function problemGetMonth(data) {
  return request({
    name: 'problem_get_month',
    data
  })
}

/**
 * 获取指定月份的单类型正确率（折线图使用）
 * @param {Object} data - 请求参数
 * @param {string} data.year - 年份
 * @param {string} data.month - 月份
 * @returns {Promise}
 */
export function problemGetMonthLine(data) {
  return request({
    name: 'problem_month_chart',
    data
  })
}

/**
 * 获取指定天做题信息的扇形统计图数据
 * @param {Object} data - 请求参数
 * @param {string} data.date - 日期
 * @returns {Promise}
 */
export function problemGetRoundChart(data) {
  return request({
    name: 'problem_round_chart',
    data
  })
}
