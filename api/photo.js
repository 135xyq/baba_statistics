// 照片

import request from "./index.js"

/**
 * 获取照片列表
 * @param data
 * @returns {*}
 */
export function photoList(data){
  return request({
    name:'photo_list',
    data
  })
}

/**
 * 新增照片
 * @param data
 * @returns {*}
 */
export function photoAdd(data){
  return request({
    name:'photo_add',
    data
  })
}

/**
 * 修改照片
 * @param data
 * @returns {*}
 */
export function photoEdit(data){
  return request({
    name:'photo_edit',
    data
  })
}

/**
 * 删除照片
 * @param data
 * @returns {*}
 */
export function photoDelete(data){
  return request({
    name:'photo_delete',
    data
  })
}

/**
 * 获取照片类型列表
 * @param data
 * @returns {*}
 */
export function photoTypeList(data){
  return request({
    name:'photo_type_list',
    data
  })
}

/**
 * 新增照片类型
 * @param data
 * @returns {*}
 */
export function photoTypeAdd(data){
  return request({
    name:'photo_type_add',
    data
  })
}

/**
 * 修改照片类型
 * @param data
 * @returns {*}
 */
export function photoTypeEdit(data){
  return request({
    name:'photo_type_edit',
    data
  })
}

/**
 * 删除照片类型
 * @param data
 * @returns {*}
 */
export function photoTypeDelete(data){
  return request({
    name:'photo_type_delete',
    data
  })
}