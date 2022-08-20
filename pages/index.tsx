import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ChangeDirectoriesForm from '../components/ChangeDirectoriesForm'
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

      <ChangeDirectoriesForm fromDir={fromDir} toDir={toDir} />
      <div style={{ margin: '20px' }}></div>

      <hr />
      <ListFiles oldDir={fromDir} newDir={toDir} />
      <hr />
    </Layout>
  )
}

export default IndexPage
