// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}
//https://replicate.com/stability-ai/stable-diffusion
const TOKEN = '3cd703c5e2bead4de03bec0ac1a8c02f35d26cea'
const API_URL = 'https://api.replicate.com/v1/predictions'
const API_VERSION =
  'a9758cbfbd5f3c2094457d996681af52552901775aa2d6dd0b17fd15df959bef'
const HEADERS = {
  Authorization: 'Token 3cd703c5e2bead4de03bec0ac1a8c02f35d26cea',
  'Content-Type': 'application/json'
}
export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    // handle kicking off creating a new image
    const payload = JSON.parse(req.body)
    console.log({ payload })
    if (!payload || !payload.prompt) {
      res.status(400).json({ message: 'missing prompt' })
    } else {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({
          version: API_VERSION,
          input: {
            prompt: payload.prompt
          }
        })
      })
      const data = await response.json()
      console.log({ data })
      if (response.ok) {
        res.status(201).json({ id: data.id })
      } else {
        res.status(500).json({ message: 'API is down' })
      }
    }
  } else {
    res.status(400).json({ message: 'method not supported' })
  }
}
