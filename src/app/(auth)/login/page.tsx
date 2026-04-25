'use client'

import { use, useTransition } from 'react'
import { login } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { BookOpen, Mail, Lock, ArrowRight, User } from 'lucide-react'

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; next?: string }>
}) {
  const params = use(searchParams)
  const message = params.message
  const next = params.next || '/'
  const [isPending, startTransition] = useTransition()
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        await login(formData)
      } catch (error: any) {
        if (error.message === 'NEXT_REDIRECT') {
          throw error
        }
        console.error('Login error:', error)
        toast.error('Đã xảy ra lỗi. Vui lòng kiểm tra thông tin đăng nhập.')
      }
    })
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background">
      {/* Left Side: Illustration & Branding (Hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-zinc-900 relative overflow-hidden items-center justify-center p-12">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
        </div>
        
        <div className="relative z-10 max-w-lg text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex p-4 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl"
          >
            <BookOpen className="h-12 w-12 text-primary" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            <h1 className="text-5xl lg:text-6xl font-black tracking-tight text-white">
              Chào mừng trở lại với <span className="text-primary">BookShop</span>
            </h1>
            <p className="text-xl text-zinc-400 font-medium leading-relaxed">
              Tiếp tục hành trình khám phá kho tàng tri thức vô tận và quản lý giỏ hàng của bạn.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="grid grid-cols-3 gap-8 pt-8"
          >
            <div className="text-center">
              <p className="text-3xl font-black text-white">10k+</p>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Đầu sách</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-white">5k+</p>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Bạn đọc</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-white">24/7</p>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Hỗ trợ</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-20 relative bg-muted/20">
        {/* Mobile Logo */}
        <div className="absolute top-8 left-8 md:hidden">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight">BookShop</span>
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[440px] space-y-10"
        >
          <div className="space-y-2">
            <h2 className="text-4xl font-black tracking-tight">Đăng nhập</h2>
            <p className="text-muted-foreground font-medium">Nhập thông tin tài khoản để bắt đầu mua sắm ngay.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="next" value={next} />
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground flex items-center gap-1.5">
                  <Mail className="h-3 w-3" /> Địa chỉ Email
                </Label>
                <div className="relative group">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    className="h-12 rounded-2xl bg-background border-border/50 focus:ring-primary/20 transition-all pl-10 font-medium"
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <Lock className="h-3 w-3" /> Mật khẩu
                  </Label>
                  <Link href="/forgot-password" size="sm" className="text-xs font-bold text-primary hover:underline">
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative group">
                  <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    required 
                    placeholder="••••••••"
                    className="h-12 rounded-2xl bg-background border-border/50 focus:ring-primary/20 transition-all pl-10 font-medium"
                  />
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
              </div>
            </div>

            {message && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold flex items-center gap-3"
              >
                <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                {message}
              </motion.div>
            )}

            <div className="space-y-4 pt-2">
              <Button type="submit" className="w-full h-12 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]" disabled={isPending}>
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                    ĐANG XỬ LÝ...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    ĐĂNG NHẬP <ArrowRight className="h-5 w-5" />
                  </span>
                )}
              </Button>
            </div>
          </form>

          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/60" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-muted px-4 text-muted-foreground font-bold tracking-widest">Hoặc đăng nhập bằng</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-12 rounded-2xl font-bold border-border/50 bg-background hover:bg-muted transition-all">
                Google
              </Button>
              <Button variant="outline" className="h-12 rounded-2xl font-bold border-border/50 bg-background hover:bg-muted transition-all">
                Github
              </Button>
            </div>

            <p className="text-center text-sm font-medium text-muted-foreground">
              Bạn chưa có tài khoản?{' '}
              <Link href={`/register${next !== '/' ? `?next=${next}` : ''}`} className="text-primary font-black hover:underline underline-offset-4">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
