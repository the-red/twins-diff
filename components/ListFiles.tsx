import useSWR from 'swr'
import { FilesList } from '../pages/api/list-files'

type Props = { oldDir: string; newDir: string }

const ListFiles = ({ oldDir, newDir }: Props) => {
  const { data, error } = useSWR<FilesList>(['/api/list-files', oldDir, newDir], async (url, oldDir, newDir) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldDirPath: oldDir, newDirPath: newDir }),
    })
    if (!res.ok) {
      console.log('error')
      const { errorMessage } = await res.json()
      throw new Error(errorMessage)
    }
    const json = await res.json()
    return json
  })

  return (
    <>
      <pre>{JSON.stringify({ data }, null, 2)}</pre>
    </>
  )
}

export default ListFiles
