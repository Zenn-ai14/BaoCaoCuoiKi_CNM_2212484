import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { editBook } from '@/lib/actions/admin'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [bookResponse, categoriesResponse] = await Promise.all([
    supabase.from('books').select('*').eq('id', id).single(),
    supabase.from('categories').select('id, name')
  ])

  const book = bookResponse.data
  const categories = categoriesResponse.data || []

  if (!book) {
    notFound()
  }

  const updateAction = editBook.bind(null, id)

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Chỉnh Sửa Sách</h1>
        <Link href="/admin/books">
          <Button variant="outline">Hủy</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin sách</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateAction} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Tên sách</Label>
              <Input id="title" name="title" defaultValue={book.title} required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="author">Tác giả</Label>
              <Input id="author" name="author" defaultValue={book.author} required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category_id">Danh mục</Label>
              <select 
                id="category_id" 
                name="category_id"
                defaultValue={book.category_id || ''}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Giá (VND)</Label>
                <Input id="price" name="price" type="number" min="0" defaultValue={book.price} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock_quantity">Số lượng tồn kho</Label>
                <Input id="stock_quantity" name="stock_quantity" type="number" min="0" defaultValue={book.stock_quantity} required />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cover_image_url">URL Ảnh Bìa</Label>
              <Input id="cover_image_url" name="cover_image_url" defaultValue={book.cover_image_url || ''} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Mô tả sách</Label>
              <textarea
                id="description"
                name="description"
                defaultValue={book.description || ''}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <Button type="submit">Lưu thay đổi</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
