import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import ListFiles from '../components/ListFiles'

const IndexPage: NextPage = () => {
  const router = useRouter()
  const { query } = router
  const oldDir = Array.isArray(query.from) ? query.from[0] : query.from
  const newDir = Array.isArray(query.to) ? query.to[0] : query.to

  return (
    <Layout title="Files List">
      <h1>Files List</h1>

      <table>
        <tbody>
          <tr>
            <th style={{ textAlign: 'right' }}>from</th>
            <td>{oldDir}</td>
          </tr>
          <tr>
            <th style={{ textAlign: 'right' }}>to</th>
            <td>{newDir}</td>
          </tr>
        </tbody>
      </table>

      <ListFiles oldDir={oldDir} newDir={newDir} />
    </Layout>
  )
}

export default IndexPage
