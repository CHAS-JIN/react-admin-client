/*格式化日期 */
export function formateDate(time) {
    if (!time) return ''
    let date = new Date(time)
    let seconds = `${date.getSeconds()}`
    if (seconds.length < 2) {
        seconds = '0' + seconds
    }
    return date.getFullYear() + '-'
        + (date.getMonth() + 1) + '-'
        + date.getDate() + ' '
        + date.getHours() + ':'
        + date.getMinutes() + ':'
        + seconds
}