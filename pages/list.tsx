import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import ListFiles from '../components/ListFiles'

const FilesListPage = () => {
  const { query } = useRouter()
  const oldDir = Array.isArray(query.olddir) ? query.olddir[0] : query.olddir
  const newDir = Array.isArray(query.newdir) ? query.newdir[0] : query.newdir

  return (
    <Layout title="Files List">
      <h1>Files List</h1>
      <ListFiles oldDir={oldDir} newDir={newDir} />
    </Layout>
  )
}

export default FilesListPage
