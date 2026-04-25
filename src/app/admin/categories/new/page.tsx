'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { addCategory } from '@/lib/actions/admin'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NewCategoryPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      try {
        await addCategory(formData)
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
        <h1 className="text-3xl font-bold">Thêm Danh Mục Mới</h1>
        <Link href="/admin/categories">
          <Button variant="outline">Hủy</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin danh mục</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Tên danh mục</Label>
              <Input id="name" name="name" required placeholder="Ví dụ: Tiểu thuyết" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slug">Slug (Đường dẫn)</Label>
              <Input id="slug" name="slug" required placeholder="Ví dụ: tieu-thuyet" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Mô tả</Label>
              <textarea
                id="description"
                name="description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Mô tả về danh mục này..."
              />
            </div>

            {error && <div className="text-sm text-red-500">{error}</div>}

            <Button type="submit" disabled={isPending}>
              {isPending ? 'Đang lưu...' : 'Lưu danh mục'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
