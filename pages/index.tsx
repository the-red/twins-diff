import Link from 'next/link'
import Layout from '../components/Layout'
import Diff from '../components/Diff'

const IndexPage = () => (
  <Layout title="Home | Next.js + TypeScript Example">
    <h1>Hello Next.js 👋</h1>
    <p>
      <Link href="/about">
        <a>About</a>
      </Link>
    </p>
    <Diff />
  </Layout>
)

export default IndexPage
