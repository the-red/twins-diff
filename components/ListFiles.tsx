import useSWR from 'swr'
import { OldNewFilesList } from '../pages/api/list-files'

type Props = { oldDir?: string; newDir?: string }

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
  const fileNames = Array.from(new Set([...oldFilesMap.keys(), ...newFilesMap.keys()]))

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
          {fileNames.map((name, i) => {
            const oldFileType = oldFilesMap.get(name)
            const newFileType = newFilesMap.get(name)
            const query = `?from=${oldDir}/${name}&to=${newDir}/${name}`
            let fileName
            switch ([oldFileType, newFileType].join(',')) {
              case 'file,file':
                fileName = <a href={`/${query}`}>{name}</a>
                break
              case 'dir,dir':
                fileName = <a href={`${query}`}>{name}</a>
                break
              default:
                fileName = name
            }
            return (
              <tr key={i}>
                <td>{fileName}</td>
                <td>{oldFileType}</td>
                <td>{newFileType}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

export default ListFiles
