import { useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import ListFiles from '../components/ListFiles'

const IndexPage = () => {
  const [searchParams] = useSearchParams()

  const fromDir = searchParams.get('from') ?? undefined
  const toDir = searchParams.get('to') ?? undefined

  const title = 'Index'
  return (
    <Layout title={title} from={fromDir} to={toDir}>
      <ListFiles oldDir={fromDir} newDir={toDir} />
    </Layout>
  )
}

export default IndexPage
