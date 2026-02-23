import { Link } from 'react-router-dom'
import { parentDirectory } from '../utils/parent-directory'

type Props = { from?: string; to?: string; filter?: string }

const BackButton = ({ from, to, filter }: Props) => {
  const { href, icon, text } = parentDirectory({ from, to })
  const filterParam = filter ? `&filter=${filter}` : ''
  const fullHref = href + filterParam
  return (
    <Link to={fullHref}>
      {icon} {text}
    </Link>
  )
}

export default BackButton
