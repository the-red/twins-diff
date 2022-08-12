import Link from 'next/link'
import Layout from '../components/Layout'
import Diff from '../components/Diff'
import { useRouter } from 'next/router'

const IndexPage = () => {
  const { query } = useRouter()
  const oldFile = Array.isArray(query.oldfile) ? query.oldfile[0] : query.oldfile
  const newFile = Array.isArray(query.newfile) ? query.newfile[0] : query.newfile

  return (
    <Layout title="React Diff Viewer Example">
      <h1>React Diff Viewer Example</h1>
      <Diff oldFile={oldFile} newFile={newFile} />
    </Layout>
  )
}

export default IndexPage
