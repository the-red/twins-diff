import useSWR from 'swr'
import { Link } from 'react-router-dom'
import { FileDiffIcon, FileDirectoryFillIcon } from '@primer/octicons-react'
import { parentDirectory } from '../utils/parent-directory'

type FilesList = [string, 'dir' | 'file']
type OldNewFilesList = { oldFilesList: FilesList[]; newFilesList: FilesList[] }

type Props = { oldDir?: string; newDir?: string }

const ListFiles = ({ oldDir, newDir }: Props) => {
  const { data, error } = useSWR<OldNewFilesList>(['/api/list-files', oldDir, newDir], async ([url, oldDir, newDir]) => {
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

  const { href, icon, text } = parentDirectory({ from: oldDir, to: newDir })

  return (
    <>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>name</th>
            <th>old</th>
            <th>new</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <span>{icon}</span>
            </td>
            <td>
              <Link to={href}>{text}</Link>
            </td>
            <td></td>
            <td></td>
          </tr>
          {fileNames.map((name, i) => {
            const oldFileType = oldFilesMap.get(name)
            const newFileType = newFilesMap.get(name)
            const query = `?from=${oldDir}/${name}&to=${newDir}/${name}`
            let fileName, fileIcon
            switch ([oldFileType, newFileType].join(',')) {
              case 'file,file':
                fileName = <Link to={`/diff${query}`}>{name}</Link>
                fileIcon = <FileDiffIcon size={16} />
                break
              case 'dir,dir':
                fileName = <Link to={`/${query}`}>{name}</Link>
                fileIcon = <FileDirectoryFillIcon size={16} fill="rgb(84, 174, 255)" />
                break
              default:
                fileName = name
                fileIcon = ''
            }
            return (
              <tr key={i}>
                <td>{fileIcon}</td>
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
