/**格式化时间
 * @param {Object} time 时间戳
 */
export default function(time) {
    const date = new Date(+time);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
    const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
    const hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
    const minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
    const seconds = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();
    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`
}


/**格式化时间
 * @param {Object} time 时间戳
 */
export  function formateDate(time) {
    const date = new Date(+time);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
    const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
    return `${year}-${month}-${day}`
}


/**格式化时间
 * @param {Object} time 时间戳
 */
export  function formateDateHMS(time) {
  let hours = Math.max(Math.floor(time / 3600), 0)
  let minutes = Math.max(Math.floor((time - hours * 3600) / 60), 0)
  let seconds = time % 60
  return `${hours > 9?hours:('0'+hours)}:${minutes > 9?minutes:'0'+minutes}:${seconds > 9?seconds:'0'+seconds}`
}
