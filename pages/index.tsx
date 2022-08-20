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

  const title = 'Index'
  return (
    <Layout title={title} from={fromDir} to={toDir}>
      <hr />
      <ListFiles oldDir={fromDir} newDir={toDir} />
      <hr />
    </Layout>
  )
}

export default IndexPage
