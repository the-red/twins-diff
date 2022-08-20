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
      </tbody>
    </table>

    <input type="submit" value="Change Directories" />
  </form>
)

export default ChangeDirectoriesForm
