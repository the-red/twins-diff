import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'

export type FilesList = [string, 'dir' | 'file']
export type OldNewFilesList = { oldFilesList: FilesList[]; newFilesList: FilesList[] }
type ErrorDatas = { statusCode: 500; message: string }

const getFilesList = (dirPath: string) =>
  fs.readdirSync(dirPath, { withFileTypes: true }).map((_): FilesList => [_.name, _.isDirectory() ? 'dir' : 'file'])

const handler = async (_req: NextApiRequest, res: NextApiResponse<OldNewFilesList | ErrorDatas>) => {
  try {
    const { oldDirPath, newDirPath } = _req.body

    const oldFilesList = getFilesList(oldDirPath)
    const newFilesList = getFilesList(newDirPath)

    res.status(200).json({ oldFilesList, newFilesList })
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default handler
