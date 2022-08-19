import Link from 'next/link'
import Layout from '../components/Layout'
import Diff from '../components/Diff'
import { useRouter } from 'next/router'

const IndexPage = () => {
  const { query } = useRouter()
  const oldFile = Array.isArray(query.oldFile) ? query.oldFile[0] : query.oldFile
  const newFile = Array.isArray(query.newFile) ? query.newFile[0] : query.newFile

  return (
    <Layout title="React Diff Viewer Example">
      <h1>React Diff Viewer Example</h1>
      <Diff oldFile={oldFile} newFile={newFile} />
    </Layout>
  )
}

export default IndexPage
