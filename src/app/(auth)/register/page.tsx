'use client'

import { use, useTransition } from 'react'
import { signup } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { BookOpen, Mail, Lock, ArrowRight, User, ShieldCheck, Sparkles } from 'lucide-react'

export default function RegisterPage({
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
        await signup(formData)
      } catch (error: any) {
        if (error.message === 'NEXT_REDIRECT') {
          throw error
        }
        console.error('Signup error:', error)
        toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau.')
      }
    })
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background">
      {/* Left Side: Branding (Visible on desktop) */}
      <div className="hidden md:flex md:w-1/2 bg-zinc-900 relative overflow-hidden items-center justify-center p-12 order-last md:order-first">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary rounded-full blur-[120px]" />
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
        </div>
        
        <div className="relative z-10 max-w-lg text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex p-5 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl"
          >
            <Sparkles className="h-12 w-12 text-primary" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            <h1 className="text-5xl lg:text-6xl font-black tracking-tight text-white">
              Gia nhập cộng đồng <span className="text-primary">BookShop</span>
            </h1>
            <p className="text-xl text-zinc-400 font-medium leading-relaxed">
              Tạo tài khoản để nhận ưu đãi đặc biệt, theo dõi đơn hàng và lưu lại những cuốn sách yêu thích.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="space-y-4 pt-8"
          >
            {[
              "Hàng ngàn đầu sách mới mỗi ngày",
              "Ưu đãi 10% cho đơn hàng đầu tiên",
              "Giao hàng siêu tốc trong 24h"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-zinc-300 justify-center">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span className="font-bold">{feature}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Side: Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-20 relative bg-muted/20 order-first md:order-last">
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
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[440px] space-y-10"
        >
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-4xl font-black tracking-tight">Đăng ký</h2>
            <p className="text-muted-foreground font-medium text-lg">Khởi đầu hành trình tri thức mới của bạn.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <input type="hidden" name="next" value={next} />
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground flex items-center gap-1.5">
                  <User className="h-3 w-3" /> Họ và tên đầy đủ
                </Label>
                <div className="relative group">
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    required
                    className="h-12 rounded-2xl bg-background border-border/50 focus:ring-primary/20 transition-all pl-10 font-bold"
                  />
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground flex items-center gap-1.5">
                  <Mail className="h-3 w-3" /> Địa chỉ Email
                </Label>
                <div className="relative group">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    className="h-12 rounded-2xl bg-background border-border/50 focus:ring-primary/20 transition-all pl-10 font-medium"
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground flex items-center gap-1.5">
                  <Lock className="h-3 w-3" /> Mật khẩu an toàn
                </Label>
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
                <p className="text-[10px] text-muted-foreground font-medium px-1">Tối thiểu 6 ký tự để bảo vệ tài khoản của bạn.</p>
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

            <div className="space-y-4 pt-4">
              <Button type="submit" className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1 active:translate-y-0 active:scale-[0.98]" disabled={isPending}>
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-4 border-2 border-white/30 border-t-white" />
                    ĐANG KHỞI TẠO...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 uppercase tracking-tight">
                    Tạo tài khoản ngay <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                )}
              </Button>
            </div>
          </form>

          <div className="space-y-6 pt-4">
            <p className="text-center text-sm font-medium text-muted-foreground">
              Đã là thành viên?{' '}
              <Link href={`/login${next !== '/' ? `?next=${next}` : ''}`} className="text-primary font-black hover:underline underline-offset-4">
                Đăng nhập tại đây
              </Link>
            </p>
            
            <p className="text-[10px] text-center text-muted-foreground/60 leading-relaxed px-8">
              Bằng việc đăng ký, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của chúng tôi.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
