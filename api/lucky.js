/**
 * 幸运转盘相关接口
 * 提供转盘选项的增删查改功能
 */
import request from '@/api/index'

/**
 * 获取转盘选项列表
 * @param {Object} data - 请求参数
 * @returns {Promise}
 */
export function luckyList(data) {
  return request({
    name: 'lucky_list',
    data
  })
}

/**
 * 新增转盘选项
 * @param {Object} data - 请求参数
 * @param {string} data.name - 选项名称
 * @returns {Promise}
 */
export function luckyAdd(data) {
  return request({
    name: 'lucky_add',
    data
  })
}

/**
 * 修改转盘选项
 * @param {Object} data - 请求参数
 * @param {string} data._id - 选项ID
 * @returns {Promise}
 */
export function luckyEdit(data) {
  return request({
    name: 'lucky_edit',
    data
  })
}

/**
 * 删除转盘选项
 * @param {Object} data - 请求参数
 * @param {string} data._id - 选项ID
 * @returns {Promise}
 */
export function luckyDelete(data) {
  return request({
    name: 'lucky_delete',
    data
  })
}
