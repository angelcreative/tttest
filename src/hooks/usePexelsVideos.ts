import { useState, useEffect, useCallback } from 'react'
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
    searchPexelsVideos(apiKey, query, perPage, 1)
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

const PER_PAGE = 15

/** Hook con load more para el modal de detalle del creador. */
export function usePexelsVideosLoadMore(query: string = 'lifestyle') {
  const [videos, setVideos] = useState<PexelsVideoEntry[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    const apiKey = import.meta.env.VITE_PEXELS_API_KEY
    if (!apiKey || typeof apiKey !== 'string' || !apiKey.trim()) {
      setError('Missing VITE_PEXELS_API_KEY. Add it in .env (see .env.example).')
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    setPage(1)
    setHasMore(true)
    searchPexelsVideos(apiKey, query, PER_PAGE, 1)
      .then((list) => {
        setVideos(list)
        setHasMore(list.length >= PER_PAGE)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : String(err))
        setVideos([])
      })
      .finally(() => setLoading(false))
  }, [query])

  const loadMore = useCallback(() => {
    const apiKey = import.meta.env.VITE_PEXELS_API_KEY
    if (!apiKey || loadingMore || !hasMore) return
    const nextPage = page + 1
    setLoadingMore(true)
    searchPexelsVideos(apiKey, query, PER_PAGE, nextPage)
      .then((list) => {
        setVideos((prev) => [...prev, ...list])
        setHasMore(list.length >= PER_PAGE)
        setPage(nextPage)
      })
      .finally(() => setLoadingMore(false))
  }, [query, page, loadingMore, hasMore])

  return { videos, loading, error, loadMore, loadingMore, hasMore }
}
