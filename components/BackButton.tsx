import Link from 'next/link'
import path from 'path'

const BackButton = ({ from, to }: { from?: string; to?: string }) => {
  const href = from && to ? `list?from=${path.dirname(from)}&to=${path.dirname(to)}` : '#'
  return (
    <Link href={href}>
      <a>↩ Parent Directory</a>
    </Link>
  )
}

export default BackButton
