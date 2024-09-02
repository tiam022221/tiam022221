/// <reference types="../../types/request" />
import type { AxiosResponse } from "axios"

/** 默认参数 */
export interface DefaultOptions {
  /** 域名 拼接在访问地址前 */
  baseURL: string
  /** 超时时间 单位ms */
  timeout: number
}

/** 请求拦截器 */
export type RequestInterceptor = (
  options: RequestOptions
) => Promise<RequestOptions | undefined>
/** 请求错误捕获器 */
export type RequestInterceptorCatcher = (
  options: RequestOptions,
  error: Error
) => Promise<RequestErrorResponseResult>
/** 请求之前数据处理 */
export type TransformRequestData = (
  options: RequestOptions
) => Promise<RequestOptions | undefined>
/** 响应拦截器 */
export type ResponseInterceptor = (
  options: RequestOptions,
  result: Result<AnyResult>,
  response: AxiosResponse<AnyResult>
) => Promise<Result<AnyResult>>
/** 响应错误捕获器 */
export type ResponseInterceptorCatcher = (
  options: RequestOptions,
  error: Error,
  response?: AxiosResponse<AnyResult>
) => Promise<ResponseErrorResponseResult | RequestAbortResponseResult | Result<AnyResult>>
/** 响应数据处理 */
export type TransformResponseData = (
  options: RequestOptions,
  result: Result<AnyResult>,
  response: AxiosResponse<AnyResult>
) => Promise<Result<AnyResult>>

/** 异常请求状态码捕获 */
export type ErrorStatusCodeCatcher = (
  options: RequestOptions,
  statusCode: number
) => Promise<
ResponseErrorResponseResult | RequestAbortResponseResult | undefined
>
/** 异常接口状态码捕获 */
export type ErrorApiCodeCatcher = (
  options: RequestOptions,
  result: RegularResponseResult<AnyResult>,
  response: AxiosResponse<AnyResult>
) => Promise<ApiErrorResponseResult | undefined>

/** 请求实例拦截器 */
export interface RequestInterceptors {
  /** 请求拦截器 */
  requestInterceptor?: RequestInterceptor
  /** 请求错误捕获器 */
  requestInterceptorCatcher?: RequestInterceptorCatcher
  /** 请求数据处理 */
  transformRequestData?: TransformRequestData
  /** 响应拦截器 */
  responseInterceptor?: ResponseInterceptor
  /** 响应错误捕获器 */
  responseInterceptorCatcher?: ResponseInterceptorCatcher
  /** 响应数据处理 */
  transformResponseData?: TransformResponseData
}

/** 请求路径 */
export type RequestUrl = string
/** 取消请求函数 */
export type CancelFunction = () => void
/** 多请求时候的唯一标识码，只有请求multiple为true时存在 */
export type MultipleGuid = string
/** Map对象 */
export type RequestObject =
  | CancelFunction
  | Record<MultipleGuid, CancelFunction>

/** 创建请求 */
export type CreateRequest = (
  url: RequestUrl,
  cancelFunction: CancelFunction,
  multipleGuid?: MultipleGuid
) => void

/** 终止并删除请求 */
export type removeRequest = (
  url: RequestUrl,
  multipleGuid?: MultipleGuid
) => void

/** 请求库类型 */
export interface RequestInterface {
  /** 创建请求 */
  createRequest(
    url: RequestUrl,
    cancelFunction: CancelFunction,
    multipleGuid?: MultipleGuid
  ): void
  /** 删除请求 */
  removeRequest(url: RequestUrl, multipleGuid?: MultipleGuid): void
  /** 终止请求 */
  abortRequest(url: RequestUrl, multipleGuid?: MultipleGuid): void
  /** 装载拦截器 */
  setupInterceptors(instanceOptions: RequestInterceptors): void
  /** 请求函数 */
  request<T extends AnyResult>(options: RequestOptions): Promise<Result<T>>
  post<T extends AnyResult>(options: RequestOptions): Promise<Result<T>>
  get<T extends AnyResult>(options: RequestOptions): Promise<Result<T>>
}
