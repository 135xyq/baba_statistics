// 总结

import request from "./index.js"

/**
 * 获取总结
 * @param data
 * @returns {*}
 */
export function summarize(data){
  return request({
    name:'summarize',
    data
  })
}