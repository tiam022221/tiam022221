import { isNumber } from 'lodash-es'

/** 格式化时间 */
export const formateTime = (
  /** 时间值  单位是毫秒 */
  value: string | number | undefined | null,
  /** 格式  hh/h 小时 mm/m 分钟 ss/s 秒 */
  format = "m:ss"
) => {
  if (value === undefined || value === null || value === "") return
  const time = parseInt(String(value))
  if (!isNumber(time) || isNaN(time) || time < 0) return
  let str = format
  const hours = String(Math.floor(time / 3600))
  const minutes = String(Math.floor((time % 3600) / 60))
  const seconds = String(Math.floor(time % 60))
  str = str.replace(/h{2,}/, hours.replace(/(?=\b\d\b)/g, "0"))
  str = str.replace(/h/, hours)
  str = str.replace(/m{2,}/, minutes.replace(/(?=\b\d\b)/g, "0"))
  str = str.replace(/m/, minutes)
  str = str.replace(/s{2,}/, seconds.replace(/(?=\b\d\b)/g, "0"))
  str = str.replace(/s/, seconds)
  return str
}

/** 格式化时间 */
export const formateUtc = (
  /** 时间值 */
  value: string | number | undefined | null | Date,
  /** 格式  YYYY/YY 年份 EM 英文月份 MM/M 月份 dd/d 日 hh/h 小时 mm/m 分钟 ss/s 秒 SSS/SS/S 毫秒 */
  format = "YYYY-MM-dd hh:mm:ss"
) => {
  if (value === undefined || value === null || value === "") return
  try {
    const time = new Date(value)
    if (isNaN(time.getTime())) return
    let str = format
    const year = String(time.getFullYear())
    const month = String(time.getMonth() + 1)
    const date = String(time.getDate())
    const hours = String(time.getHours())
    const minutes = String(time.getMinutes())
    const seconds = String(time.getSeconds())
    const milliseconds = String(time.getMilliseconds()).replace(
      /(?=\b\d\b)/g,
      "0"
    )
    str = str.replace(/Y{4,}/, year)
    str = str.replace(/Y{2,}/, year.slice(2, 4))
    str = str.replace(/M{2,}/, month.replace(/(?=\b\d\b)/g, "0"))
    str = str.replace(/M/, month)
    str = str.replace(/d{2,}/, date.replace(/(?=\b\d\b)/g, "0"))
    str = str.replace(/d/, date)
    str = str.replace(/h{2,}/, hours.replace(/(?=\b\d\b)/g, "0"))
    str = str.replace(/h/, hours)
    str = str.replace(/m{2,}/, minutes.replace(/(?=\b\d\b)/g, "0"))
    str = str.replace(/m/, minutes)
    str = str.replace(/s{2,}/, seconds.replace(/(?=\b\d\b)/g, "0"))
    str = str.replace(/s/, seconds)
    str = str.replace(/S{3,}/, milliseconds)
    str = str.replace(/S{2,}/, milliseconds.slice(0, 2))
    str = str.replace(/S/, milliseconds.slice(0, 1))
    const list = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const enMatch = str.match(/E\d+/)
    if (enMatch) {
      str = str.replace(enMatch[0], list[time.getMonth()])
    }
    return str
  } catch (error) {
    console.error("utcDateTime Error:", error)
  }
}
