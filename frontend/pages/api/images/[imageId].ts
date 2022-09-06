// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

type Data = {
  name: string
}

const supabaseUrl = 'https://dunmkplqjsgkibzsgelx.supabase.co'
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bm1rcGxxanNna2lienNnZWx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjIyNjU3MTQsImV4cCI6MTk3Nzg0MTcxNH0.uDqafCQGu-SG6lyIU3tG1ITvfKhvyzUhVvSZ80-hcOg'
const supabase = createClient(supabaseUrl, supabaseKey)

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
  if (req.method === 'PUT') {
    const { imageId } = req.query

    const payload = JSON.parse(req.body)
    console.log({ imageId, imageUrl: payload.imageUrl })
    const { data, error } = await supabase
      .from('artwork')
      .update({ image_url: payload.imageUrl })
      .eq('image_id', imageId)
    res.status(204)
    return
  }
  if (req.method === 'GET') {
    // handle kicking off creating a new image
    const { imageId } = req.query
    if (!imageId) {
    } else {
      const response = await fetch(API_URL + `/${imageId}`, {
        method: 'GET',
        headers: HEADERS
      })
      const data = await response.json()
      if (response.ok) {
        res.status(201).json({
          id: data.id,
          output:
            data && data.output && data.output.length > 0
              ? data.output[0]
              : null,
          duration: data.metrics.predict_time
        })
      } else {
        res.status(500).json({ message: 'API is down' })
      }
    }
  } else {
    res.status(400).json({ message: 'method not supported' })
  }
}
