// 盲盒

import request from "./index.js"

/**
 * 获取盲盒列表
 * @param data
 * @returns {*}
 */
export function blindList(data){
  return request({
    name:'blind_list',
    data
  })
}

/**
 * 新增盲盒
 * @param data
 * @returns {*}
 */
export function blindAdd(data){
  return request({
    name:'blind_add',
    data
  })
}

/**
 * 修改盲盒
 * @param data
 * @returns {*}
 */
export function blindEdit(data){
  return request({
    name:'blind_edit',
    data
  })
}

/**
 * 删除盲盒
 * @param data
 * @returns {*}
 */
export function blindDelete(data){
  return request({
    name:'blind_delete',
    data
  })
}

/**
 * 获取盲盒类型列表
 * @param data
 * @returns {*}
 */
export function blindTypeList(data){
  return request({
    name:'blind_type_list',
    data
  })
}

/**
 * 新增盲盒类型
 * @param data
 * @returns {*}
 */
export function blindTypeAdd(data){
  return request({
    name:'blind_type_add',
    data
  })
}

/**
 * 修改盲盒类型
 * @param data
 * @returns {*}
 */
export function blindTypeEdit(data){
  return request({
    name:'blind_type_edit',
    data
  })
}

/**
 * 删除盲盒类型
 * @param data
 * @returns {*}
 */
export function blindTypeDelete(data){
  return request({
    name:'blind_type_delete',
    data
  })
}