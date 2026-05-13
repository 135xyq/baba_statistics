/**
 * 日期格式化工具
 * 提供多种日期时间格式化方法
 */

/**
 * 格式化时间为完整日期时间字符串
 * @param {number|string} time - 时间戳
 * @returns {string} 格式化后的日期时间字符串，如 2024-01-15 14:30:25
 */
export default function formatDateTime(time) {
  const date = new Date(+time);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
  const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
  const hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
  const minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
  const seconds = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();
  return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
}

/**
 * 格式化时间为日期字符串（不含时分秒）
 * @param {number|string} time - 时间戳
 * @returns {string} 格式化后的日期字符串，如 2024-01-15
 */
export function formateDate(time) {
  const date = new Date(+time);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
  const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
  return `${year}-${month}-${day}`;
}

/**
 * 将秒数格式化为时分秒字符串
 * @param {number} time - 秒数
 * @returns {string} 格式化后的时分秒字符串，如 01:30:25
 */
export function formateDateHMS(time) {
  let hours = Math.max(Math.floor(time / 3600), 0);
  let minutes = Math.max(Math.floor((time - hours * 3600) / 60), 0);
  let seconds = time % 60;
  return `${hours > 9 ? hours : ('0' + hours)}:${minutes > 9 ? minutes : '0' + minutes}:${seconds > 9 ? seconds : '0' + seconds}`;
}
