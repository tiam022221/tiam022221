import axios from "axios"
import type { AxiosInstance, AxiosResponse, AxiosError } from "axios"
import { isFunction, isObject, cloneDeep } from "lodash-es"
import { guidGenerator } from "@/utils/guid"
import type {
  TransformRequestData,
  RequestInterceptors,
  RequestInterceptor,
  RequestInterceptorCatcher,
  ResponseInterceptor,
  ResponseInterceptorCatcher,
  TransformResponseData,
  DefaultOptions,
  RequestUrl,
  CancelFunction,
  MultipleGuid,
  RequestObject,
  RequestInterface
} from "./types"

export default class Request implements RequestInterface {
  static requestMap = new Map<RequestUrl, RequestObject>()
  private instance: AxiosInstance
  private transformRequestData: TransformRequestData = async (options) =>
    options

  private requestInterceptor: RequestInterceptor = async (options) => options
  private requestInterceptorCatcher: RequestInterceptorCatcher | undefined
  private responseInterceptor: ResponseInterceptor | undefined
  private responseInterceptorCatcher: ResponseInterceptorCatcher | undefined
  private transformResponseData: TransformResponseData | undefined

  constructor (
    interceptors: RequestInterceptors,
    defaultOptions: DefaultOptions
  ) {
    this.instance = axios.create(defaultOptions)
    this.setupInterceptors(interceptors)
  }

  createRequest (
    url: RequestUrl,
    cancelFunction: CancelFunction,
    multipleGuid?: MultipleGuid
  ) {
    // 是否多任务
    if (multipleGuid) {
      const object = Request.requestMap.get(url)
      if (object) {
        const obj = object as Record<MultipleGuid, CancelFunction>
        Reflect.set(obj, multipleGuid, cancelFunction)
      } else {
        Request.requestMap.set(url, { multipleGuid: cancelFunction })
      }
    } else {
      Request.requestMap.set(url, cancelFunction)
    }
  }

  removeRequest (url: RequestUrl, multipleGuid?: MultipleGuid) {
    const requestItem = Request.requestMap.get(url)
    if (!requestItem) return
    if (isFunction(requestItem)) {
      Request.requestMap.delete(url)
    } else if (isObject(requestItem)) {
      if (multipleGuid) {
        Reflect.deleteProperty(requestItem, multipleGuid)
      } else {
        Request.requestMap.delete(url)
      }
    }
  }

  abortRequest (url: RequestUrl, multipleGuid?: MultipleGuid) {
    const requestItem = Request.requestMap.get(url)
    if (!requestItem) return
    if (isFunction(requestItem)) {
      requestItem()
      Request.requestMap.delete(url)
    } else if (isObject(requestItem)) {
      if (multipleGuid) {
        const cancelFunction = requestItem[multipleGuid]
        cancelFunction && cancelFunction()
        Reflect.deleteProperty(requestItem, multipleGuid)
      } else {
        for (const key in requestItem) {
          const cancelFunction = requestItem[key]
          cancelFunction && cancelFunction()
        }
        Request.requestMap.delete(url)
      }
    }
  }

  setupInterceptors (instanceOptions: RequestInterceptors) {
    const {
      transformRequestData,
      requestInterceptor,
      requestInterceptorCatcher,
      responseInterceptor,
      responseInterceptorCatcher,
      transformResponseData
    } = instanceOptions || {}
    if (isFunction(transformRequestData)) {
      this.transformRequestData = transformRequestData
    }
    if (isFunction(requestInterceptor)) {
      this.requestInterceptor = requestInterceptor
    }
    if (isFunction(requestInterceptorCatcher)) {
      this.requestInterceptorCatcher = requestInterceptorCatcher
    }
    if (isFunction(responseInterceptor)) {
      this.responseInterceptor = responseInterceptor
    }
    if (isFunction(responseInterceptorCatcher)) {
      this.responseInterceptorCatcher = responseInterceptorCatcher
    }
    if (isFunction(transformResponseData)) {
      this.transformResponseData = transformResponseData
    }
  }

  async request<T extends AnyResult> (
    options: RequestOptions
  ): Promise<Result<T>> {
    // 请求前处理数据
    let opt: RequestOptions = options
    try {
      const interceptedOptions = await this.requestInterceptor(options)
      if (!interceptedOptions) {
        return { __error: "请求终止", __requestOptions: options }
      }
      opt = interceptedOptions
      const transformedOptions = await this.transformRequestData(opt)
      if (!transformedOptions) {
        return { __error: "请求终止", __requestOptions: opt }
      }
      opt = transformedOptions
    } catch (error) {
      if (isFunction(this.requestInterceptorCatcher)) {
        return await this.requestInterceptorCatcher(opt, error as Error)
      } else {
        const errorResponse = {
          __error: "请求错误",
          __errMsg: error
        } as RequestErrorResponseResult
        return errorResponse
      }
    }
    // 如果允许重复请求产生唯一标识
    const multipleGuid = options.multiple ? guidGenerator(false) : undefined
    // 如果不允许重复请求把该接口所有的请求都清除
    if (!multipleGuid) this.abortRequest(opt.url)
    // 创建请求
    const requestPromise = new Promise<Result<T>>((resolve, reject) => {
      // 是否已经终止
      let aborted = false
      // 记录请求时间
      const __requestTime = new Date().getTime()
      // 请求成功
      type SuccesResult = AxiosResponse<AnyResult>
      const requestSuccess = async (response: SuccesResult) => {
        if (aborted) return
        this.removeRequest(opt.url, multipleGuid)
        try {
          const data = response.data as AnyResult
          const __responseTime = new Date().getTime()
          let result = {
            ...data,
            __requestOptions: opt,
            __error: undefined
          } as Result<AnyResult>
          if (isFunction(this.responseInterceptor)) {
            result = await this.responseInterceptor(opt, result, response)
            if (result?.__error) {
              const res = { ...result, __requestTime, __responseTime }
              return resolve(res)
            }
          }
          if (isFunction(this.transformResponseData)) {
            result = await this.transformResponseData(opt, result, response)
            if (result?.__error) {
              const res = { ...result, __requestTime, __responseTime }
              return resolve(res)
            }
          }
          const res = { ...result, __requestTime, __responseTime }
          resolve(res)
        } catch (error) {
          if (isFunction(this.responseInterceptorCatcher)) {
            const errorResult = await this.responseInterceptorCatcher(
              opt,
              error as Error,
              response
            )
            const __responseTime = new Date().getTime()
            const res = { ...errorResult, __requestTime, __responseTime }
            resolve(res)
          } else {
            reject(error)
          }
        }
      }
      // 请求失败
      type FailError = AxiosError<AxiosResponse<AnyResult>>
      const requestFail = async (error: FailError) => {
        if (!aborted) this.removeRequest(opt.url, multipleGuid)
        if (isFunction(this.responseInterceptorCatcher)) {
          const errorResult = await this.responseInterceptorCatcher(
            opt,
            error,
            error.response as AxiosResponse<AnyResult> | undefined
          )
          const __responseTime = new Date().getTime()
          const res = { ...errorResult, __requestTime, __responseTime }
          resolve(res)
        } else {
          reject(error)
        }
      }
      // 注册canceltoken
      const CancelToken = axios.CancelToken
      const source = CancelToken.source()
      // 请求实例
      this.instance
        .request({
          url: opt.url,
          data: opt.data,
          headers: opt.headers,
          timeout: opt.timeout,
          method: opt.method,
          responseType: opt.responseType,
          onUploadProgress: opt.onUploadProgress,
          cancelToken: source.token
        })
        .then(requestSuccess)
        .catch(requestFail)
      // 注册终止函数
      const cancelFunction = () => {
        source?.cancel()
        aborted = true
        const time = new Date().toLocaleTimeString()
        console.warn("请求被终止", opt.apiInfo, time, { request: opt })
        const __responseTime = new Date().getTime()
        resolve({
          __error: "请求终止",
          __requestOptions: opt,
          __requestTime,
          __responseTime
        })
      }
      this.createRequest(opt.url, cancelFunction, multipleGuid)
    })
    const response = await requestPromise
    return response
  }

  get<T extends AnyResult> (options: RequestOptions) {
    const opt = cloneDeep(options)
    Reflect.set(opt, "method", "GET")
    return this.request<T>(opt)
  }

  post<T extends AnyResult> (options: RequestOptions) {
    const opt = cloneDeep(options)
    Reflect.set(opt, "method", "POST")
    return this.request<T>(opt)
  }
}
