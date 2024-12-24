// 地图

import request from '@/api/index';

/**
 * 新增地图信息
 * @param data
 * @returns {*}
 */
export function mapAdd(data){
  return request({
    name:'map_add',
    data
  })
}

/**
 * 获取地图信息
 * @param data
 * @returns {*}
 */
export function mapList(data){
  return request({
    name:'map_list',
    data
  })
}