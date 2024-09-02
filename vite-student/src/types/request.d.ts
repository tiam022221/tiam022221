/// <reference types="./response" />

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare type AnyResult = any

/** 请求类型 */
declare type RequestMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "OPTIONS"
  | "HEAD"
  | "TRACE"
  | "CONNECT"

/** 可选参数 */
declare interface RequestConfig {
  /** 域名 拼接在访问地址前 */
  baseUrl?: string
  /** 超时时间 单位ms */
  timeout?: number
  /** 响应数据类型 */
  responseType?: "arraybuffer" | "text"
  /** 下载文件名 */
  downloadFileName?: string
  /** 上传进度 */
  onUploadProgress?: (event: import("axios").AxiosProgressEvent) => void
  /** 是否统一显示请求错误 默认显示 */
  notifyRequestError?: boolean
  /** 是否统一显示响应错误 默认显示 */
  notifyResponseError?: boolean
  /** 是否统一显示接口错误 默认显示 */
  notifyApiError?: boolean
  /** 忽略掉不捕获的编码 */
  ignoreApiCodes?: number[]
  /** 是否不需要head */
  noNeedHead?: boolean
  /** 不跳转登录页 */
  noRedirectLogin?: boolean
  /** 是否不需要token */
  noNeedToken?: boolean
  /** 不处理错误 */
  noHandleError?: boolean
  /** 是否禁用删除空字符串 */
  noTrunEmptyString?: boolean
  /** 请求数据格式 默认application/json */
  contentType?: string
  /** 是否可并发请求 */
  multiple?: boolean
}
/** 请求参数 */
declare interface RequestOptions extends RequestConfig {
  /** 接口信息 */
  apiInfo: string
  /** 访问地址 */
  url: string
  /** 请求类型 */
  method?: RequestMethod
  /** 请求参数 会直接编码拼接在url后面 */
  params?: Record<string, string | boolean | number>
  /** 请求数据 */
  data?: Record<string, unknown> | FormData | File
  /** 请求头 */
  headers?: Record<string, string>
  /** 用于重试的参数，如果存在该项则无视任何处理，直接请求 */
  requestOptions?: RequestOptions
}

declare interface ResponseResult {
  /** 请求参数 */
  __requestOptions: RequestOptions
  /** 请求时间戳 */
  __requestTime?: number
  /** 响应或请求终止时间戳 */
  __responseTime?: number
}

/** 请求终止返回数据 */
declare interface RequestAbortResponseResult extends ResponseResult {
  /** 错误来源 */
  __error: "请求终止"
}

/** 请求错误返回数据  */
declare interface RequestErrorResponseResult extends ResponseResult {
  /** 错误来源 */
  __error: "请求错误"
  /** 错误信息 */
  __errMsg: string
}

/** 响应错误返回数据 */
declare interface ResponseErrorResponseResult extends ResponseResult {
  /** 错误来源 */
  __error: "响应错误"
  /** 错误信息 */
  __errMsg: string
  /** 请求状态码 */
  __status?: number
}

/** 接口错误返回数据 */
declare interface ApiErrorResponseResult extends ResponseResult {
  /** 错误来源 */
  __error: "接口错误"
  /** 错误信息 */
  __errMsg: string
  /** 请求状态码 */
  __status: number
  /** 接口状态码 */
  __code?: number
}

/** 正常返回数据 */
declare type RegularResponseResult<T> = T &
ResponseResult & { __error: undefined }

/** 下载返回数据 */
declare type DownloadResponseResult = {
  __error: undefined
  __downloadData: ArrayBuffer
}

/** 请求响应返回数据 */
declare type Result<T> =
  | RegularResponseResult<T>
  | RequestAbortResponseResult
  | RequestErrorResponseResult
  | ResponseErrorResponseResult
  | ApiErrorResponseResult
