import { createWebHistory, type RouteRecordRaw, createRouter } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/index",
  },
  {
    path: "/main",
    name: "main-page",
    component: () => import("@/views/main/main.vue"),
    meta: [
      {
        title: "首页",
      },
    ],
    children: [
      {
        path: "/index",
        name: "index-page",
        component: () => import("@/views/index/index.vue"),
        meta: [{ title: "默认展示" }],
      },
    ],
  },
  {
    path: "/user",
    name: "user-page",
    component: () => import("@/views/user/user.vue"),
    meta: [{ title: "用户页" }],
  },
] as RouteRecordRaw[];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
