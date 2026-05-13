/**
 * 想说的话相关接口
 * 提供悄悄话的增删查改及状态管理功能
 */
import request from "./index.js"

/**
 * 新增想说的话
 * @param {Object} data - 请求参数
 * @param {string} data.content - 内容
 * @param {string} data.toOpenid - 接收者openid
 * @returns {Promise}
 */
export function wantSayAdd(data) {
  return request({
    name: 'want_say_add',
    data
  })
}

/**
 * 删除想说的话
 * @param {Object} data - 请求参数
 * @param {string} data._id - 记录ID
 * @returns {Promise}
 */
export function wantSayDelete(data) {
  return request({
    name: 'want_say_delete',
    data
  })
}

/**
 * 编辑想说的话
 * @param {Object} data - 请求参数
 * @param {string} data._id - 记录ID
 * @param {string} data.content - 内容
 * @returns {Promise}
 */
export function wantSayEdit(data) {
  return request({
    name: 'want_say_edit',
    data
  })
}

/**
 * 编辑想说的话的已读状态
 * @param {Object} data - 请求参数
 * @param {string} data._id - 记录ID
 * @returns {Promise}
 */
export function wantSayEditStatus(data) {
  return request({
    name: 'want_say_edit_status',
    data
  })
}

/**
 * 获取收到的想说的话
 * @param {Object} data - 请求参数
 * @returns {Promise}
 */
export function wantSayGet(data) {
  return request({
    name: 'want_say_get',
    data
  })
}

/**
 * 获取想说的话列表（自己发送的）
 * @param {Object} data - 请求参数
 * @returns {Promise}
 */
export function wantSayList(data) {
  return request({
    name: 'want_say_list',
    data
  })
}
