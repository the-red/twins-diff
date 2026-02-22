import { type ReactNode, useEffect } from 'react'
import ChangePathsForm from './ChangeDirectoriesForm'

type Props = {
  children?: ReactNode
  title?: string
  from?: string
  to?: string
}

const Layout = ({ children, title = 'twins-diff', from, to }: Props) => {
  useEffect(() => {
    document.title = title
  }, [title])

  return (
    <div>
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
}

export default Layout
