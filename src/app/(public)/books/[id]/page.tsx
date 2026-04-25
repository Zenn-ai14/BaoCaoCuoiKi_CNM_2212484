import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, ShoppingCart, User } from 'lucide-react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReviewForm from './ReviewForm'
import AddToCartButton from './AddToCartButton'

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Lấy chi tiết sách
  const { data: book, error } = await supabase
    .from('books')
    .select('*, categories(name)')
    .eq('id', id)
    .single()

  if (error || !book) {
    notFound()
  }

  // Lấy danh sách đánh giá
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, users(full_name, avatar_url)')
    .eq('book_id', id)
    .order('created_at', { ascending: false })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
      dateStyle: 'medium',
    }).format(new Date(dateString))
  }

  // Lấy User hiện tại để kiểm tra đã đăng nhập chưa
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl">
      <div className="mb-6">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          &larr; Quay lại trang chủ
        </Link>
      </div>

      {/* Chi tiết sách */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-muted rounded-lg overflow-hidden aspect-[3/4] max-w-md mx-auto w-full relative shadow-md">
          {book.cover_image_url ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={book.cover_image_url} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Không có ảnh bìa
            </div>
          )}
        </div>

        <div className="space-y-6 flex flex-col justify-center">
          <div>
            {book.categories && (
              <Badge variant="secondary" className="mb-2">
                {(book as any).categories.name}
              </Badge>
            )}
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{book.title}</h1>
            <p className="text-xl text-muted-foreground">Tác giả: {book.author}</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${star <= Math.round(book.average_rating || 0) ? 'fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({book.average_rating || 0} / 5) - {reviews?.length || 0} đánh giá
            </span>
          </div>

          <div className="text-3xl font-bold text-primary">
            {formatPrice(book.price)}
          </div>

          <div className="prose prose-sm max-w-none text-muted-foreground">
            <p>{book.description || 'Chưa có mô tả cho cuốn sách này.'}</p>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t">
            <span className="text-sm">
              Tình trạng: <strong className={book.stock_quantity > 0 ? "text-green-600" : "text-red-600"}>
                {book.stock_quantity > 0 ? `Còn hàng (${book.stock_quantity})` : 'Hết hàng'}
              </strong>
            </span>
          </div>

          <div className="flex gap-4">
            <AddToCartButton book={book as any} />
          </div>
        </div>
      </div>

      {/* Khu vực đánh giá */}
      <div className="mt-16 space-y-8">
        <h2 className="text-2xl font-bold border-b pb-4">Đánh giá từ độc giả</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-4">Gửi đánh giá của bạn</h3>
                {user ? (
                  <ReviewForm bookId={book.id} />
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">Bạn cần đăng nhập để đánh giá.</p>
                    <Link href={`/login?next=/books/${book.id}`} className="text-primary hover:underline font-medium">
                      Đăng nhập ngay
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            {reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="bg-card p-6 rounded-lg border">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        {review.users?.avatar_url ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={review.users.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{review.users?.full_name || 'Khách'}</div>
                        <div className="text-xs text-muted-foreground">{formatDate(review.created_at)}</div>
                      </div>
                    </div>
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${star <= review.rating ? 'fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm whitespace-pre-line">
                    {review.comment || <i className="text-gray-400">Không có nhận xét.</i>}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                <p className="text-muted-foreground">Chưa có đánh giá nào cho cuốn sách này.<br/>Hãy là người đầu tiên!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
