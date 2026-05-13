/**
 * 公告相关接口
 * 提供公告的增删查改功能
 */
import request from "./index.js"

/**
 * 获取公告列表
 * @param {Object} data - 请求参数
 * @returns {Promise}
 */
export function noticeGet(data) {
  return request({
    name: 'notice_get',
    data
  })
}

/**
 * 新增公告
 * @param {Object} data - 请求参数
 * @param {string} data.content - 公告内容
 * @returns {Promise}
 */
export function noticeAdd(data) {
  return request({
    name: 'notice_add',
    data
  })
}

/**
 * 修改公告
 * @param {Object} data - 请求参数
 * @param {string} data._id - 公告ID
 * @returns {Promise}
 */
export function noticeEdit(data) {
  return request({
    name: 'notice_edit',
    data
  })
}
