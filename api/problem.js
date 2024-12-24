// 题目

import request from "./index.js"

/**
 * 新增题目
 * @param data
 * @returns {*}
 */
export function problemAdd(data){
  return request({
    name:'problem_add',
    data
  })
}

/**
 * 编辑题目
 * @param data
 * @returns {*}
 */
export function problemEdit(data){
  return request({
    name:'problem_edit',
    data
  })
}

/**
 *
 * @param data
 * @returns {*}
 */
export function problemDelete(data){
  return request({
    name:'problem_delete',
    data
  })
}

/**
 * 获取指定天的题目
 * @param data
 * @returns {*}
 */
export function problemGetDay(data){
  return request({
    name:'problem_get_day',
    data
  })
}

/**
 * 获取指定月份的题目，正确率
 * @param data
 * @returns {*}
 */
export function problemGetMonth(data){
  return request({
    name:'problem_get_month',
    data
  })
}


/**
 * 获取指定月份的题目，单个题目类型的正确率,折线图使用
 * @param data
 * @returns {*}
 */
export function problemGetMonthLine(data){
  return request({
    name:'problem_month_chart',
    data
  })
}

/**
 * 指定天做题信息的扇形统计图
 * @param data
 * @returns {*}
 */
export function problemGetRoundChart(data){
  return request({
    name:'problem_round_chart',
    data
  })
}



