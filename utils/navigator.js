/**
 * 统一导航跳转工具
 * 封装微信小程序页面跳转方法，统一管理路径和参数传递
 */

/** 分包根路径 */
const SUB_PACKAGE_ROOT = '/other'

/** tabBar页面路径映射 */
const TAB_BAR_PAGES = {
  index: '/pages/index/index',
  blind: '/pages/blind/blind',
  problem: '/pages/problem/problem',
  chat: '/pages/chat/chat',
  login: '/pages/login/login'
}

/** 分包页面路径映射 */
const SUB_PAGES = {
  thingListDetail: 'thing-list-detail/thing-list-detail',
  thingMonthChart: 'thing-month-chart/thing-month-chart',
  thingHistory: 'thing-history/thing-history',
  problemAdd: 'problem-add/problem-add',
  problemMonthChart: 'problemMonthChart/problemMonthChart',
  timeCount: 'timeCount/timeCount',
  noticePage: 'noticePage/noticePage',
  chatDetail: 'chat-detail/chat-detail',
  weightHistory: 'weight-history/weight-history',
  weightChart: 'weight-chart/weight-chart',
  summarize: 'summarize/summarize',
  photoWall: 'photo-wall/photo-wall',
  photoAlbum: 'photo-album/photo-album',
  userRoleSet: 'user-role-set/user-role-set',
  lucky: 'lucky/lucky',
  luckySet: 'lucky-set/lucky-set',
  map: 'map/map',
  blindType: 'blind-type/blind-type',
  blindAdd: 'blind-add/blind-add',
  ranking: 'ranking/ranking',
  set: 'set/set',
  role: 'role/role',
  perlerBeads: 'perler-beads/perler-beads',
  wantSay: 'want-say/want-say',
  wantSayAdd: 'want-say-add/want-say-add'
}

/**
 * 获取分包页面完整路径
 * @param {string} pageName - 分包页面名称（SUB_PAGES中的key）
 * @returns {string} 完整路径
 */
export function getSubPagePath(pageName) {
  const relativePath = SUB_PAGES[pageName]
  if (!relativePath) {
    console.error(`[导航] 未找到分包页面: ${pageName}`)
    return ''
  }
  return `${SUB_PACKAGE_ROOT}/${relativePath}`
}

/**
 * 将参数对象转换为URL查询字符串
 * @param {Object} params - 参数对象
 * @returns {string} 查询字符串，如 ?key1=value1&key2=value2
 */
export function buildQueryString(params) {
  if (!params || typeof params !== 'object') return ''
  const pairs = []
  for (const key in params) {
    if (params[key] !== undefined && params[key] !== null) {
      const value = typeof params[key] === 'object'
        ? JSON.stringify(params[key])
        : params[key]
      pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    }
  }
  return pairs.length > 0 ? '?' + pairs.join('&') : ''
}

/**
 * 跳转到tabBar页面
 * @param {string} pageName - tabBar页面名称（TAB_BAR_PAGES中的key）
 */
export function switchTab(pageName) {
  const url = TAB_BAR_PAGES[pageName]
  if (!url) {
    console.error(`[导航] 未找到tabBar页面: ${pageName}`)
    return
  }
  uni.switchTab({ url })
}

/**
 * 跳转到分包页面（保留当前页面）
 * @param {string} pageName - 分包页面名称（SUB_PAGES中的key）
 * @param {Object} params - 传递的参数对象
 */
export function navigateToSubPage(pageName, params = {}) {
  const basePath = getSubPagePath(pageName)
  if (!basePath) return
  const url = basePath + buildQueryString(params)
  uni.navigateTo({ url })
}

/**
 * 跳转到指定路径页面（保留当前页面）
 * @param {string} url - 完整页面路径
 * @param {Object} params - 传递的参数对象
 */
export function navigateTo(url, params = {}) {
  const fullUrl = url + buildQueryString(params)
  uni.navigateTo({ url: fullUrl })
}

/**
 * 关闭当前页面并跳转到指定页面
 * @param {string} url - 完整页面路径
 * @param {Object} params - 传递的参数对象
 */
export function redirectTo(url, params = {}) {
  const fullUrl = url + buildQueryString(params)
  uni.redirectTo({ url: fullUrl })
}

/**
 * 关闭所有页面并跳转到指定页面
 * @param {string} url - 完整页面路径
 * @param {Object} params - 传递的参数对象
 */
export function reLaunch(url, params = {}) {
  const fullUrl = url + buildQueryString(params)
  uni.reLaunch({ url: fullUrl })
}

/**
 * 返回上一页
 * @param {number} delta - 返回的页面数，默认为1
 */
export function navigateBack(delta = 1) {
  uni.navigateBack({ delta })
}

export default {
  getSubPagePath,
  buildQueryString,
  switchTab,
  navigateToSubPage,
  navigateTo,
  redirectTo,
  reLaunch,
  navigateBack,
  TAB_BAR_PAGES,
  SUB_PAGES
}
