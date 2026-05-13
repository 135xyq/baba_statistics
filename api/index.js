/**
 * 统一接口请求封装
 * 基于uniCloud云函数调用，统一处理加载状态、错误提示、登录校验等逻辑
 */

import store from "@/store/index.js"

/** 请求队列，用于管理并发请求 */
const requestQueue = new Map()

/**
 * 显示加载提示
 * @param {string} title - 提示文字
 */
function showLoading(title = '加载中') {
  uni.showLoading({ title, mask: true })
}

/**
 * 隐藏加载提示
 */
function hideLoading() {
  uni.hideLoading()
}

/**
 * 显示提示消息
 * @param {string} title - 提示文字
 * @param {string} icon - 图标类型
 * @param {number} duration - 持续时间(ms)
 */
function showToast(title, icon = 'none', duration = 2000) {
  uni.showToast({ title, icon, duration })
}

/**
 * 跳转到登录页面
 */
function redirectToLogin() {
  uni.switchTab({ url: '/pages/login/login' })
  store.dispatch('tabbar/setTabIndex', store.state.tabbar?.tabNumber - 1)
  showToast('请先登录')
}

/**
 * 统一请求方法
 * @param {Object} options - 请求配置
 * @param {string} options.name - 云函数名称
 * @param {Object} [options.data={}] - 请求参数
 * @param {boolean} [options.data.isLoading] - 是否显示加载提示
 * @param {boolean} [options.data.needOpenid=true] - 是否需要openid校验
 * @param {boolean} [options.silent=false] - 是否静默模式（不显示错误提示）
 * @returns {Promise} 请求结果
 */
export default function request({ name, data = {}, silent = false }) {
  const isLoading = data.isLoading
  const needOpenid = data.needOpenid !== false
  if (data.isLoading !== undefined) delete data.isLoading
  if (data.needOpenid !== undefined) delete data.needOpenid

  const openid = data.openid || store.state.userInfo?.userInfo?.openid

  if (needOpenid && !openid) {
    redirectToLogin()
    return Promise.reject(new Error('未登录'))
  }

  isLoading && showLoading()

  const requestData = {
    ...data,
    ...(needOpenid ? { openid } : {})
  }

  return new Promise((resolve, reject) => {
    uniCloud.callFunction({
      name,
      data: requestData,
      success({ result }) {
        if (result.code === 0) {
          resolve(result.data)
        } else {
          const errorMsg = result?.msg || '接口异常'
          if (!silent) {
            showToast(errorMsg)
          }
          reject(new Error(errorMsg))
        }
      },
      fail(err) {
        const errorMsg = err?.errMsg || '网络请求失败'
        if (!silent) {
          showToast(errorMsg)
        }
        reject(new Error(errorMsg))
      },
      complete() {
        isLoading && hideLoading()
      }
    })
  })
}
