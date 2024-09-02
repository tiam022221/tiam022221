import request from "@/utils/http";

/** 购物车查询 */
export const getCart = (
  data: {
    /** 购物车id */
    accountingId: long;
  },
  config?: RequestConfig,
) =>
  request.post<JsonResult<GetCart>>({
    apiInfo: "账单订单明细分页查询",
    url: "/cart",
    data,
    ...config,
  });
