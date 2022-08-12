import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'

export type OldNewDatas = { oldFile: string; newFile: string }
type ErrorDatas = { statusCode: 500; message: string }

const handler = (_req: NextApiRequest, res: NextApiResponse<OldNewDatas | ErrorDatas>) => {
  try {
    const oldFile = fs.readFileSync(_req.body.oldFilePath).toString()
    const newFile = fs.readFileSync(_req.body.newFilePath).toString()
    res.status(200).json({ oldFile, newFile })
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default handler
