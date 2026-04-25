import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { Book } from '@/types'

export const revalidate = 0

export default async function AdminBooksPage() {
  const supabase = await createClient()

  // Lấy danh sách sách và tên danh mục
  const { data: booksData, error } = await supabase
    .from('books')
    .select('*, categories(name)')
    .order('created_at', { ascending: false })

  const books = booksData || []

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Quản lý Sách</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm sách mới
        </Button>
      </div>

      {error ? (
        <div className="text-red-500 bg-red-50 p-4 rounded-lg">Lỗi tải danh sách sách.</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Danh sách sản phẩm ({books.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground bg-muted/50 border-b">
                  <tr>
                    <th className="px-4 py-3 font-medium">Bìa</th>
                    <th className="px-4 py-3 font-medium">Tên sách</th>
                    <th className="px-4 py-3 font-medium">Tác giả</th>
                    <th className="px-4 py-3 font-medium">Danh mục</th>
                    <th className="px-4 py-3 font-medium">Giá</th>
                    <th className="px-4 py-3 font-medium">Tồn kho</th>
                    <th className="px-4 py-3 font-medium text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="w-10 h-14 bg-muted rounded overflow-hidden">
                          {book.cover_image_url && (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={book.cover_image_url} alt={book.title} className="w-full h-full object-cover" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium max-w-[200px] truncate">{book.title}</td>
                      <td className="px-4 py-3 text-muted-foreground">{book.author}</td>
                      <td className="px-4 py-3">{(book as any).categories?.name || 'Không có'}</td>
                      <td className="px-4 py-3 font-medium text-primary">{formatPrice(book.price)}</td>
                      <td className="px-4 py-3">{book.stock_quantity}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {books.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                        Chưa có sách nào trong cơ sở dữ liệu.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}