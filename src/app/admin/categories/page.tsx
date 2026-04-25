import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, Edit, Trash2, FolderTree } from 'lucide-react'
import { Category } from '@/types'
import { deleteCategory } from '@/lib/actions/admin'
import { DeleteButton } from '@/components/admin/DeleteButton'

export const revalidate = 0

export default async function AdminCategoriesPage() {
  const supabase = await createClient()

  // Lấy danh sách danh mục và đếm số lượng sách thuộc danh mục đó
  const { data: categoriesData, error } = await supabase
    .from('categories')
    .select('*, books(count)')
    .order('name')

  const categories = categoriesData || []

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Quản lý Danh mục</h1>
        <Link href="/admin/categories/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm danh mục
          </Button>
        </Link>
      </div>

      {error ? (
        <div className="text-red-500 bg-red-50 p-4 rounded-lg">Lỗi tải danh mục.</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Danh sách danh mục ({categories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground bg-muted/50 border-b">
                  <tr>
                    <th className="px-4 py-3 font-medium w-16">Icon</th>
                    <th className="px-4 py-3 font-medium">Tên danh mục</th>
                    <th className="px-4 py-3 font-medium">Slug (Đường dẫn)</th>
                    <th className="px-4 py-3 font-medium">Mô tả</th>
                    <th className="px-4 py-3 font-medium text-center">Số lượng sách</th>
                    <th className="px-4 py-3 font-medium text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <FolderTree className="h-4 w-4" />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">{cat.name}</td>
                      <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{cat.slug}</td>
                      <td className="px-4 py-3 max-w-[300px] truncate text-muted-foreground">
                        {cat.description || 'Không có mô tả'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center justify-center bg-muted px-2 py-1 rounded-full text-xs font-medium">
                          {(cat as any).books?.[0]?.count || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/categories/${cat.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <DeleteButton action={deleteCategory.bind(null, cat.id)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        Chưa có danh mục nào.
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