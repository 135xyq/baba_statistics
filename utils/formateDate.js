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
