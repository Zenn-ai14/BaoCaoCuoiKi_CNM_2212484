import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { deleteUser } from '@/lib/actions/admin'

export const revalidate = 0

export default async function AdminUsersPage() {
  const supabase = await createClient()

  // Lấy danh sách người dùng
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
      dateStyle: 'medium',
    }).format(new Date(dateString))
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Quản lý Người dùng</h1>
      </div>

      {error ? (
        <div className="text-red-500 bg-red-50 p-4 rounded-lg">Lỗi tải danh sách người dùng.</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Thành viên hệ thống ({users?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground bg-muted/50 border-b">
                  <tr>
                    <th className="px-4 py-3 font-medium">Người dùng</th>
                    <th className="px-4 py-3 font-medium">Email (Auth ID)</th>
                    <th className="px-4 py-3 font-medium text-center">Vai trò</th>
                    <th className="px-4 py-3 font-medium">Ngày tham gia</th>
                    <th className="px-4 py-3 font-medium text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user) => {
                    const initials = user.full_name
                      ? user.full_name.charAt(0).toUpperCase()
                      : 'U'
                      
                    return (
                      <tr key={user.id} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar_url || ''} />
                              <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.full_name || 'Khách'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-mono text-xs text-muted-foreground line-clamp-1 max-w-[200px] hover:text-foreground" title={user.id}>
                            {user.id}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge 
                            variant={user.role === 'admin' ? 'default' : 'secondary'}
                            className={user.role === 'admin' ? 'bg-primary' : ''}
                          >
                            {user.role === 'admin' ? 'Admin' : 'Khách hàng'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{formatDate(user.created_at)}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/users/${user.id}`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <form action={deleteUser.bind(null, user.id)}>
                              <Button 
                                type="submit"
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                disabled={user.role === 'admin'}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
