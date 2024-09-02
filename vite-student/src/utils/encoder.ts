export const encode = (string: string | null | undefined) => {
  if (!string) return ""
  const encoder = new TextEncoder()
  const list = encoder.encode(string).reverse()
  const string2 = list.toString()
  const list2 = encoder.encode(string2)
  return list2.toString()
}

export const decode = (string: string | null | undefined) => {
  try {
    if (!string) return ""
    const decoder = new TextDecoder()
    const list = string.split(",").map(item => parseInt(item))
    const string2 = decoder.decode(new Uint8Array(list))
    const list2 = string2.split(",").map(item => parseInt(item)).reverse()
    return decoder.decode(new Uint8Array(list2))
  } catch {
    return ""
  }
}
