import { useRouter } from 'next/router'
import path from 'path'

const BackButton = ({ from, to }: { from?: string; to?: string }) => {
  const router = useRouter()

  return (
    <button
      onClick={() => {
        if (from && to) router.push(`list?from=${path.dirname(from)}&to=${path.dirname(to)}`)
      }}
    >
      ↩ Parent Directory
    </button>
  )
}

export default BackButton
