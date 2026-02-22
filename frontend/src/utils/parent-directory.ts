// path.dirname のブラウザ互換実装
const dirname = (filePath: string): string => {
  const lastSlash = filePath.lastIndexOf('/')
  if (lastSlash === -1) return '.'
  if (lastSlash === 0) return '/'
  return filePath.substring(0, lastSlash)
}

export const parentDirectory = ({
  from,
  to,
}: {
  from?: string
  to?: string
}): { href: string; icon: string; text: string } => {
  const href = from && to ? `/?from=${dirname(from)}&to=${dirname(to)}` : '#'
  const icon = '↩'
  const text = 'Parent Directory'

  return { href, icon, text }
}
