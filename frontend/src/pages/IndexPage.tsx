import { useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import ListFiles from '../components/ListFiles'
import BackButton from '../components/BackButton'

const IndexPage = () => {
  const [searchParams] = useSearchParams()

  const fromDir = searchParams.get('from') ?? undefined
  const toDir = searchParams.get('to') ?? undefined
  const filter = searchParams.get('filter') ?? undefined

  const title = 'Index'
  return (
    <Layout title={title} from={fromDir} to={toDir}>
      <BackButton from={fromDir} to={toDir} filter={filter} />
      <div style={{ margin: '20px' }}></div>
      <ListFiles oldDir={fromDir} newDir={toDir} />
    </Layout>
  )
}

export default IndexPage
