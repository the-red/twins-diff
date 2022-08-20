import Link from 'next/link'
import { parentDirectory } from '../utils/parent-directory'

const BackButton = ({ from, to }: { from?: string; to?: string }) => {
  const { href, icon, text } = parentDirectory({ from, to })
  return (
    <Link href={href}>
      <a>
        {icon} {text}
      </a>
    </Link>
  )
}

export default BackButton
