'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { submitReview } from '@/lib/actions/review'
import { Star } from 'lucide-react'

export default function ReviewForm({ bookId }: { bookId: string }) {
  const [rating, setRating] = useState(5)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    const formData = new FormData(e.currentTarget)
    formData.append('rating', rating.toString())
    
    startTransition(async () => {
      try {
        await submitReview(bookId, formData)
        setSuccess(true)
        setRating(5)
        ;(e.target as HTMLFormElement).reset()
      } catch (err: any) {
        setError(err.message || 'Đã xảy ra lỗi.')
      }
    })
  }

  if (success) {
    return <div className="p-4 bg-green-50 text-green-700 rounded-lg">Cảm ơn bạn đã gửi đánh giá!</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Đánh giá của bạn</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="text-2xl focus:outline-none"
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
            >
              <Star
                className={`h-8 w-8 transition-colors ${
                  star <= (hoveredRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label htmlFor="comment" className="block text-sm font-medium mb-2">Nhận xét (Tùy chọn)</label>
        <textarea
          id="comment"
          name="comment"
          rows={3}
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Viết nhận xét của bạn về cuốn sách..."
        />
      </div>

      {error && <div className="text-sm text-red-500">{error}</div>}

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Đang gửi...' : 'Gửi đánh giá'}
      </Button>
    </form>
  )
}
