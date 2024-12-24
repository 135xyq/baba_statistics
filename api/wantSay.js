// 想说的话

import request from "./index.js"

/**
 * 新增想说的话
 * @param data
 * @returns {*}
 */
export function wantSayAdd(data){
  return request({
    name:'want_say_add',
    data
  })
}

/**
 * 删除想说的话
 * @param data
 * @returns {*}
 */
export function wantSayDelete(data){
  return request({
    name:'want_say_delete',
    data
  })
}

/**
 * 编辑想说的话
 * @param data
 * @returns {*}
 */
export function wantSayEdit(data){
  return request({
    name:'want_say_edit',
    data
  })
}

/**
 * 编辑想说的话的状态
 * @param data
 * @returns {*}
 */
export function wantSayEditStatus(data){
  return request({
    name:'want_say_edit_status',
    data
  })
}

/**
 * 获取收到的想说的话
 * @param data
 * @returns {*}
 */
export function wantSayGet(data){
  return request({
    name:'want_say_get',
    data
  })
}

/**
 * 获取想说的话列表
 * @param data
 * @returns {*}
 */
export function wantSayList(data){
  return request({
    name:'want_say_list',
    data
  })
}