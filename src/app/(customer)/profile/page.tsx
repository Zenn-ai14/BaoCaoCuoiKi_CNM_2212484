'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { updateProfile, updateContactInfo, updatePasswordInProfile } from '@/lib/actions/profile'
import { logout } from '@/lib/actions/auth'
import { toast } from 'sonner'
import { useTransition, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Mail, 
  Shield, 
  Camera, 
  Save, 
  Settings, 
  History, 
  MapPin, 
  Calendar,
  ChevronRight,
  LogOut,
  Lock,
  Phone
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function ProfilePage() {
  const [isPending, startTransition] = useTransition()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({ orders: 0, reviews: 0 })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('info')

  useEffect(() => {
    async function loadUserData() {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (authUser) {
        // Fetch user details from public.users
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single()
          
        // Fetch stats
        const [ordersRes, reviewsRes] = await Promise.all([
          supabase.from('orders').select('id', { count: 'exact', head: true }).eq('user_id', authUser.id),
          supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('user_id', authUser.id)
        ])

        if (userData) {
          setUser({ ...authUser, ...userData })
        }
        setStats({
          orders: ordersRes.count || 0,
          reviews: reviewsRes.count || 0
        })
      }
      setLoading(false)
    }
    
    loadUserData()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground font-medium">Đang tải thông tin hồ sơ...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <User className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-20" />
          <h1 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h1>
          <p className="text-muted-foreground mb-8">Bạn cần đăng nhập để quản lý hồ sơ cá nhân.</p>
          <Button asChild className="rounded-full px-8">
            <Link href="/login">Đăng nhập ngay</Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  const initials = user.full_name
    ? user.full_name.charAt(0).toUpperCase()
    : user.email.charAt(0).toUpperCase()

  const handleUpdateProfile = (formData: FormData) => {
    startTransition(async () => {
      const result = await updateProfile(formData)
      if (result?.error) {
        toast.error('Lỗi', { description: result.error })
      } else {
        toast.success('Thành công', { description: 'Đã cập nhật tên hiển thị' })
        setUser({ ...user, full_name: formData.get('fullName') })
      }
    })
  }

  const handleUpdateContact = (formData: FormData) => {
    startTransition(async () => {
      const result = await updateContactInfo(formData)
      if (result?.error) {
        toast.error('Lỗi', { description: result.error })
      } else {
        toast.success('Thành công', { description: 'Đã cập nhật thông tin liên hệ' })
        setUser({ 
          ...user, 
          phone: formData.get('phone'), 
          address: formData.get('address') 
        })
      }
    })
  }

  const handleUpdatePassword = (formData: FormData) => {
    startTransition(async () => {
      const result = await updatePasswordInProfile(formData)
      if (result?.error) {
        toast.error('Lỗi', { description: result.error })
      } else {
        toast.success('Thành công', { description: 'Mật khẩu đã được thay đổi' })
        // Clear form
        const form = document.getElementById('password-form') as HTMLFormElement
        form?.reset()
      }
    })
  }

  const handleLogout = async () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      await logout()
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Profile Header Background */}
      <div className="h-48 md:h-64 bg-zinc-900 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"></div>
        <div className="absolute -bottom-16 left-0 right-0">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              <div className="relative group">
                <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-xl">
                  <AvatarImage src={user.avatar_url || ''} alt={user.full_name || user.email} />
                  <AvatarFallback className="text-4xl font-black bg-muted">{initials}</AvatarFallback>
                </Avatar>
                <button className="absolute bottom-2 right-2 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform md:opacity-0 md:group-hover:opacity-100">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="text-center md:text-left mb-2 space-y-1">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white md:text-zinc-900 dark:md:text-white">
                    {user.full_name || 'Thành viên mới'}
                  </h1>
                  <Badge className="bg-primary/20 text-primary border-none font-bold px-3 py-1">
                    {user.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
                  </Badge>
                </div>
                <p className="text-zinc-400 md:text-muted-foreground font-medium flex items-center justify-center md:justify-start gap-2">
                  <Mail className="h-4 w-4" /> {user.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-[2.5rem] border shadow-sm overflow-hidden bg-background">
              <div className="p-4 space-y-1">
                <button 
                  onClick={() => setActiveTab('info')}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-2xl transition-all font-bold text-sm",
                    activeTab === 'info' ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-muted"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5" />
                    <span>Thông tin cá nhân</span>
                  </div>
                  <ChevronRight className={cn("h-4 w-4 transition-transform", activeTab === 'info' && "rotate-90")} />
                </button>
                
                <button 
                  onClick={() => setActiveTab('address')}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-2xl transition-all font-bold text-sm",
                    activeTab === 'address' ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-muted"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5" />
                    <span>Sổ địa chỉ</span>
                  </div>
                  <ChevronRight className={cn("h-4 w-4 transition-transform", activeTab === 'address' && "rotate-90")} />
                </button>

                <button 
                  onClick={() => setActiveTab('security')}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-2xl transition-all font-bold text-sm",
                    activeTab === 'security' ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-muted"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5" />
                    <span>Bảo mật</span>
                  </div>
                  <ChevronRight className={cn("h-4 w-4 transition-transform", activeTab === 'security' && "rotate-90")} />
                </button>

                <Link href="/orders" className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-muted transition-all font-bold text-sm">
                  <div className="flex items-center gap-3">
                    <History className="h-5 w-5" />
                    <span>Lịch sử đơn hàng</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Link>

                <div className="h-[1px] bg-border my-2 mx-2"></div>

                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-rose-50 hover:text-rose-600 transition-all font-bold text-sm text-muted-foreground"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="h-5 w-5" />
                    <span>Đăng xuất</span>
                  </div>
                </button>
              </div>
            </Card>

            {/* Dynamic Stats Card */}
            <Card className="rounded-[2.5rem] border shadow-sm bg-background p-8">
              <h3 className="font-black text-lg mb-6 tracking-tight">Thống kê hoạt động</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 rounded-2xl bg-muted/50 group hover:bg-primary/5 transition-colors">
                  <p className="text-3xl font-black text-primary transition-transform group-hover:scale-110">{stats.orders}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Đơn hàng</p>
                </div>
                <div className="p-4 rounded-2xl bg-muted/50 group hover:bg-primary/5 transition-colors">
                  <p className="text-3xl font-black text-primary transition-transform group-hover:scale-110">{stats.reviews}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Đánh giá</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {/* Tab: Personal Info */}
              {activeTab === 'info' && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="rounded-[2.5rem] border shadow-sm overflow-hidden bg-background">
                    <div className="p-8 md:p-10">
                      <div className="flex items-center gap-3 mb-10">
                        <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                          <User className="h-6 w-6" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black tracking-tight">Thông tin cá nhân</h2>
                          <p className="text-sm font-medium text-muted-foreground">Quản lý tên hiển thị và vai trò của bạn</p>
                        </div>
                      </div>

                      <form action={handleUpdateProfile} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="fullName" className="text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground flex items-center gap-1.5">
                              Họ và tên đầy đủ *
                            </Label>
                            <Input 
                              key={`fullName-${user.id}`}
                              id="fullName" 
                              name="fullName" 
                              type="text" 
                              defaultValue={user.full_name || ''} 
                              required 
                              className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all font-bold"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground flex items-center gap-1.5">
                              <Calendar className="h-3 w-3" /> Ngày tham gia
                            </Label>
                            <div className="h-12 flex items-center px-4 rounded-xl bg-muted/30 border border-border/50 text-sm font-bold text-muted-foreground">
                              {new Date(user.created_at).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                          </div>
                        </div>

                        <div className="pt-4">
                          <Button 
                            type="submit" 
                            disabled={isPending}
                            className="w-full sm:w-auto h-12 px-8 rounded-full font-black shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 active:translate-y-0"
                          >
                            {isPending ? "ĐANG LƯU..." : "LƯU TÊN HIỂN THỊ"}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Tab: Address & Contact */}
              {activeTab === 'address' && (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="rounded-[2.5rem] border shadow-sm overflow-hidden bg-background">
                    <div className="p-8 md:p-10">
                      <div className="flex items-center gap-3 mb-10">
                        <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                          <MapPin className="h-6 w-6" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black tracking-tight">Thông tin liên hệ</h2>
                          <p className="text-sm font-medium text-muted-foreground">Địa chỉ và số điện thoại nhận hàng mặc định</p>
                        </div>
                      </div>

                      <form action={handleUpdateContact} className="space-y-8">
                        <div className="grid grid-cols-1 gap-8">
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground flex items-center gap-1.5">
                              <Phone className="h-3 w-3" /> Số điện thoại
                            </Label>
                            <Input 
                              key={`phone-${user.id}`}
                              id="phone" 
                              name="phone" 
                              type="tel" 
                              defaultValue={user.phone || ''} 
                              placeholder="09xx xxx xxx"
                              className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all font-bold"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="address" className="text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground flex items-center gap-1.5">
                              <MapPin className="h-3 w-3" /> Địa chỉ giao hàng chi tiết
                            </Label>
                            <Input 
                              key={`address-${user.id}`}
                              id="address" 
                              name="address" 
                              type="text" 
                              defaultValue={user.address || ''} 
                              placeholder="Số nhà, tên đường, phường/xã..."
                              className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all font-bold"
                            />
                          </div>
                        </div>

                        <div className="pt-4">
                          <Button 
                            type="submit" 
                            disabled={isPending}
                            className="w-full sm:w-auto h-12 px-8 rounded-full font-black shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 active:translate-y-0"
                          >
                            {isPending ? "ĐANG LƯU..." : "CẬP NHẬT ĐỊA CHỈ"}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Tab: Security */}
              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="rounded-[2.5rem] border shadow-sm overflow-hidden bg-background">
                    <div className="p-8 md:p-10">
                      <div className="flex items-center gap-3 mb-10">
                        <div className="p-2.5 bg-rose-100 rounded-xl text-rose-600">
                          <Shield className="h-6 w-6" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black tracking-tight">Bảo mật tài khoản</h2>
                          <p className="text-sm font-medium text-muted-foreground">Thay đổi mật khẩu đăng nhập</p>
                        </div>
                      </div>

                      <form id="password-form" action={handleUpdatePassword} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground">
                              Mật khẩu mới
                            </Label>
                            <Input 
                              id="password" 
                              name="password" 
                              type="password" 
                              required 
                              className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all font-bold"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground">
                              Xác nhận mật khẩu mới
                            </Label>
                            <Input 
                              id="confirmPassword" 
                              name="confirmPassword" 
                              type="password" 
                              required 
                              className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all font-bold"
                            />
                          </div>
                        </div>

                        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                          <p className="text-xs text-amber-700 font-medium leading-relaxed">
                            <strong>Lưu ý:</strong> Sau khi đổi mật khẩu thành công, bạn vẫn sẽ tiếp tục phiên đăng nhập hiện tại. Hãy ghi nhớ mật khẩu mới cho lần đăng nhập sau.
                          </p>
                        </div>

                        <div className="pt-4">
                          <Button 
                            type="submit" 
                            disabled={isPending}
                            className="w-full sm:w-auto h-12 px-8 rounded-full font-black shadow-lg shadow-rose-200 transition-all hover:-translate-y-1 active:translate-y-0 bg-rose-600 hover:bg-rose-700 text-white border-none"
                          >
                            {isPending ? "ĐANG XỬ LÝ..." : "ĐỔI MẬT KHẨU"}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  )
}