import type { NextPage } from 'next'
import Layout from '../components/Layout'
import DiffViewer from '../components/DiffViewer'
import { useRouter } from 'next/router'
import BackButton from '../components/BackButton'
import path from 'path'

const DetailPage: NextPage = () => {
  const { query } = useRouter()
  const oldFile = Array.isArray(query.from) ? query.from[0] : query.from
  const newFile = Array.isArray(query.to) ? query.to[0] : query.to

  const oldFileName = path.basename(oldFile ?? '')
  const newFileName = path.basename(newFile ?? '')
  const title = `Diff of ${oldFileName === newFileName ? oldFileName : `${oldFileName}↔${newFileName}`}`
  return (
    <Layout title={title} from={oldFile} to={newFile}>
      <BackButton from={oldFile} to={newFile} />
      <div style={{ margin: '20px' }}></div>
      <DiffViewer oldFile={oldFile} newFile={newFile} />
    </Layout>
  )
}

export default DetailPage
