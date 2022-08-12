import useSWR from 'swr'
import ReactDiffViewer from 'react-diff-viewer'
import { OldNewDatas } from '../pages/api/read-files'

type Props = { oldFile: string; newFile: string }

const Diff = ({ oldFile, newFile }: Props) => {
  const { data, error } = useSWR<OldNewDatas>(['/api/read-files', oldFile, newFile], async (url, oldFile, newFile) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldFilePath: oldFile, newFilePath: newFile }),
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
      <ReactDiffViewer oldValue={data?.oldFile} newValue={data?.newFile} splitView={true} />
    </>
  )
}

export default Diff
