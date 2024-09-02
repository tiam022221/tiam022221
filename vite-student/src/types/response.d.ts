/* eslint-disable no-use-before-define */

declare type long = string;

declare type double = string;

declare type bigdecimal = string;

declare interface JsonResult<T = unknown> {
  code: number;
  data: T;
  errorData: string;
  message: string;
}

declare interface BasePageResponse<T = unknown> {
  pageIndex: string;
  pageSize: string;
  result: T[];
  totalCount: string;
  totalPageCount: string;
}

declare interface BasePageRequest<T = unknown> {
  orderField?: string;
  pageIndex: string;
  pageSize: string;
  requestParams: T;
  /** 排序方式 false:desc true:asc */
  sortType?: boolean;
}

declare type List<T = unknown> = T[];

declare interface GetCart {
  name: string;
}
