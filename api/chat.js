// 聊天

import request from "./index.js"

/**
 * 新增聊天记录信息
 * @param data
 * @returns {*}
 */
export function chatMessageAdd(data){
  return request({
    name:'chat_user_message_add',
    data
  })
}

/**
 * 获取用户聊天列表
 * @param data
 * @returns {*}
 */
export function chatUserList(data){
  return request({
    name:'chat_user_list',
    data
  })
}

/**
 * 获取用户聊天记录
 * @param data
 * @returns {*}
 */
export function chatUserMessageList(data){
  return request({
    name:'chat_user_message_list',
    data
  })
}