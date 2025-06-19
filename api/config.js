// 幸运转盘

import request from '@/api/index';

/**
 * 更新系统配置
 * @param data
 * @returns {*}
 */
export function updateConfig(data){
  return request({
    name:'system_config_update',
    data
  })
}

/**
 * 获取系统配置
 * @param data
 * @returns {*}
 */
export function getConfig(data){
  return request({
    name:'system_config_get',
    data
  })
}