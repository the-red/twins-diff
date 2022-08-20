import React, { ReactNode } from 'react'
import Head from 'next/head'
import ChangePathsForm from './ChangeDirectoriesForm'

type Props = {
  children?: ReactNode
  title?: string
  from?: string
  to?: string
}

const Layout = ({ children, title = 'This is the default title', from, to }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
      <nav></nav>
    </header>
    <h1>{title}</h1>

    <ChangePathsForm from={from} to={to} />
    <div style={{ margin: '20px' }}></div>

    {children}
    <footer></footer>
  </div>
)

export default Layout
