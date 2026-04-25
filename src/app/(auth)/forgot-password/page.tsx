'use client'

import { use, useTransition } from 'react'
import { forgotPassword } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookOpen, Mail, ArrowRight, ChevronLeft, KeyRound } from 'lucide-react'

export default function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; success?: string }>
}) {
  const params = use(searchParams)
  const message = params.message
  const success = params.success
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await forgotPassword(formData)
    })
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-muted/20 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[440px] space-y-8 bg-background p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-primary/5 border border-border/50 relative z-10"
      >
        <div className="text-center space-y-6">
          <div className="inline-flex p-4 rounded-3xl bg-primary/10 text-primary">
            <KeyRound className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight">Quên mật khẩu?</h1>
            <p className="text-muted-foreground font-medium">
              Đừng lo lắng, chúng tôi sẽ gửi cho bạn liên kết để khôi phục quyền truy cập.
            </p>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground flex items-center gap-1.5">
              <Mail className="h-3 w-3" /> Địa chỉ Email đăng ký
            </Label>
            <div className="relative group">
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                className="h-12 rounded-2xl bg-muted/30 border-border/50 focus:bg-background transition-all pl-10 font-medium"
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
          </div>
          
          {message && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold">
              {message}
            </motion.div>
          )}

          {success && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold leading-relaxed text-center">
              {success}
            </motion.div>
          )}

          <Button type="submit" className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-1 active:translate-y-0" disabled={isPending}>
            {isPending ? 'ĐANG GỬI...' : 'GỬI LIÊN KẾT KHÔI PHỤC'}
          </Button>
        </form>

        <div className="text-center pt-2">
          <Link href="/login" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary transition-colors group">
            <ChevronLeft className="mr-1 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Quay lại trang đăng nhập
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
