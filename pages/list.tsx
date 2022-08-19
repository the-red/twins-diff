import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import ListFiles from '../components/ListFiles'
import BackButton from '../components/BackButton'

const FilesListPage = () => {
  const router = useRouter()
  const { query } = router
  const oldDir = Array.isArray(query.from) ? query.from[0] : query.from
  const newDir = Array.isArray(query.to) ? query.to[0] : query.to

  return (
    <Layout title="Files List">
      <h1>Files List</h1>
      <BackButton from={oldDir} to={newDir} />
      <ListFiles oldDir={oldDir} newDir={newDir} />
    </Layout>
  )
}

export default FilesListPage
