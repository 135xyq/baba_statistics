// 用户相关

import request from "./index.js"

/**
 * 用户登录
 * @param data
 * @returns {*}
 */
export function userLogin(data){
  return request({
    name:'user_login',
    data
  })
}


/**
 * 获取用户列表
 * @param data
 * @returns {*}
 */
export function userGetList(data){
  return request({
    name:'user_get_list',
    data
  })
}

/**
 * 获取用户信息
 * @param data
 * @returns {*}
 */
export function userGetInfo(data){
  return request({
    name:'user_get_info',
    data
  })
}

/**
 * 修改用户信息
 * @param data
 * @returns {*}
 */
export function userSetInfo(data){
  return request({
    name:'user_set_info',
    data
  })
}

/**
 * 获取角色列表
 * @param data
 * @returns {*}
 */
export function getUserRoleList(data){
  return request({
    name:'user_role_list',
    data
  })
}

/**
 * 更新角色信息
 * @param data
 * @returns {*}
 */
export function updateUserRole(data){
  return request({
    name:'user_role_update',
    data
  })
}