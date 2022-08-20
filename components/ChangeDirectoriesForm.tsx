const ChangeDirectoriesForm = ({ fromDir, toDir }: { fromDir?: string; toDir?: string }) => (
  <form action="." method="get">
    <table>
      <tbody>
        <tr>
          <th style={{ textAlign: 'right' }}>from</th>
          <td>
            <input name="from" defaultValue={fromDir} style={{ width: '800px' }} />
          </td>
        </tr>
        <tr>
          <th style={{ textAlign: 'right' }}>to</th>
          <td>
            <input name="to" defaultValue={toDir} style={{ width: '800px' }} />
          </td>
        </tr>
        <tr>
          <td></td>
          <td style={{ textAlign: 'right' }}>
            <input type="submit" value="Change Directories" />
          </td>
        </tr>
      </tbody>
    </table>
  </form>
)

export default ChangeDirectoriesForm
