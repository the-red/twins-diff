import path from 'path'

export const parentDirectory = ({
  from,
  to,
}: {
  from?: string
  to?: string
}): { href: string; icon: string; text: string } => {
  const href = from && to ? `/?from=${path.dirname(from)}&to=${path.dirname(to)}` : '#'
  const icon = '↩'
  const text = 'Parent Directory'

  return { href, icon, text }
}
