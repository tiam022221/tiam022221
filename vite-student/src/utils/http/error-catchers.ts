import type {
  RequestInterceptorCatcher,
  ResponseInterceptorCatcher,
  ErrorStatusCodeCatcher,
  ErrorApiCodeCatcher
} from "./types"
// import request from "./index"

/** 统一错误提示 */
const errorNotify = async (title: string, content: string) => {
  $notify.error({ title, content, duration: 5000 })
}

/** 请求错误捕获 */
export const requestInterceptorCatcher: RequestInterceptorCatcher = async (
  options,
  error
) => {
  switch (true) {
    case error.message === "登录失败":
      return {
        __error: "请求错误",
        __errMsg: "登录失败",
        __requestOptions: options
      }
    default:
      if (options.notifyRequestError !== false) {
        await errorNotify(`${options.apiInfo}失败`, "请求失败")
      }
      return {
        __error: "请求错误",
        __errMsg: error?.message,
        __requestOptions: options
      }
  }
}

/** 响应错误捕获 */
export const responseInterceptorCatcher: ResponseInterceptorCatcher = async (
  options,
  error,
  response
) => {
  let __errMsg
  let data = response?.data
  if (typeof data === "string") {
    try {
      const text = (data as unknown as string).replace(/[\r\n\s]/g, "").replace(/,}/g, "}")
      data = JSON.parse(text)
    } catch (err) {
      console.log("err", err)
    }
  }
  switch (true) {
    case /^timeout/.test(error?.message ?? ""):
      __errMsg = "请求超时"
      break
    case error?.message === "canceled":
      return { __error: "请求终止", __requestOptions: options }
    case data?.code === 403:
      __errMsg = "无权限访问"
      break
    case !options.noHandleError && (response?.status === 401 || data?.code === 401): {
      if (options.noRedirectLogin) {
        console.log("url", options.url)
        console.log("noRedirectLogin")
        return { __error: "请求终止", __requestOptions: options }
      }
      // const authStore = $store.auth()
      console.warn("401", options)
      // window.location.href = "/login"
      // await new Promise<void>(resolve => {
      //   authStore.showLoginPopover(resolve)
      // })
      // options.headers = undefined
      // const retryResult = await request.request(options)
      // return retryResult
      return
    }
    // case response?.status === 403:
    //   console.log("响应错误码", response?.status)
    //   __errMsg = "无权限访问"
    //   break
    default: {
      const statusCodeCatcherResult = await errorStatusCodeCatcher(
        options,
        response?.status ?? 400
      )
      if (statusCodeCatcherResult) return statusCodeCatcherResult
      __errMsg = "响应错误"
    }
  }
  if (options.notifyRequestError !== false) {
    await errorNotify(`${options.apiInfo}失败`, __errMsg)
  }
  return { __error: "响应错误", __errMsg, __requestOptions: options }
}

/** 异常请求状态码捕获 */
export const errorStatusCodeCatcher: ErrorStatusCodeCatcher = async (
  options,
  statusCode
) => {
  let __errMsg
  switch (true) {
    case statusCode === 200:
      return
    case statusCode === 400:
      return {
        __error: "响应错误",
        __errMsg: "请求错误",
        __status: statusCode,
        __requestOptions: options
      }
    case statusCode === 401:
      __errMsg = "无权限访问"
      break
    case statusCode === 403:
      __errMsg = "无权限访问"
      break
    case statusCode === 404:
      __errMsg = "访问地址不存在"
      break
    case statusCode === 405:
      __errMsg = "请求被禁止"
      break
    case statusCode === 408:
      __errMsg = "请求超时"
      break
    case statusCode === 500:
      __errMsg = "服务器内部错误"
      break
    case statusCode === 501:
      __errMsg = "服务器不支持请求功能"
      break
    case statusCode === 502:
      __errMsg = "网关请求失败"
      break
    case statusCode === 503:
      __errMsg = "服务器维护中"
      break
    case statusCode === 504:
      __errMsg = "未及时从远端服务器获取请求"
      break
    case statusCode === 505:
      __errMsg = "不支持请求的HTTP协议的版本"
      break
    default:
      __errMsg = ""
  }
  if (options.notifyResponseError !== false) {
    await errorNotify(`${options.apiInfo}失败`, __errMsg)
  }
  return {
    __error: "响应错误",
    __errMsg,
    __status: statusCode,
    __requestOptions: options
  }
}

/** 异常接口状态码捕获 */
export const errorApiCodeCatcher: ErrorApiCodeCatcher = async (
  options,
  result,
  response
) => {
  let __errMsg = ""

  switch (true) {
    case result?.code === 2000:
    case options?.notifyApiError === false:
    case result?.code && options?.ignoreApiCodes?.includes?.(result.code):
      return
    case result?.code === 5000:
      __errMsg = "服务器内部错误"
      break
    case (result?.message?.length ?? 51) < 50:
      __errMsg = result?.message ?? ""
      __errMsg += `\n${result?.errorData ?? ""}`
      __errMsg = __errMsg.trim()
      break
    case result?.code !== undefined:
      __errMsg = `错误状态码 - ${result?.code}`
      break
    default:
      __errMsg = ""
  }
  await errorNotify(`${options.apiInfo}失败`, __errMsg)
  return {
    __error: "接口错误",
    __errMsg,
    __status: response.status,
    __code: result?.code,
    __requestOptions: options
  }
}
