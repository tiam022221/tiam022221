import type { AxiosResponse } from "axios"

/** 判断是否是下载对象 */
export const isDownloadData = (response: AxiosResponse<AnyResult>) => {
  const contentType = response?.headers?.["content-type"] ?? ""
  return (
    /application\/octet-stream/.test(contentType) ||
    /application\/x-zip-compressed/.test(contentType) ||
    /application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet/.test(contentType)
  )
}
