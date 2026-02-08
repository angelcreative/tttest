/**
 * Reusable preview panel with placeholder grid (e.g. creator cards).
 */
export function PreviewPanel() {
  const placeholders = Array.from({ length: 12 }, (_, i) => i)

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 h-full min-h-[280px]">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Preview</h3>
      <div className="grid grid-cols-3 gap-3">
        {placeholders.map((i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-gray-300" />
            <div className="w-full space-y-1">
              <div className="h-2 bg-gray-200 rounded w-full" />
              <div className="h-2 bg-gray-200 rounded w-3/4" />
              <div className="h-2 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
