import useSWR from 'swr'
import ReactDiffViewer from 'react-diff-viewer'
import { OldNewDatas } from '../pages/api/read-files'

type Props = { oldFile?: string; newFile?: string }

const DiffViewer = ({ oldFile, newFile }: Props) => {
  const { data, error } = useSWR<OldNewDatas>(['/api/read-files', oldFile, newFile], async (url, oldFile, newFile) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldFilePath: oldFile, newFilePath: newFile }),
    })
    if (!res.ok) {
      console.error('error')
      const e = await res.json()
      console.error(e)
      throw new Error(e.errorMessage)
    }
    return res.json()
  })

  if (error) return <div>failed to load: {JSON.stringify(error)}</div>
  if (!data) return <div>loading...</div>

  return <ReactDiffViewer oldValue={data?.oldFile} newValue={data?.newFile} splitView={true} />
}

export default DiffViewer
