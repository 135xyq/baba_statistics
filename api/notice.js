// 公告

import request from "./index.js"

/**
 * 获取公告列表
 * @param data
 * @returns {*}
 */
export function noticeGet(data){
  return request({
    name:'notice_get',
    data
  })
}

/**
 * 新增公告
 * @param data
 * @returns {*}
 */
export function noticeAdd(data){
  return request({
    name:'notice_add',
    data
  })
}

/**
 * 修改公告
 * @param data
 * @returns {*}
 */
export function noticeEdit(data){
  return request({
    name:'notice_edit',
    data
  })
}