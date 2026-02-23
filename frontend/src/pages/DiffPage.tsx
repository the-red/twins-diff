import { useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import DiffViewer from '../components/DiffViewer'
import BackButton from '../components/BackButton'

// path.basename のブラウザ互換実装
const basename = (filePath: string): string => {
  const lastSlash = filePath.lastIndexOf('/')
  if (lastSlash === -1) return filePath
  return filePath.substring(lastSlash + 1)
}

const DiffPage = () => {
  const [searchParams] = useSearchParams()

  const oldFile = searchParams.get('from') ?? undefined
  const newFile = searchParams.get('to') ?? undefined
  const filter = searchParams.get('filter') ?? undefined

  const oldFileName = basename(oldFile ?? '')
  const newFileName = basename(newFile ?? '')
  const title = `Diff of ${oldFileName === newFileName ? oldFileName : `${oldFileName}↔${newFileName}`}`

  return (
    <Layout title={title} from={oldFile} to={newFile}>
      <BackButton from={oldFile} to={newFile} filter={filter} />
      <div style={{ margin: '20px' }}></div>
      <DiffViewer oldFile={oldFile} newFile={newFile} />
    </Layout>
  )
}

export default DiffPage
