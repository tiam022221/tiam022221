/** 生成guid码 */
export const guidGenerator = (
  /** 带不带横杠 */
  dash = true
) => {
  let guid = ""
  for (let i = 1; i <= 32; i++) {
    guid += Math.floor(Math.random() * 16.0).toString(16)
    if (dash && [8, 12, 16, 20].includes(i)) guid += "-"
  }
  return guid
}
