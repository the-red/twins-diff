import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import ListFiles from '../components/ListFiles'
import path from 'path'

const FilesListPage = () => {
  const router = useRouter()
  const { query } = router
  const oldDir = Array.isArray(query.oldDir) ? query.oldDir[0] : query.oldDir
  const newDir = Array.isArray(query.newDir) ? query.newDir[0] : query.newDir

  return (
    <Layout title="Files List">
      <h1>Files List</h1>

      <button
        onClick={() => {
          router.push(`?oldDir=${path.dirname(oldDir)}&newDir=${path.dirname(newDir)}`)
        }}
      >
        ⬆
      </button>

      <ListFiles oldDir={oldDir} newDir={newDir} />
    </Layout>
  )
}

export default FilesListPage
