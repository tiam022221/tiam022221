/// <reference types="vite/client" />
declare type long = string
declare type double = string

declare type RefIns<T> = Ref<InstanceType<T>>

declare module "*.vue" {
  import type { DefineComponent } from "vue"
  const component: DefineComponent
  export default component
}

declare module "*.module.scss" {
  const content: Record<string, unknown>
  export default content
}
