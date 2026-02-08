/**
 * Pexels Video API – búsqueda de vídeos (sport, etc.).
 * Docs: https://www.pexels.com/api/documentation/#videos-search
 */

export interface PexelsVideoFile {
  id: number
  quality: 'hd' | 'sd'
  file_type: string
  width: number
  height: number
  link: string
}

export interface PexelsVideo {
  id: number
  width: number
  height: number
  url: string
  image: string
  duration: number
  video_files: PexelsVideoFile[]
  video_pictures: { id: number; picture: string; nr: number }[]
}

export interface PexelsVideoSearchResponse {
  page: number
  per_page: number
  total_results: number
  url: string
  videos: PexelsVideo[]
}

/** Extrae la URL MP4 preferida (sd o hd) de un vídeo Pexels. */
function pickVideoLink(video: PexelsVideo): string | null {
  const files = video.video_files.filter((f) => f.file_type === 'video/mp4')
  const hd = files.find((f) => f.quality === 'hd')
  const sd = files.find((f) => f.quality === 'sd')
  return (hd ?? sd ?? files[0])?.link ?? null
}

/** Thumbnail del vídeo (preview). */
function pickThumbnail(video: PexelsVideo): string {
  const pic = video.video_pictures?.[0]?.picture
  return pic ?? video.image
}

/**
 * Busca vídeos en Pexels y devuelve arrays de { videoUrl, thumbnailUrl }.
 */
export async function searchPexelsVideos(
  apiKey: string,
  query: string,
  perPage: number = 20
): Promise<{ videoUrl: string; thumbnailUrl: string }[]> {
  const url = new URL('https://api.pexels.com/videos/search')
  url.searchParams.set('query', query)
  url.searchParams.set('per_page', String(perPage))

  const res = await fetch(url.toString(), {
    headers: { Authorization: apiKey },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Pexels API error ${res.status}: ${text}`)
  }

  const data: PexelsVideoSearchResponse = await res.json()
  const result: { videoUrl: string; thumbnailUrl: string }[] = []

  for (const video of data.videos) {
    const link = pickVideoLink(video)
    if (link) {
      result.push({
        videoUrl: link,
        thumbnailUrl: pickThumbnail(video),
      })
    }
  }

  return result
}
