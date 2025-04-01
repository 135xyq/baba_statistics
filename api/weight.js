// 体重

import request from "./index.js"

/**
 * 获取月份体重列表
 * @param data
 * @returns {*}
 */
export function weightGetMonth(data){
  return request({
    name:'weight_get_month',
    data
  })
}

/**
 * 获取月份体重列表图表使用
 * @param data
 * @returns {*}
 */
export function weightGetMonthChart(data){
  return request({
    name:'weight_month_chart',
    data
  })
}



/**
 * 获取天体重列表
 * @param data
 * @returns {*}
 */
export function weightGetDay(data){
  return request({
    name:'weight_get_day',
    data
  })
}

/**
 * 新增体重
 * @param data
 * @returns {*}
 */
export function weightAdd(data){
  return request({
    name:'weight_add',
    data
  })
}

/**
 * 修改体重
 * @param data
 * @returns {*}
 */
export function weightEdit(data){
  return request({
    name:'weight_edit',
    data
  })
}


/**
 * 删除体重
 * @param data
 * @returns {*}
 */
export function weightDelete(data){
  return request({
    name:'weight_delete',
    data
  })
}