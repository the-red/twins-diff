import useSWR from 'swr'
import { OldNewFilesList } from '../pages/api/list-files'

type Props = { oldDir: string; newDir: string }

const ListFiles = ({ oldDir, newDir }: Props) => {
  const { data, error } = useSWR<OldNewFilesList>(['/api/list-files', oldDir, newDir], async (url, oldDir, newDir) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldDirPath: oldDir, newDirPath: newDir }),
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

  const oldFilesMap = new Map(data.oldFilesList)
  const newFilesMap = new Map(data.newFilesList)
  const allFiles = Array.from(new Set([...oldFilesMap.keys(), ...newFilesMap.keys()]))

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
                  {oldFilesMap.has(file) && newFilesMap.has(file) ? (
                    <a href={`/?oldFile=${oldDir}/${file}&newFile=${newDir}/${file}`}>{file}</a>
                  ) : (
                    file
                  )}
                </td>
                <td>{oldFilesMap.get(file)}</td>
                <td>{newFilesMap.get(file)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

export default ListFiles
