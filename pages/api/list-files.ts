import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'

export type FilesList = { oldFilesList: string[]; newFilesList: string[] }
type ErrorDatas = { statusCode: 500; message: string }

const handler = async (_req: NextApiRequest, res: NextApiResponse<FilesList | ErrorDatas>) => {
  try {
    const oldFilesList = fs.readdirSync(_req.body.oldDirPath)
    const newFilesList = fs.readdirSync(_req.body.newDirPath)
    res.status(200).json({ oldFilesList, newFilesList })
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default handler
