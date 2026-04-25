'use client'

import { useCartStore } from '@/lib/store/cart'
import { createOrder } from '@/lib/actions/order'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  ChevronLeft, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  User, 
  NotebookPen, 
  CheckCircle2, 
  Wallet,
  ArrowRight
} from 'lucide-react'

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart, getTotalItems } = useCartStore()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank'>('cod')

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground font-medium">Đang chuẩn bị thông tin thanh toán...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[70vh] text-center">
        <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-6" />
        <h1 className="text-3xl font-extrabold mb-4 tracking-tight">Không tìm thấy đơn hàng</h1>
        <p className="text-muted-foreground mb-8 max-w-md text-lg">
          Giỏ hàng của bạn đang trống, vui lòng chọn sản phẩm trước khi thanh toán.
        </p>
        <Button asChild size="lg" className="rounded-full px-8 font-bold">
          <Link href="/books">Quay lại cửa hàng</Link>
        </Button>
      </div>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  const handleCheckout = (formData: FormData) => {
    startTransition(async () => {
      try {
        // Clear cart locally before redirection since createOrder will redirect on server
        const currentItems = [...items]
        const currentTotal = getTotalPrice()
        
        const result = await createOrder(currentItems, currentTotal)
        
        if (result?.error) {
          toast.error('Lỗi đặt hàng', { description: result.error })
          return
        }

        // The clearCart() here might not be reached if redirect happens inside createOrder
        // but createOrder uses redirect() which throws a special error that Next.js catches.
        // If createOrder is successful, the page will redirect.
        clearCart()
      } catch (error: any) {
        // Next.js redirect() throws an error, we should not toast if it's a redirect
        if (error.message === 'NEXT_REDIRECT') {
          clearCart()
          throw error
        }
        toast.error('Đã xảy ra lỗi không xác định')
      }
    })
  }

  const subtotal = getTotalPrice()
  const shipping = subtotal > 500000 ? 0 : 30000
  const total = subtotal + shipping

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Header & Steps */}
      <div className="bg-background border-b pt-10 pb-8 mb-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <Link href="/cart" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-2">
                <ChevronLeft className="mr-1 h-4 w-4" /> Quay lại giỏ hàng
              </Link>
              <h1 className="text-3xl font-black tracking-tight">Thanh toán</h1>
            </div>
            
            {/* Steps Indicator */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <span className="text-sm font-bold text-emerald-600 hidden sm:inline">Giỏ hàng</span>
              </div>
              <div className="h-[2px] w-8 bg-emerald-200" />
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-lg shadow-primary/20">
                  2
                </div>
                <span className="text-sm font-bold text-primary">Thông tin</span>
              </div>
              <div className="h-[2px] w-8 bg-zinc-200" />
              <div className="flex items-center gap-2 opacity-40">
                <div className="h-8 w-8 rounded-full bg-zinc-400 text-white flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <span className="text-sm font-bold hidden sm:inline">Hoàn tất</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Content: Info & Payment */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Shipping Info Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="rounded-[2.5rem] border shadow-sm overflow-hidden bg-background">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                      <Truck className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight">Thông tin giao hàng</h2>
                  </div>
                  
                  <form id="checkout-form" action={handleCheckout} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground flex items-center gap-1.5">
                        <User className="h-3 w-3" /> Họ và tên người nhận *
                      </Label>
                      <Input 
                        id="name" 
                        name="name" 
                        required 
                        placeholder="Nguyễn Văn A" 
                        className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground flex items-center gap-1.5">
                        <Phone className="h-3 w-3" /> Số điện thoại *
                      </Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        required 
                        placeholder="09xx xxx xxx" 
                        className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all"
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address" className="text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground flex items-center gap-1.5">
                        <MapPin className="h-3 w-3" /> Địa chỉ giao hàng chi tiết *
                      </Label>
                      <Input 
                        id="address" 
                        name="address" 
                        required 
                        placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố" 
                        className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all"
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="notes" className="text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground flex items-center gap-1.5">
                        <NotebookPen className="h-3 w-3" /> Ghi chú thêm (Tùy chọn)
                      </Label>
                      <Input 
                        id="notes" 
                        name="notes" 
                        placeholder="Giao giờ hành chính, gọi trước khi đến..." 
                        className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all"
                      />
                    </div>
                  </form>
                </div>
              </Card>
            </motion.div>

            {/* Payment Method Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="rounded-[2.5rem] border shadow-sm overflow-hidden bg-background">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                      <Wallet className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight">Phương thức thanh toán</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                      className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${
                        paymentMethod === 'cod' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted-foreground/10 hover:border-muted-foreground/30'
                      }`}
                      onClick={() => setPaymentMethod('cod')}
                    >
                      <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'cod' ? 'border-primary' : 'border-zinc-300'
                      }`}>
                        {paymentMethod === 'cod' && <div className="h-3 w-3 rounded-full bg-primary" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm">Thanh toán khi nhận hàng (COD)</p>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase mt-0.5">Tiền mặt hoặc Chuyển khoản</p>
                      </div>
                      <Truck className={`h-6 w-6 ${paymentMethod === 'cod' ? 'text-primary' : 'text-zinc-300'}`} />
                    </div>

                    <div 
                      className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${
                        paymentMethod === 'bank' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted-foreground/10 hover:border-muted-foreground/30'
                      }`}
                      onClick={() => setPaymentMethod('bank')}
                    >
                      <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'bank' ? 'border-primary' : 'border-zinc-300'
                      }`}>
                        {paymentMethod === 'bank' && <div className="h-3 w-3 rounded-full bg-primary" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm">Chuyển khoản ngân hàng</p>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase mt-0.5">VietQR / Mobile Banking</p>
                      </div>
                      <CreditCard className={`h-6 w-6 ${paymentMethod === 'bank' ? 'text-primary' : 'text-zinc-300'}`} />
                    </div>
                  </div>

                  {paymentMethod === 'bank' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-6 p-6 bg-muted/40 rounded-2xl border border-dashed border-primary/30"
                    >
                      <p className="text-sm font-medium text-center text-muted-foreground leading-relaxed">
                        Bạn sẽ thấy thông tin tài khoản ngân hàng và mã QR sau khi nhấn nút <span className="font-bold text-primary">"Xác nhận đặt hàng"</span>.
                      </p>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>

          </div>

          {/* Right Sidebar: Order Review */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="sticky top-28 space-y-6"
            >
              {/* Items Card */}
              <Card className="rounded-[2.5rem] border shadow-sm bg-background overflow-hidden">
                <div className="p-8">
                  <h3 className="font-black text-lg mb-6 border-b pb-4 flex items-center justify-between">
                    Sản phẩm <span>({getTotalItems()})</span>
                  </h3>
                  
                  <div className="space-y-5 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-200">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4 group">
                        <div className="relative h-20 w-16 bg-muted rounded-xl overflow-hidden shrink-0 shadow-sm transition-transform group-hover:scale-105">
                          <Image 
                            src={item.cover_image_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop'} 
                            alt={item.title} 
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold line-clamp-1 group-hover:text-primary transition-colors">{item.title}</h4>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-muted-foreground font-bold">x{item.quantity}</p>
                            <p className="text-sm font-black">{formatPrice(item.price * item.quantity)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Total Card - Reusing the Pink Theme or similar modern style */}
              <Card className="rounded-[2.5rem] bg-pink-50/80 backdrop-blur-sm border border-pink-200 shadow-xl shadow-pink-200/50 overflow-hidden">
                <div className="p-8">
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center text-zinc-600 font-medium">
                      <span>Tạm tính</span>
                      <span className="text-zinc-900 font-bold">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-600 font-medium">
                      <span>Phí vận chuyển</span>
                      <span className="text-zinc-900 font-bold">{shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-600 font-medium border-t border-pink-200/50 pt-4">
                      <span className="text-lg font-bold text-zinc-800">Tổng thanh toán</span>
                      <p className="text-3xl font-black text-pink-600">{formatPrice(total)}</p>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    form="checkout-form" 
                    className="w-full h-14 rounded-2xl bg-pink-600 text-white hover:bg-pink-700 text-lg font-black shadow-lg shadow-pink-200 group transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 border-none"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                        ĐANG XỬ LÝ...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 uppercase">
                        Xác nhận đặt hàng <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>
                  
                  <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold text-pink-600/60 uppercase tracking-widest">
                    <ShieldCheck className="h-4 w-4" />
                    Bảo mật 256-bit SSL
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  )
}