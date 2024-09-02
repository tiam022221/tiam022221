import { defineStore } from "pinia";
export default defineStore("auth", () => {
  /** 获取token */
  const getToken = () => {
    const accessToken = window.localStorage.getItem("accessToken");
    const tokenType = window.localStorage.getItem("tokenType");
    return accessToken && tokenType ? `${tokenType} ${accessToken}` : null;
  };
  /** 设置token */
  const setToken = (token: string) => {
    window.localStorage.setItem("accessToken", token);
    window.localStorage.setItem("tokenType", "Bearer");
  };
  /** 检查token是否有效 */
  const checkToken = () => {
    const accessToken = window.localStorage.getItem("accessToken");
    const tokenType = window.localStorage.getItem("tokenType");
    return !!accessToken && !!tokenType;
  };
  /** 清除token */
  const clearToken = () => {
    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("expiresTime");
    window.localStorage.removeItem("tokenType");
  };
  return {
    getToken,
    setToken,
    checkToken,
    clearToken,
  };
});
