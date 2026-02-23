// パスを結合し、二重スラッシュを除去
export const joinPath = (base: string, name: string): string => {
  // 末尾のスラッシュを除去してから結合
  const normalizedBase = base.replace(/\/+$/, '')
  return `${normalizedBase}/${name}`
}
