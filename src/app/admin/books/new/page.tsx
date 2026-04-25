'use client'

import { useState, useTransition, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { addBook } from '@/lib/actions/admin'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function NewBookPage() {
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<{id: string, name: string}[]>([])
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const fetchCategories = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('categories').select('id, name')
      if (data) setCategories(data)
    }
    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      try {
        await addBook(formData)
      } catch (err: any) {
        if (err.message === 'NEXT_REDIRECT') {
          // allow redirect
        } else {
          setError(err.message || 'Có lỗi xảy ra')
        }
      }
    })
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Thêm Sách Mới</h1>
        <Link href="/admin/books">
          <Button variant="outline">Hủy</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin sách</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Tên sách</Label>
              <Input id="title" name="title" required placeholder="Nhập tên sách" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="author">Tác giả</Label>
              <Input id="author" name="author" required placeholder="Nhập tên tác giả" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category_id">Danh mục</Label>
              <select 
                id="category_id" 
                name="category_id"
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
                <Input id="price" name="price" type="number" min="0" required placeholder="Ví dụ: 100000" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock_quantity">Số lượng tồn kho</Label>
                <Input id="stock_quantity" name="stock_quantity" type="number" min="0" required placeholder="Ví dụ: 100" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cover_image_url">URL Ảnh Bìa</Label>
              <Input id="cover_image_url" name="cover_image_url" placeholder="https://example.com/image.jpg" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Mô tả sách</Label>
              <textarea
                id="description"
                name="description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Nội dung tóm tắt..."
              />
            </div>

            {error && <div className="text-sm text-red-500">{error}</div>}

            <Button type="submit" disabled={isPending}>
              {isPending ? 'Đang lưu...' : 'Lưu sách'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
