import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import ListFiles from '../components/ListFiles'

const IndexPage: NextPage = () => {
  const router = useRouter()

  const [fromDir, setFromDir] = useState<string | undefined>()
  const [toDir, setToDir] = useState<string | undefined>()

  useEffect(() => {
    const { query } = router

    if (router.isReady) {
      const fromDir = Array.isArray(query.from) ? query.from[0] : query.from
      const toDir = Array.isArray(query.to) ? query.to[0] : query.to

      if (fromDir && toDir) {
        setFromDir(fromDir)
        setToDir(toDir)
      }
    }
  }, [router])

  return (
    <Layout title="Files List">
      <h1>Files List</h1>

      <table>
        <tbody>
          <tr>
            <th style={{ textAlign: 'right' }}>from</th>
            <td>{fromDir}</td>
          </tr>
          <tr>
            <th style={{ textAlign: 'right' }}>to</th>
            <td>{toDir}</td>
          </tr>
        </tbody>
      </table>

      <hr />
      <ListFiles oldDir={fromDir} newDir={toDir} />
      <hr />
    </Layout>
  )
}

export default IndexPage
