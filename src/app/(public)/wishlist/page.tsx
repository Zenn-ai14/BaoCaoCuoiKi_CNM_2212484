import { getWishlist } from '@/lib/actions/wishlist'
import { BookCard } from '@/components/books/BookCard'
import { Heart, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const revalidate = 0 // Wishlist is highly dynamic

export default async function WishlistPage() {
  const books = await getWishlist()

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Page Header */}
      <div className="bg-background border-b pt-12 pb-10 mb-10">
        <div className="container mx-auto px-4 text-center md:text-left">
          <h1 className="text-4xl font-black tracking-tight flex items-center justify-center md:justify-start gap-4">
            Danh sách yêu thích <Heart className="text-rose-500 h-8 w-8 fill-rose-500" />
          </h1>
          <p className="text-muted-foreground mt-2 font-medium text-lg italic">
            Nơi lưu giữ những cuốn sách bạn hứa sẽ đọc
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {books.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-background rounded-[2.5rem] border border-dashed flex flex-col items-center shadow-sm">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-rose-500/5 blur-3xl rounded-full" />
              <div className="relative h-28 w-28 bg-rose-50 rounded-full flex items-center justify-center">
                <Heart className="h-12 w-12 text-rose-300" />
              </div>
            </div>
            <h3 className="text-2xl font-black mb-3 tracking-tight">Danh sách đang trống</h3>
            <p className="text-muted-foreground mb-10 max-w-md font-medium text-lg leading-relaxed px-4">
              Hãy thêm những cuốn sách bạn yêu thích vào đây để dễ dàng tìm lại và mua sắm sau này nhé.
            </p>
            <Button asChild size="lg" className="rounded-full h-14 px-10 text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40">
              <Link href="/books">
                Khám phá sách ngay
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
