'use client'

import { use, useTransition } from 'react'
import { updatePassword } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'
import { Lock, ShieldCheck, ArrowRight } from 'lucide-react'

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const params = use(searchParams)
  const message = params.message
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await updatePassword(formData)
    })
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-muted/20 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-primary/10 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[440px] space-y-8 bg-background p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-primary/5 border border-border/50 relative z-10"
      >
        <div className="text-center space-y-6">
          <div className="inline-flex p-4 rounded-3xl bg-primary/10 text-primary">
            <ShieldCheck className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight">Đặt lại mật khẩu</h1>
            <p className="text-muted-foreground font-medium text-sm">
              Sắp xong rồi! Hãy nhập mật khẩu mới cực kỳ an toàn cho tài khoản của bạn.
            </p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground flex items-center gap-1.5">
                <Lock className="h-3 w-3" /> Mật khẩu mới
              </Label>
              <div className="relative group">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="h-12 rounded-2xl bg-muted/30 border-border/50 focus:bg-background transition-all pl-10 font-medium"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground flex items-center gap-1.5">
                <Lock className="h-3 w-3" /> Xác nhận mật khẩu
              </Label>
              <div className="relative group">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="h-12 rounded-2xl bg-muted/30 border-border/50 focus:bg-background transition-all pl-10 font-medium"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
            </div>
          </div>
          
          {message && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold text-center">
              {message}
            </motion.div>
          )}

          <Button type="submit" className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-1 active:translate-y-0" disabled={isPending}>
            {isPending ? 'ĐANG LƯU...' : (
              <span className="flex items-center gap-2">
                CẬP NHẬT MẬT KHẨU <ArrowRight className="h-5 w-5" />
              </span>
            )}
          </Button>
        </form>

        <p className="text-[10px] text-center text-muted-foreground/60 leading-relaxed px-4">
          Gợi ý: Mật khẩu mạnh bao gồm chữ cái, chữ số và các ký tự đặc biệt như @, #, !
        </p>
      </motion.div>
    </div>
  )
}
