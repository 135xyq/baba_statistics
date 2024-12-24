// 粑粑


import request from "./index.js"

/**
 * 新增粑粑
 * @param data
 * @returns {*}
 */
export function thingAdd(data){
  return request({
    name:'thing_add',
    data
  })
}

/**
 * 统计粑粑总数量
 * @param data
 * @returns {*}
 */
export function thingCount(data){
  return request({
    name:'thing_count',
    data
  })
}

/**
 * 删除粑粑
 * @param data
 * @returns {*}
 */
export function thingDelete(data){
  return request({
    name:'thing_delete',
    data
  })
}

/**
 * 获取指定日期的粑粑信息
 * @param data
 * @returns {*}
 */
export function thingGetDay(data){
  return request({
    name:'thing_get_day',
    data
  })
}

/**
 * 分页获取粑粑信息
 * @param data
 * @returns {*}
 */
export function thingGetList(data){
  return request({
    name:'thing_get_list',
    data
  })
}

/**
 * 获取指定月份每一天的粑粑信息
 * @param data
 * @returns {*}
 */
export function thingGetMonth(data){
  return request({
    name:'thing_get_month',
    data
  })
}

/**
 * 获取当天的粑粑信息
 * @param data
 * @returns {*}
 */
export function thingGetToday(data){
  return request({
    name:'thing_get_today',
    data
  })
}

/**
 * 获取排行榜信息
 * @param data
 * @returns {*}
 */
export function thingGetTotalList(data){
  return request({
    name:'thing_get_total_list',
    data
  })
}


/**
 * 获取最近30天的统计数据
 * @param data
 * @returns {*}
 */
export function thingGetMonthChart(data){
  return request({
    name:'thing_get_month_chart',
    data
  })
}