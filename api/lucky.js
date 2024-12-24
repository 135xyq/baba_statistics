// 幸运转盘

import request from '@/api/index';

/**
 * 获取转盘列表
 * @param data
 * @returns {*}
 */
export function luckyList(data){
  return request({
    name:'lucky_list',
    data
  })
}

/**
 * 新增转盘
 * @param data
 * @returns {*}
 */
export function luckyAdd(data){
  return request({
    name:'lucky_add',
    data
  })
}

/**
 * 修改转盘
 * @param data
 * @returns {*}
 */
export function luckyEdit(data){
  return request({
    name:'lucky_edit',
    data
  })
}

/**
 * 删除转盘
 * @param data
 * @returns {*}
 */
export function luckyDelete(data){
  return request({
    name:'lucky_delete',
    data
  })
}