import Request from "./request";
import type {
  TransformRequestData,
  RequestInterceptor,
  ResponseInterceptor,
  TransformResponseData,
} from "./types";
import {
  requestInterceptorCatcher,
  responseInterceptorCatcher,
  errorApiCodeCatcher,
} from "./error-catchers";
import type { AxiosResponse } from "axios";
import { baseUrl } from "@/apis/config";
import { cloneDeep, isArray, isObject, isArrayBuffer } from "lodash-es";
import { isDownloadData } from "./utils";
// import Message from "@/hooks/message"
import stores from "@/stores";

const removeEmptyStrings = (data: unknown): unknown => {
  if (isArray(data)) {
    const list = data as unknown[];
    return list.map((item) => removeEmptyStrings(item));
  } else if (isObject(data)) {
    const object = {};
    const objectData = data as Record<string, unknown>;
    for (const key in objectData) {
      const item = removeEmptyStrings(objectData[key]);
      if (item === undefined) continue;
      Reflect.set(object, key, item);
    }
    return object;
  } else if (data === "") {
    return undefined;
  } else {
    return data;
  }
};

const getHeaders = (options: RequestOptions): Record<string, string> => {
  const contentType = options.contentType ?? "application/json";
  const token = stores.auth().getToken()
  switch (true) {
    case options.noNeedToken:
      return {
        "Content-Type": contentType,
        Accept: "*/*",
      };
    default:
      return {
        "Content-Type": contentType,
        Accept: "*/*",
        Authorization: token ?? ""
      };
  }
};

const downloadData = (blob: Blob, fileName: string) => {
  if (!blob) return;
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = url;
  link.download = fileName || new Date().getTime().toString();
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const transformRequestData: TransformRequestData = async (
  options: RequestOptions,
) => {
  const opt = cloneDeep(options);
  // 用于重试的参数，如果存在该项则无视任何处理，直接请求
  if (opt?.requestOptions) return opt.requestOptions;
  // GET请求 删除时间戳参数
  if (opt.method === "GET") {
    if (isObject(opt.data)) {
      Reflect.deleteProperty(opt.data, "_t");
    }
  }
  // 拼接params
  if (isObject(opt.params)) {
    for (const key in opt.params) {
      const sign = opt.url.includes("?") ? "&" : "?";
      const encodeKey = encodeURIComponent(key);
      const encodeValue = encodeURIComponent(opt.params[key]);
      opt.url += `${sign}${encodeKey}=${encodeValue}`;
    }
  }
  // 如果data是表单结构的，不做其他处理
  if (opt.data instanceof FormData) {
    if (opt.method === "GET") {
      // 添加时间戳
      const time = new Date().getTime();
      const sign = opt.url.includes("?") ? "&" : "?";
      opt.url += `${sign}_t=${time}`;
    }
    return opt;
  }
  // 如果是对象转表单结构的
  if (opt.contentType === "multipart/form-data") {
    if (isObject(opt.data)) {
      const data = opt.data as Record<string, unknown>;
      const formData = new FormData();
      for (const key in data) {
        const item = data[key] as string | Blob | string[] | Blob[];
        if (isArray(item)) {
          for (let i = 0; i < item.length; i += 1) {
            formData.append(key, item[i]);
          }
        } else {
          formData.append(key, item);
        }
      }
      opt.data = formData;
      return opt;
    }
  }
  // GET请求
  if (opt.method === "GET") {
    // 添加时间戳
    const time = new Date().getTime();
    const sign = opt.url.includes("?") ? "&" : "?";
    opt.url += `${sign}_t=${time}`;
  }
  // POST请求
  if (opt.method === "POST") {
    if (!opt.noTrunEmptyString) {
      const data = removeEmptyStrings(opt.data) as Record<string, unknown>;
      Reflect.set(opt, "data", data);
      return opt;
    } else {
      Reflect.set(opt, "data", opt.data);
      return opt;
    }
  }
  return opt;
};

const requestInterceptor: RequestInterceptor = async (
  options: RequestOptions,
) => {
  const opt = cloneDeep(options);
  if (options.headers) return opt;
  if (options.noNeedToken) {
    const headers = getHeaders(opt);
    Reflect.set(opt, "headers", headers);
    return opt;
  }
  const authStore = stores.auth();
  const tokenValid = authStore.checkToken();
  if (!tokenValid) {
    authStore.clearToken();
    // window.location.href = "/login";
  }
  // 设置请求header
  const headers = getHeaders(opt);
  Reflect.set(opt, "headers", headers);
  return opt;
};

const responseInterceptor: ResponseInterceptor = async (
  options: RequestOptions,
  result: Result<AnyResult>,
  response: AxiosResponse<AnyResult>,
) => {
  const data = {
    ...response.data,
    __requestOptions: options,
    __error: undefined,
  };

  if (isDownloadData(response)) return data as RegularResponseResult<AnyResult>;

  // 非常规接触到二进制数据，一般为下载接口报错
  let tempResult: Result<AnyResult> = result;
  let tempResponse: AxiosResponse<AnyResult> = response;
  if (isArrayBuffer(tempResponse.data)) {
    const enc = new TextDecoder("utf-8");
    const uint8 = new Uint8Array(tempResponse.data);
    tempResponse = JSON.parse(enc.decode(uint8));
    tempResult = { ...result, ...tempResponse } as Result<AnyResult>;
  }

  // 捕获接口错误
  const apiCodeError = await errorApiCodeCatcher(
    options,
    tempResult as RegularResponseResult<AnyResult>,
    tempResponse,
  );
  if (apiCodeError) return apiCodeError;

  return data as RegularResponseResult<AnyResult>;
};

const transformResponseData: TransformResponseData = async (
  options: RequestOptions,
  result: Result<AnyResult>,
  response: AxiosResponse<AnyResult>,
) => {
  const contentType = response?.headers?.["content-type"] ?? "";
  const contentDisposition = response?.headers?.["content-disposition"] ?? "";
  const matches = contentDisposition.match(/filename(=|\*=[^']*'')([^;=\n]+)/);
  let fileName = options.downloadFileName ?? "";
  if (!fileName && matches?.[2]) {
    fileName = decodeURIComponent(matches[2]);
  }

  if (/application\/octet-stream/.test(contentType)) {
    // 特殊地 swagger 导出文件接口获取是 undefined 即没有返回数据
    // 特殊捕获 响应类型 application/octet-stream 作为文件流标识
    const data = response.data as unknown as string;
    const blob = new Blob([data], { type: response.headers["content-type"] });
    downloadData(blob, fileName);
  } else if (/application\/x-zip-compressed/.test(contentType)) {
    const data = response.data as unknown as ArrayBuffer;
    const blob = new Blob([data], { type: response.headers["content-type"] });
    downloadData(blob, fileName);
  } else if (
    /application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet/.test(
      contentType,
    )
  ) {
    const data = response.data as unknown as ArrayBuffer;
    const blob = new Blob([data], { type: response.headers["content-type"] });
    downloadData(blob, fileName);
  }

  return result;
};

function createRequest() {
  const instanceOptions = {
    transformRequestData,
    requestInterceptor,
    requestInterceptorCatcher,
    responseInterceptor,
    responseInterceptorCatcher,
    transformResponseData,
  };
  const defaultOptions = {
    baseURL: baseUrl,
    timeout: 60 * 1000,
  };
  return new Request(instanceOptions, defaultOptions);
}

const requestInstance = createRequest();

export default requestInstance;
