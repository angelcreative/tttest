import { useState, useEffect } from 'react'
import { searchPexelsVideos } from '../api/pexels'

export interface PexelsVideoEntry {
  videoUrl: string
  thumbnailUrl: string
}

export function usePexelsVideos(
  query: string = 'sport',
  perPage: number = 20
): { videos: PexelsVideoEntry[]; loading: boolean; error: string | null } {
  const [videos, setVideos] = useState<PexelsVideoEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const apiKey = import.meta.env.VITE_PEXELS_API_KEY
    if (!apiKey || typeof apiKey !== 'string' || !apiKey.trim()) {
      setError('Missing VITE_PEXELS_API_KEY. Add it in .env (see .env.example).')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    searchPexelsVideos(apiKey, query, perPage)
      .then((list) => {
        setVideos(list)
        if (list.length === 0) {
          setError('No videos found. Try another query or check your API key.')
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : String(err))
        setVideos([])
      })
      .finally(() => setLoading(false))
  }, [query, perPage])

  return { videos, loading, error }
}
