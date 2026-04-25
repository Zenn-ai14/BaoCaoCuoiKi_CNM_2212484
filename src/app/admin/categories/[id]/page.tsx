import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { editCategory } from '@/lib/actions/admin'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (!category) {
    notFound()
  }

  // Chúng ta sử dụng Server Action trực tiếp với .bind
  const updateAction = editCategory.bind(null, id)

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Chỉnh Sửa Danh Mục</h1>
        <Link href="/admin/categories">
          <Button variant="outline">Hủy</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin danh mục</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateAction} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Tên danh mục</Label>
              <Input id="name" name="name" defaultValue={category.name} required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slug">Slug (Đường dẫn)</Label>
              <Input id="slug" name="slug" defaultValue={category.slug} required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Mô tả</Label>
              <textarea
                id="description"
                name="description"
                defaultValue={category.description || ''}
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
