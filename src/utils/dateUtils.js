/*格式化日期 */
export function formateDate(time) {
    if (!time) return ''
    let date = new Date(time)
    let seconds = `${date.getSeconds()}`
    if (seconds.length < 2) {
        seconds = '0' + seconds
    }
    let hours = `${date.getHours()}`
    if (hours.length < 2) {
        hours = '0' + hours
    }
    let minutes = `${date.getMinutes()}`
    if (minutes.length < 2) {
        minutes = '0' + minutes
    }

    return date.getFullYear() + '-'
        + (date.getMonth() + 1) + '-'
        + date.getDate() + ' '
        + hours + ':'
        + minutes + ':'
        + seconds
}

