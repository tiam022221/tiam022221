import { Message } from "@arco-design/web-vue"
import "@arco-design/web-vue/es/message/style/css"
import type { RenderFunction } from "vue"
import type { MessageConfig, MessageReturn } from "@arco-design/web-vue"
import { guidGenerator } from "@/utils/guid"

/** 实体集 */
const messageList: {
  id: string
  type: "info" | "success" | "warning" | "error" | "loading"
  options: Partial<MessageConfig>
  instance: MessageReturn
}[] = []

const removeMessage = (id: string) => {
  const index = messageList.findIndex((item) => item.id === id)
  if (index === -1) return
  messageList.splice(index, 1)
}
const removeMessageByContent = (content: string | RenderFunction) => {
  const index = messageList.findIndex((item) => item.options.content === content)
  if (index === -1) return
  messageList[index].instance.close()
}

const closeTheSameMessage = (options: MessageConfig, type: string) => {
  for (let i = 0; i < messageList.length; i++) {
    const item = messageList[i]
    if (item.options.content !== options.content) continue
    if (item.type !== type) continue
    item.instance.close()
  }
}

const defaultConfig = {
  resetOnHover: true,
  closable: true
}

const getOpt = (options: MessageConfig | string) => {
  if (typeof options === "string") {
    return { content: options }
  } else {
    return options
  }
}
const message = (options: MessageConfig | string) => {
  const id = guidGenerator()
  const onClose = (id: string) => {
    removeMessage(id)
  }
  if (typeof options === "string") {
    removeMessageByContent(options)
  } else {
    removeMessageByContent(options.content)
  }
  const opt = { ...defaultConfig, ...getOpt(options), onClose } as MessageConfig
  closeTheSameMessage(opt, "info")
  const instance = Message.info(opt)
  messageList.push({ id, type: "info", options: opt, instance })
  return instance
}

message.success = (options: MessageConfig | string) => {
  const id = guidGenerator()
  const onClose = (id: string) => {
    removeMessage(id)
  }
  if (typeof options === "string") {
    removeMessageByContent(options)
  } else {
    removeMessageByContent(options.content)
  }
  const opt = { ...defaultConfig, ...getOpt(options), onClose } as MessageConfig
  closeTheSameMessage(opt, "success")
  const instance = Message.success(opt)
  messageList.push({ id, type: "success", options: opt, instance })
  return instance
}

message.error = (options: MessageConfig | string) => {
  const id = guidGenerator()
  const onClose = (id: string) => {
    removeMessage(id)
  }
  if (typeof options === "string") {
    removeMessageByContent(options)
  } else {
    removeMessageByContent(options.content)
  }
  const opt = { ...defaultConfig, ...getOpt(options), onClose } as MessageConfig
  closeTheSameMessage(opt, "error")
  const instance = Message.error(opt)
  messageList.push({ id, type: "error", options: opt, instance })
  return instance
}

message.warning = (options: MessageConfig | string) => {
  const id = guidGenerator()
  const onClose = (id: string) => {
    removeMessage(id)
  }
  if (typeof options === "string") {
    removeMessageByContent(options)
  } else {
    removeMessageByContent(options.content)
  }
  const opt = { ...defaultConfig, ...getOpt(options), onClose } as MessageConfig
  closeTheSameMessage(opt, "warning")
  const instance = Message.warning(opt)
  messageList.push({ id, type: "warning", options: opt, instance })
  return instance
}

message.info = (options: MessageConfig | string) => {
  const id = guidGenerator()
  const onClose = (id: string) => {
    removeMessage(id)
  }
  if (typeof options === "string") {
    removeMessageByContent(options)
  } else {
    removeMessageByContent(options.content)
  }
  const opt = { ...defaultConfig, ...getOpt(options), onClose } as MessageConfig
  closeTheSameMessage(opt, "info")
  const instance = Message.info(opt)
  messageList.push({ id, type: "info", options: opt, instance })
  return instance
}

message.loading = (options: MessageConfig | string) => {
  const id = guidGenerator()
  const onClose = (id: string) => {
    removeMessage(id)
  }
  if (typeof options === "string") {
    removeMessageByContent(options)
  } else {
    removeMessageByContent(options.content)
  }
  const opt = { ...defaultConfig, ...getOpt(options), onClose } as MessageConfig
  closeTheSameMessage(opt, "loading")
  const instance = Message.loading(opt)
  messageList.push({ id, type: "loading", options: opt, instance })
  return instance
}

message.clear = () => {
  return Message.clear()
}

export default message
