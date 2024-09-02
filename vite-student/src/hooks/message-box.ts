import { Modal } from "@arco-design/web-vue"
import "@arco-design/web-vue/es/modal/style/css"
import type { ModalConfig, ModalReturn } from "@arco-design/web-vue"
import { guidGenerator } from "@/utils/guid"

/** 实体集 */
const messageList: {
  id: string
  instance: ModalReturn
}[] = []

const removeMessageBox = (id: string) => {
  const index = messageList.findIndex((item) => item.id === id)
  if (index === -1) return
  messageList.splice(index, 1)
}

const defaultConfig: Partial<ModalConfig> = {
  titleAlign: "center",
  hideCancel: false
}

const getOpt = (options: ModalConfig | string) => {
  if (typeof options === "string") {
    return { title: " ", content: options }
  }
  return options
}

const messageBox = (options: ModalConfig | string) => {
  return new Promise<string>((resolve) => {
    const id = guidGenerator()
    const onClose = (id: string) => {
      resolve("close")
      removeMessageBox(id)
    }
    const instance = Modal.confirm({
      ...defaultConfig,
      ...getOpt(options),
      onOk: () => resolve("confirm"),
      onCancel: () => resolve("cancel"),
      onClose: () => onClose(id)
    })
    messageList.push({ id, instance })
  })
}

messageBox.success = (options: ModalConfig | string) => {
  return new Promise<string>((resolve) => {
    const id = guidGenerator()
    const onClose = (id: string) => {
      resolve("close")
      removeMessageBox(id)
    }
    const instance = Modal.success({
      ...defaultConfig,
      ...getOpt(options),
      onOk: () => resolve("confirm"),
      onCancel: () => resolve("cancel"),
      onClose: () => onClose(id)
    })
    messageList.push({ id, instance })
  })
}

messageBox.info = (options: ModalConfig | string) => {
  return new Promise<string>((resolve) => {
    const id = guidGenerator()
    const onClose = (id: string) => {
      resolve("close")
      removeMessageBox(id)
    }
    const instance = Modal.info({
      ...defaultConfig,
      ...getOpt(options),
      onOk: () => resolve("confirm"),
      onCancel: () => resolve("cancel"),
      onClose: () => onClose(id)
    })
    messageList.push({ id, instance })
  })
}

messageBox.warning = (options: ModalConfig | string) => {
  return new Promise<string>((resolve) => {
    const id = guidGenerator()
    const onClose = (id: string) => {
      resolve("close")
      removeMessageBox(id)
    }
    const instance = Modal.warning({
      ...defaultConfig,
      ...getOpt(options),
      onOk: () => resolve("confirm"),
      onCancel: () => resolve("cancel"),
      onClose: () => onClose(id)
    })
    messageList.push({ id, instance })
  })
}

messageBox.error = (options: ModalConfig | string) => {
  return new Promise<string>((resolve) => {
    const id = guidGenerator()
    const onClose = (id: string) => {
      resolve("close")
      removeMessageBox(id)
    }
    const instance = Modal.error({
      ...defaultConfig,
      ...getOpt(options),
      onOk: () => resolve("confirm"),
      onCancel: () => resolve("cancel"),
      onClose: () => onClose(id)
    })
    messageList.push({ id, instance })
  })
}

messageBox.closeAll = () => {
  for (const item of messageList) {
    item.instance.close()
  }
}

export default messageBox
