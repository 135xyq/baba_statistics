/**
 * 照片相关接口
 * 提供照片和照片类型的增删查改功能
 */
import request from "./index.js"

/**
 * 获取照片列表
 * @param {Object} data - 请求参数
 * @param {string} data.typeId - 照片类型ID
 * @returns {Promise}
 */
export function photoList(data) {
  return request({
    name: 'photo_list',
    data
  })
}

/**
 * 新增照片
 * @param {Object} data - 请求参数
 * @param {string} data.url - 照片地址
 * @returns {Promise}
 */
export function photoAdd(data) {
  return request({
    name: 'photo_add',
    data
  })
}

/**
 * 修改照片
 * @param {Object} data - 请求参数
 * @param {string} data._id - 照片ID
 * @returns {Promise}
 */
export function photoEdit(data) {
  return request({
    name: 'photo_edit',
    data
  })
}

/**
 * 删除照片
 * @param {Object} data - 请求参数
 * @param {string} data._id - 照片ID
 * @returns {Promise}
 */
export function photoDelete(data) {
  return request({
    name: 'photo_delete',
    data
  })
}

/**
 * 获取照片类型列表
 * @param {Object} data - 请求参数
 * @returns {Promise}
 */
export function photoTypeList(data) {
  return request({
    name: 'photo_type_list',
    data
  })
}

/**
 * 新增照片类型
 * @param {Object} data - 请求参数
 * @param {string} data.name - 类型名称
 * @returns {Promise}
 */
export function photoTypeAdd(data) {
  return request({
    name: 'photo_type_add',
    data
  })
}

/**
 * 修改照片类型
 * @param {Object} data - 请求参数
 * @param {string} data._id - 类型ID
 * @returns {Promise}
 */
export function photoTypeEdit(data) {
  return request({
    name: 'photo_type_edit',
    data
  })
}

/**
 * 删除照片类型
 * @param {Object} data - 请求参数
 * @param {string} data._id - 类型ID
 * @returns {Promise}
 */
export function photoTypeDelete(data) {
  return request({
    name: 'photo_type_delete',
    data
  })
}
