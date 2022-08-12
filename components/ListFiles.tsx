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

  if (error) return <div>failed to load: {JSON.stringify(error.message)}</div>
  if (!data) return <div>loading...</div>

  const oldFilesSet = new Set(data.oldFilesList)
  const newFilesSet = new Set(data.newFilesList)
  const allFiles = Array.from(new Set([...oldFilesSet, ...newFilesSet]))

  return (
    <>
      <table style={{ border: '1px black solid' }}>
        <thead>
          <tr>
            <th>name</th>
            <th>old</th>
            <th>new</th>
          </tr>
        </thead>
        <tbody>
          {allFiles.map((file, i) => {
            return (
              <tr key={i}>
                <td>
                  {oldFilesSet.has(file) && newFilesSet.has(file) ? (
                    <a href={`/?oldfile=${oldDir}/${file}&newfile=${newDir}/${file}`}>{file}</a>
                  ) : (
                    { file }
                  )}
                </td>
                <td>{oldFilesSet.has(file).toString()}</td>
                <td>{newFilesSet.has(file).toString()}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

export default ListFiles
