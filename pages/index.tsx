import Link from 'next/link'
import Layout from '../components/Layout'
import Diff from '../components/Diff'
import { useRouter } from 'next/router'

const IndexPage = () => {
  const { query } = useRouter()
  const oldFile = Array.isArray(query.from) ? query.from[0] : query.from
  const newFile = Array.isArray(query.to) ? query.to[0] : query.to

  return (
    <Layout title="React Diff Viewer Example">
      <h1>React Diff Viewer Example</h1>
      <Diff oldFile={oldFile} newFile={newFile} />
    </Layout>
  )
}

export default IndexPage
