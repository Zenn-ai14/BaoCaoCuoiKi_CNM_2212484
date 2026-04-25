import { createClient } from '@/lib/supabase/server'
import { Book } from '@/types'
import { BookCard } from '@/components/books/BookCard'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen } from 'lucide-react'
import { HeroCarousel } from '@/components/common/HeroCarousel'
import { getLatestBooks } from '@/lib/actions/book'
import { getWishlistIds } from '@/lib/actions/wishlist'

export const revalidate = 3600 // Revalidate the page every hour

export default async function Home() {
  const supabase = await createClient()

  // Fetch wishlist IDs for the current user
  const wishlistIds = await getWishlistIds()

  // Fetch latest books for Carousel (limit 5)
  const carouselBooks = await getLatestBooks()

  // Fetch latest books
  const { data: latestBooks, error } = await supabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(8)

  const books: Book[] = latestBooks || []

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-8 md:py-12 container mx-auto px-4">
        {carouselBooks.length > 0 && <HeroCarousel books={carouselBooks} />}
      </section>

      {/* Latest Books Section */}
      <section className="py-16 md:py-24 container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Sách mới nổi bật</h2>
            <p className="text-muted-foreground">Những tựa sách mới nhất vừa được cập nhật.</p>
          </div>
          <Button asChild variant="ghost" className="hidden md:flex">
            <Link href="/books">
              Xem tất cả <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {error ? (
          <div className="text-center py-12 text-red-500">
            <p>Đã xảy ra lỗi khi tải danh sách sách.</p>
          </div>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard 
                key={book.id} 
                book={book} 
                isWishlistedInitial={wishlistIds.includes(book.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-1">Chưa có sách nào</h3>
            <p className="text-muted-foreground">Danh mục sách hiện đang trống. Hãy quay lại sau nhé!</p>
          </div>
        )}
        
        <div className="mt-8 text-center md:hidden">
          <Button asChild variant="outline" className="w-full">
            <Link href="/books">
              Xem tất cả sách
            </Link>
          </Button>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-primary/5 border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center p-6 bg-background rounded-xl shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Hàng ngàn tựa sách</h3>
              <p className="text-sm text-muted-foreground">Đa dạng thể loại từ văn học, kinh tế, đến kỹ năng sống và thiếu nhi.</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-background rounded-xl shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Mua sắm dễ dàng</h3>
              <p className="text-sm text-muted-foreground">Thêm vào giỏ hàng và thanh toán tiện lợi, nhanh chóng, bảo mật.</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-background rounded-xl shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Giao hàng toàn quốc</h3>
              <p className="text-sm text-muted-foreground">Hỗ trợ giao hàng đến mọi miền đất nước với mức phí ưu đãi.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}