/**
 * 盲盒相关接口
 * 提供盲盒和盲盒类型的增删查改功能
 */
import request from "./index.js"

/**
 * 获取盲盒列表
 * @param {Object} data - 请求参数
 * @param {string} data.typeId - 盲盒类型ID
 * @returns {Promise}
 */
export function blindList(data) {
  return request({
    name: 'blind_list',
    data
  })
}

/**
 * 新增盲盒
 * @param {Object} data - 请求参数
 * @param {string} data.name - 盲盒名称
 * @param {string} data.typeId - 盲盒类型ID
 * @returns {Promise}
 */
export function blindAdd(data) {
  return request({
    name: 'blind_add',
    data
  })
}

/**
 * 修改盲盒
 * @param {Object} data - 请求参数
 * @param {string} data._id - 盲盒ID
 * @returns {Promise}
 */
export function blindEdit(data) {
  return request({
    name: 'blind_edit',
    data
  })
}

/**
 * 删除盲盒
 * @param {Object} data - 请求参数
 * @param {string} data._id - 盲盒ID
 * @returns {Promise}
 */
export function blindDelete(data) {
  return request({
    name: 'blind_delete',
    data
  })
}

/**
 * 获取盲盒类型列表
 * @param {Object} data - 请求参数
 * @returns {Promise}
 */
export function blindTypeList(data) {
  return request({
    name: 'blind_type_list',
    data
  })
}

/**
 * 新增盲盒类型
 * @param {Object} data - 请求参数
 * @param {string} data.name - 类型名称
 * @returns {Promise}
 */
export function blindTypeAdd(data) {
  return request({
    name: 'blind_type_add',
    data
  })
}

/**
 * 修改盲盒类型
 * @param {Object} data - 请求参数
 * @param {string} data._id - 类型ID
 * @returns {Promise}
 */
export function blindTypeEdit(data) {
  return request({
    name: 'blind_type_edit',
    data
  })
}

/**
 * 删除盲盒类型
 * @param {Object} data - 请求参数
 * @param {string} data._id - 类型ID
 * @returns {Promise}
 */
export function blindTypeDelete(data) {
  return request({
    name: 'blind_type_delete',
    data
  })
}
