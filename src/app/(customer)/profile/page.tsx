'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { updateProfile } from '@/lib/actions/profile'
import { toast } from 'sonner'
import { useTransition, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ProfilePage() {
  const [isPending, startTransition] = useTransition()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (authUser) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single()
          
        if (userData) {
          setUser({ ...authUser, ...userData })
        }
      }
      setLoading(false)
    }
    
    loadUser()
  }, [])

  if (loading) {
    return <div className="container mx-auto px-4 py-12">Đang tải thông tin hồ sơ...</div>
  }

  if (!user) {
    return <div className="container mx-auto px-4 py-12">Vui lòng đăng nhập để xem trang này.</div>
  }

  const initials = user.full_name
    ? user.full_name.charAt(0).toUpperCase()
    : user.email.charAt(0).toUpperCase()

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await updateProfile(formData)
      if (result?.error) {
        toast.error('Lỗi', { description: result.error })
      } else {
        toast.success('Thành công', { description: 'Đã cập nhật thông tin hồ sơ' })
      }
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Hồ sơ cá nhân</h1>
      
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin chung</CardTitle>
            <CardDescription>Cập nhật thông tin cá nhân của bạn.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar_url || ''} alt={user.full_name || user.email} />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="font-medium leading-none">Ảnh đại diện</h3>
                <p className="text-sm text-muted-foreground">
                  Hiện tại dự án chưa hỗ trợ upload ảnh, ảnh này lấy từ Google/Github (nếu có).
                </p>
              </div>
            </div>
            
            <form id="profile-form" action={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email (Không thể thay đổi)</Label>
                <Input id="email" type="email" defaultValue={user.email} disabled />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fullName">Họ và tên</Label>
                <Input 
                  id="fullName" 
                  name="fullName" 
                  type="text" 
                  defaultValue={user.full_name || ''} 
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Vai trò</Label>
                <Input 
                  id="role" 
                  type="text" 
                  defaultValue={user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'} 
                  disabled 
                />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button type="submit" form="profile-form" disabled={isPending}>
              {isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}