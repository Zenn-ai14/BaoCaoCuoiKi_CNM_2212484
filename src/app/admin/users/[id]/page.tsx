import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { editUserRole } from '@/lib/actions/admin'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()

  if (!user) {
    notFound()
  }

  const updateAction = editUserRole.bind(null, id)

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Chỉnh Sửa Người Dùng</h1>
        <Link href="/admin/users">
          <Button variant="outline">Hủy</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin tài khoản</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateAction} className="space-y-4">
            <div className="grid gap-2">
              <Label>Mã tài khoản (ID)</Label>
              <Input value={user.id} disabled />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="full_name">Tên hiển thị</Label>
              <Input id="full_name" name="full_name" defaultValue={user.full_name || ''} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Vai trò</Label>
              <select 
                id="role" 
                name="role"
                defaultValue={user.role}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="customer">Khách hàng (customer)</option>
                <option value="admin">Quản trị viên (admin)</option>
              </select>
            </div>

            <Button type="submit">Lưu thay đổi</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
