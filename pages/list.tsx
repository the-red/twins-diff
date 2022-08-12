import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import ListFiles from '../components/ListFiles'
import path from 'path'

const FilesListPage = () => {
  const router = useRouter()
  const { query } = router
  const oldDir = Array.isArray(query.olddir) ? query.olddir[0] : query.olddir
  const newDir = Array.isArray(query.newdir) ? query.newdir[0] : query.newdir

  return (
    <Layout title="Files List">
      <h1>Files List</h1>

      <button
        onClick={() => {
          router.push(`?olddir=${path.dirname(oldDir)}&newdir=${path.dirname(newDir)}`)
        }}
      >
        ⬆
      </button>

      <ListFiles oldDir={oldDir} newDir={newDir} />
    </Layout>
  )
}

export default FilesListPage
