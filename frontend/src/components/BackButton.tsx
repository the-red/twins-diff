import { parentDirectory } from '../utils/parent-directory'

type Props = { from?: string; to?: string; filter?: string }

const BackButton = ({ from, to, filter }: Props) => {
  const { href, icon, text } = parentDirectory({ from, to })
  const filterParam = filter ? `&filter=${filter}` : ''
  const fullHref = href + filterParam
  // aタグを使用してページリロードを確実に行う（SWRキャッシュ更新のため）
  return (
    <a href={fullHref}>
      {icon} {text}
    </a>
  )
}

export default BackButton
