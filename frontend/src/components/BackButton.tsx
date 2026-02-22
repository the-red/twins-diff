import { Link } from 'react-router-dom'
import { parentDirectory } from '../utils/parent-directory'

const BackButton = ({ from, to }: { from?: string; to?: string }) => {
  const { href, icon, text } = parentDirectory({ from, to })
  return (
    <Link to={href}>
      {icon} {text}
    </Link>
  )
}

export default BackButton
