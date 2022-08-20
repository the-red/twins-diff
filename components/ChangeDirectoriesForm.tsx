import { useRouter } from 'next/router'

const ChangePathsForm = ({ from, to }: { from?: string; to?: string }) => {
  const router = useRouter()

  return (
    <form action={router.pathname} method="get">
      <table>
        <tbody>
          <tr>
            <th style={{ textAlign: 'right' }}>from</th>
            <td>
              <input name="from" defaultValue={from} style={{ width: '800px' }} />
            </td>
          </tr>
          <tr>
            <th style={{ textAlign: 'right' }}>to</th>
            <td>
              <input name="to" defaultValue={to} style={{ width: '800px' }} />
            </td>
          </tr>
          <tr>
            <td></td>
            <td style={{ textAlign: 'right' }}>
              <input type="submit" value="Change Paths" />
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  )
}

export default ChangePathsForm
