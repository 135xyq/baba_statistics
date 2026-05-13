/**
 * 聊天相关接口
 * 提供聊天消息的发送和查询功能
 */
import request from "./index.js"

/**
 * 新增聊天消息
 * @param {Object} data - 请求参数
 * @param {string} data.openid - 发送者openid
 * @param {string} data.toOpenid - 接收者openid
 * @param {string} data.content - 消息内容
 * @returns {Promise}
 */
export function chatMessageAdd(data) {
  return request({
    name: 'chat_user_message_add',
    data
  })
}

/**
 * 获取用户聊天列表
 * @param {Object} data - 请求参数
 * @param {string} data.openid - 用户openid
 * @returns {Promise}
 */
export function chatUserList(data) {
  return request({
    name: 'chat_user_list',
    data
  })
}

/**
 * 获取用户聊天记录
 * @param {Object} data - 请求参数
 * @param {string} data.openid - 用户openid
 * @param {string} data.toOpenid - 对方openid
 * @returns {Promise}
 */
export function chatUserMessageList(data) {
  return request({
    name: 'chat_user_message_list',
    data
  })
}
