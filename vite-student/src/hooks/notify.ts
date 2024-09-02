import { Notification } from "@arco-design/web-vue"
import "@arco-design/web-vue/es/notification/style/css"
import type {
  NotificationConfig,
  NotificationReturn
} from "@arco-design/web-vue"
import { guidGenerator } from "@/utils/guid"

const defaultConfig = {
  closable: true
} as Partial<NotificationConfig>

/** 实体集 */
const notifyList: {
  id: string
  type: "info" | "success" | "warning" | "error"
  options: Partial<NotificationConfig>
  instance: NotificationReturn
}[] = []

const removeNotify = (id: string) => {
  const index = notifyList.findIndex((item) => item.id === id)
  if (index === -1) return
  notifyList.splice(index, 1)
}

const getOpt = (options: Partial<NotificationConfig> | string) => {
  if (typeof options === "string") {
    return { ...defaultConfig, content: options }
  } else {
    return { ...defaultConfig, ...options }
  }
}

const notify = (options: Partial<NotificationConfig> | string) => {
  const id = guidGenerator()
  const onClose = (id: string) => {
    removeNotify(id)
  }
  const opt = { ...getOpt(options), id, onClose } as NotificationConfig
  const instance = Notification.info(opt)
  notifyList.push({ id, type: "info", options: opt, instance })
  return instance
}

notify.success = (options: Partial<NotificationConfig> | string) => {
  const id = guidGenerator()
  const onClose = (id: string) => {
    removeNotify(id)
  }
  const opt = { ...getOpt(options), id, onClose } as NotificationConfig
  const instance = Notification.success(opt)
  notifyList.push({ id, type: "success", options: opt, instance })
  return instance
}

notify.error = (options: Partial<NotificationConfig> | string) => {
  const id = guidGenerator()
  const onClose = (id: string) => {
    removeNotify(id)
  }
  const opt = { ...getOpt(options), id, onClose } as NotificationConfig
  const instance = Notification.error(opt)
  notifyList.push({ id, type: "error", options: opt, instance })
  return instance
}

notify.info = (options: Partial<NotificationConfig> | string) => {
  const id = guidGenerator()
  const onClose = (id: string) => {
    removeNotify(id)
  }
  const opt = { ...getOpt(options), id, onClose } as NotificationConfig
  const instance = Notification.info(opt)
  notifyList.push({ id, type: "info", options: opt, instance })
  return instance
}

notify.warning = (options: Partial<NotificationConfig> | string) => {
  const id = guidGenerator()
  const onClose = (id: string) => {
    removeNotify(id)
  }
  const opt = { ...getOpt(options), id, onClose } as NotificationConfig
  const instance = Notification.warning(opt)
  notifyList.push({ id, type: "warning", options: opt, instance })
  return instance
}

/** 全部关闭 */
const closeAll = () => {
  for (let i = notifyList.length - 1; i >= 0; i -= 1) {
    const item = notifyList.splice(i, 1)
    item[0].instance.close()
  }
}

/** 关闭警告 */
const closeAllWarning = () => {
  for (let i = notifyList.length - 1; i >= 0; i -= 1) {
    if (notifyList[i].type !== "warning") continue
    const item = notifyList.splice(i, 1)
    item[0].instance.close()
  }
}
/** 关闭info */
const closeAllInfo = () => {
  for (let i = notifyList.length - 1; i >= 0; i -= 1) {
    if (notifyList[i].type !== "info") continue
    const item = notifyList.splice(i, 1)
    item[0].instance.close()
  }
}
notify.closeAll = closeAll
notify.closeAllWarning = closeAllWarning
notify.closeAllInfo = closeAllInfo

export default notify
