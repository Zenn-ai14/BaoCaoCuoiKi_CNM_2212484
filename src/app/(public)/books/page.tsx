import { createClient } from '@/lib/supabase/server'
import { Book, Category } from '@/types'
import { BookCard } from '@/components/books/BookCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, FilterX, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const revalidate = 60 // Revalidate every minute

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>
}) {
  const { q, category } = await searchParams
  const supabase = await createClient()

  // Fetch categories for sidebar
  const { data: categoriesData } = await supabase.from('categories').select('*').order('name')
  const categories: Category[] = categoriesData || []

  // Fetch books based on query
  let dbQuery = supabase.from('books').select('*, categories!inner(slug)')

  if (q) {
    dbQuery = dbQuery.ilike('title', `%${q}%`)
  }
  
  if (category) {
    dbQuery = dbQuery.eq('categories.slug', category)
  }

  const { data: booksData, error } = await dbQuery.order('created_at', { ascending: false })
  const books: Book[] = booksData || []

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
          <div>
            <h2 className="font-bold text-lg mb-4">Tìm kiếm</h2>
            <form action="/books" method="GET" className="flex gap-2">
              <Input 
                type="text" 
                name="q" 
                defaultValue={q} 
                placeholder="Tên sách..." 
                className="w-full"
              />
              {category && <input type="hidden" name="category" value={category} />}
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Danh mục</h2>
              {(q || category) && (
                <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-xs text-muted-foreground">
                  <Link href="/books">
                    <FilterX className="h-3 w-3 mr-1" />
                    Xóa lọc
                  </Link>
                </Button>
              )}
            </div>
            <ul className="space-y-2">
              <li>
                <Link 
                  href={`/books${q ? `?q=${q}` : ''}`}
                  className={`block px-3 py-2 rounded-md transition-colors ${!category ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'}`}
                >
                  Tất cả sách
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link 
                    href={`/books?category=${cat.slug}${q ? `&q=${q}` : ''}`}
                    className={`block px-3 py-2 rounded-md transition-colors ${category === cat.slug ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'}`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold">
              {q ? `Kết quả cho "${q}"` : category ? `Sách theo danh mục` : 'Tất cả sách'}
            </h1>
            <p className="text-muted-foreground">Hiển thị {books.length} kết quả</p>
          </div>

          {error ? (
             <div className="text-center py-12 text-red-500 bg-red-50 rounded-lg">
               <p>Đã xảy ra lỗi khi tải danh sách sách. Vui lòng thử lại sau.</p>
               <p className="text-sm mt-2">{error.message}</p>
             </div>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed flex flex-col items-center">
              <BookOpen className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">Không tìm thấy sách nào</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Rất tiếc, chúng tôi không tìm thấy quyển sách nào phù hợp với tiêu chí tìm kiếm của bạn.
              </p>
              <Button asChild>
                <Link href="/books">
                  Xem tất cả sách
                </Link>
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}