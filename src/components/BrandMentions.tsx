import { useState, useRef, useEffect, useMemo } from 'react'
import { ArrowLeft, Video, MessageCircle, Heart, X, CheckCircle } from 'lucide-react'
import { generateBrandMentionPosts, brandMentionPosts } from '../data/brandMentions'
import type { BrandMentionPost } from '../data/brandMentions'
import { usePexelsVideos } from '../hooks/usePexelsVideos'

const DEFAULT_REQUEST_MESSAGE = `Hi! We loved your recent video! We'd love to put some paid media behind your video to boost its reach. By "linking" your organic post to our ads account, we can get your content in front of a much larger audience while officially partnering with you. Would you be open to this? If so, let us know and we can send over the next steps.`

interface BrandMentionsProps {
  onBack: () => void
}

/** Placeholder con altura fija para no romper el layout antes de cargar. */
function CardPlaceholder() {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden flex flex-col animate-pulse" style={{ minHeight: 420 }}>
      <div className="p-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="aspect-[9/16] max-h-64 bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-8 bg-gray-200 rounded w-full mt-2" />
      </div>
    </div>
  )
}

/** Solo renderiza el hijo cuando el elemento entra en viewport (lazy load). */
function LazyCard({
  children,
  fallback,
}: {
  children: React.ReactNode
  fallback: React.ReactNode
}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { rootMargin: '200px', threshold: 0.01 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="min-h-[420px]">
      {isVisible ? children : fallback}
    </div>
  )
}

function MentionCard({
  post,
  onSendRequest,
}: {
  post: BrandMentionPost
  onSendRequest: () => void
}) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white overflow-hidden flex flex-col h-full">
      <div className="p-3 flex items-center gap-3 flex-nowrap min-w-0">
        <img
          src={post.avatarUrl}
          alt=""
          className="w-10 h-10 rounded-full object-cover bg-gray-200 flex-shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.userName)}&size=80&background=dee2e6`
          }}
        />
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-gray-900 truncate">{post.userName}</span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-green-100 text-green-800 text-xs font-medium flex-shrink-0">
              <Video className="w-3.5 h-3.5" />
              {post.videoCount}
            </span>
          </div>
          <p className="text-sm text-gray-500 truncate">{post.handle}</p>
        </div>
      </div>

      <div className="relative aspect-[9/16] max-h-64 bg-gray-100">
        <video
          src={post.videoUrl}
          className="w-full h-full object-cover"
          controls
          playsInline
          poster={post.thumbnailUrl}
          preload="metadata"
        />
        <span className="absolute bottom-2 left-2 text-xs font-medium text-white drop-shadow bg-black/50 px-2 py-1 rounded pointer-events-none">
          {post.views}
        </span>
      </div>

      <div className="p-3 flex flex-col gap-2 flex-1">
        <p className="text-sm text-gray-700 line-clamp-2">{post.description}</p>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            {post.likes} Likes
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            {post.comments} Comments
          </span>
        </div>
        <button
          type="button"
          onClick={onSendRequest}
          className="mt-auto w-full py-2.5 bg-primary-200 hover:bg-primary-300 text-primary-600 text-sm font-semibold rounded-lg transition-colors"
        >
          Send request
        </button>
      </div>
    </article>
  )
}

function RequestPermissionDialog({
  post,
  sent,
  onClose,
  onSend,
}: {
  post: BrandMentionPost
  sent: boolean
  onClose: () => void
  onSend: (message: string) => void
}) {
  const [message, setMessage] = useState(DEFAULT_REQUEST_MESSAGE)

  const handleSend = () => {
    onSend(message)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        aria-hidden
        onClick={onClose}
      />
      <div
        className="relative flex w-full max-w-4xl max-h-[90vh] rounded-xl bg-white shadow-xl overflow-hidden"
        role="dialog"
        aria-labelledby="request-dialog-title"
      >
        {/* Izquierda: vídeo original */}
        <div className="flex-shrink-0 w-[min(40%,320px)] min-w-0 bg-gray-900 aspect-[9/16] max-h-[90vh]">
          <video
            src={post.videoUrl}
            poster={post.thumbnailUrl}
            className="w-full h-full object-cover"
            playsInline
            preload="metadata"
            controls
          />
        </div>

        {/* Derecha: cabecera + contenido */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-start gap-3 p-4 border-b border-gray-100 flex-shrink-0">
            <img
              src={post.avatarUrl}
              alt=""
              className="w-12 h-12 rounded-full object-cover bg-gray-200 flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.userName)}&size=96&background=dee2e6`
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{post.userName}</p>
              <p className="text-sm text-gray-500 truncate">{post.handle}</p>
              <h2 id="request-dialog-title" className="text-lg font-semibold text-gray-900 mt-1">
                Request permission
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 -m-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 flex-shrink-0"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 flex-1 flex flex-col min-h-0 overflow-auto">
            {sent ? (
              <>
                <div className="flex flex-col items-center text-center py-6 flex-1">
                  <CheckCircle className="w-14 h-14 text-emerald-500 mb-3" aria-hidden />
                  <p className="font-semibold text-gray-900 text-lg">Request sent!</p>
                  <p className="text-sm text-gray-600 mt-2">
                    We&apos;ve notified {post.userName}. You&apos;ll be alerted when they approve the link.
                  </p>
                  <img
                    src="/request-sent-illustration.png"
                    alt=""
                    className="w-32 h-auto mt-4 object-contain"
                    aria-hidden
                  />
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors flex-shrink-0"
                >
                  Done
                </button>
              </>
            ) : (
              <>
                <label htmlFor="request-message" className="sr-only">
                  Message
                </label>
                <textarea
                  id="request-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-y min-h-[140px] flex-1"
                  placeholder="Your message..."
                />
                <div className="flex gap-3 mt-4 flex-shrink-0">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 text-primary-600 hover:bg-primary-50 font-semibold rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSend}
                    className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Send
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function BrandMentions({ onBack }: BrandMentionsProps) {
  const { videos, loading, error } = usePexelsVideos('sport', 30)
  const posts = useMemo(
    () => (videos.length > 0 ? generateBrandMentionPosts(videos) : brandMentionPosts),
    [videos]
  )
  const [selectedPost, setSelectedPost] = useState<BrandMentionPost | null>(null)
  const [requestSent, setRequestSent] = useState(false)

  const openRequestDialog = (post: BrandMentionPost) => {
    setSelectedPost(post)
    setRequestSent(false)
  }

  const closeRequestDialog = () => {
    setSelectedPost(null)
    setRequestSent(false)
  }

  const handleRequestSent = () => {
    setRequestSent(true)
  }

  return (
    <div className="p-6 flex-1 min-w-0">
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="p-2 -ml-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">Brand mentions</h1>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <CardPlaceholder key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {posts.map((post) => (
            <LazyCard key={post.id} fallback={<CardPlaceholder />}>
              <MentionCard post={post} onSendRequest={() => openRequestDialog(post)} />
            </LazyCard>
          ))}
        </div>
      )}

      {selectedPost && (
        <RequestPermissionDialog
          post={selectedPost}
          sent={requestSent}
          onClose={closeRequestDialog}
          onSend={handleRequestSent}
        />
      )}
    </div>
  )
}
