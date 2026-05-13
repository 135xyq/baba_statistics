/**
 * 总结报告相关接口
 * 提供年/月度总结报告的生成功能
 */
import request from "./index.js"

/**
 * 获取总结报告
 * @param {Object} data - 请求参数
 * @param {string} data.type - 总结类型（year/month）
 * @param {Object} data.date - 时间范围 {year, month}
 * @returns {Promise}
 */
export function summarize(data) {
  return request({
    name: 'summarize',
    data
  })
}
