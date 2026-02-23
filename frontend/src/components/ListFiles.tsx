import { useState } from 'react'
import useSWR from 'swr'
import { Link } from 'react-router-dom'
import { FileDiffIcon, FileDirectoryFillIcon } from '@primer/octicons-react'
import { parentDirectory } from '../utils/parent-directory'
import { joinPath } from '../utils/join-path'

type FilesList = [string, 'dir' | 'file']
type FileEntry = {
  name: string
  oldType: 'dir' | 'file' | null
  newType: 'dir' | 'file' | null
  hasDiff: boolean
}
type ListFilesResponse = {
  oldFilesList: FilesList[]
  newFilesList: FilesList[]
  filesList: FileEntry[]
}

type FilterMode = 'all' | 'diff-only'

type Props = { oldDir?: string; newDir?: string }

const ListFiles = ({ oldDir, newDir }: Props) => {
  const [filterMode, setFilterMode] = useState<FilterMode>('all')

  const { data, error } = useSWR<ListFilesResponse>(['/api/list-files', oldDir, newDir], async ([url, oldDir, newDir]) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldDirPath: oldDir, newDirPath: newDir }),
    })
    if (!res.ok) {
      const e = await res.json()
      console.error('API error:', e)
      throw new Error(e.message || 'Unknown error')
    }
    return res.json()
  })

  if (error) return <div>failed to load: {JSON.stringify(error)}</div>
  if (!data) return <div>loading...</div>

  const { href, icon, text } = parentDirectory({ from: oldDir, to: newDir })

  // フィルタリング
  const filteredFiles = data.filesList.filter((entry) => {
    if (filterMode === 'all') return true
    return entry.hasDiff
  })

  return (
    <>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ marginRight: '16px' }}>
          <input
            type="radio"
            name="filter"
            value="all"
            checked={filterMode === 'all'}
            onChange={() => setFilterMode('all')}
          />
          {' '}Show All
        </label>
        <label>
          <input
            type="radio"
            name="filter"
            value="diff-only"
            checked={filterMode === 'diff-only'}
            onChange={() => setFilterMode('diff-only')}
          />
          {' '}Diff Only
        </label>
      </div>
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
              <a href={href}>{text}</a>
            </td>
            <td></td>
            <td></td>
          </tr>
          {filteredFiles.map((entry, i) => {
            const { name, oldType, newType, hasDiff } = entry
            const fromPath = oldDir ? joinPath(oldDir, name) : name
            const toPath = newDir ? joinPath(newDir, name) : name
            const query = `?from=${encodeURIComponent(fromPath)}&to=${encodeURIComponent(toPath)}`
            let fileName, fileIcon
            switch ([oldType, newType].join(',')) {
              case 'file,file':
                fileName = <Link to={`/diff${query}`}>{name}</Link>
                fileIcon = <FileDiffIcon size={16} />
                break
              case 'dir,dir':
                fileName = <a href={`/${query}`}>{name}</a>
                fileIcon = <FileDirectoryFillIcon size={16} fill="rgb(84, 174, 255)" />
                break
              default:
                fileName = name
                fileIcon = ''
            }
            return (
              <tr key={i} style={{ opacity: hasDiff ? 1 : 0.5 }}>
                <td>{fileIcon}</td>
                <td>{fileName}</td>
                <td>{oldType}</td>
                <td>{newType}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

export default ListFiles
