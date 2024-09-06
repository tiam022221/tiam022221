import request from "@/utils/http";

/** 购物车查询 */
export const getCart = (data: {}, config?: RequestConfig) =>
  request.get<JsonResult<GetCart>>({
    apiInfo: "账单订单明细分页查询",
    url: "/cart",
    data,
    ...config,
  });
