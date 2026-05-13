/**
 * 用户相关接口
 * 提供用户登录、信息管理、角色管理等功能
 */
import request from "./index.js"

/**
 * 用户登录
 * @param {Object} data - 请求参数
 * @param {string} data.openid - 用户唯一标识
 * @param {string} data.nickName - 昵称
 * @param {string} data.avatarUrl - 头像地址
 * @param {string} data.roleId - 角色ID
 * @returns {Promise}
 */
export function userLogin(data) {
  return request({
    name: 'user_login',
    data
  })
}

/**
 * 通过微信code获取openid
 * @param {Object} data - 请求参数
 * @param {string} data.code - 微信登录code
 * @returns {Promise}
 */
export function userLoginCode(data) {
  return request({
    name: 'user_login_code',
    data
  })
}

/**
 * 获取用户列表
 * @param {Object} data - 请求参数
 * @param {string} data.type - 列表类型
 * @returns {Promise}
 */
export function userGetList(data) {
  return request({
    name: 'user_get_list',
    data
  })
}

/**
 * 获取用户信息
 * @param {Object} data - 请求参数
 * @param {string} data.openid - 用户唯一标识
 * @returns {Promise}
 */
export function userGetInfo(data) {
  return request({
    name: 'user_get_info',
    data
  })
}

/**
 * 修改用户信息
 * @param {Object} data - 请求参数
 * @param {string} data.openid - 用户唯一标识
 * @returns {Promise}
 */
export function userSetInfo(data) {
  return request({
    name: 'user_set_info',
    data
  })
}

/**
 * 获取角色列表
 * @param {Object} data - 请求参数
 * @returns {Promise}
 */
export function getUserRoleList(data) {
  return request({
    name: 'user_role_list',
    data
  })
}

/**
 * 更新角色信息
 * @param {Object} data - 请求参数
 * @param {string} data._id - 角色ID
 * @returns {Promise}
 */
export function updateUserRole(data) {
  return request({
    name: 'user_role_update',
    data
  })
}

/**
 * 删除角色信息
 * @param {Object} data - 请求参数
 * @param {string} data._id - 角色ID
 * @returns {Promise}
 */
export function deleteUserRole(data) {
  return request({
    name: 'user_role_delete',
    data
  })
}

/**
 * 新增角色信息
 * @param {Object} data - 请求参数
 * @param {string} data.roleName - 角色名称
 * @returns {Promise}
 */
export function addUserRole(data) {
  return request({
    name: 'user_role_add',
    data
  })
}
