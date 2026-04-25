'use client'

import { useCartStore } from '@/lib/store/cart'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ChevronLeft, CreditCard, ShieldCheck, Truck } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart, getTotalItems } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [couponCode, setSearchQuery] = useState('')

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-20 flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
            <ShoppingBag className="h-8 w-8 text-primary/40" />
          </div>
          <div className="h-6 w-48 bg-muted rounded"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    toast.error('Mã giảm giá không hợp lệ', {
      description: 'Mã giảm giá này đã hết hạn hoặc không tồn tại.'
    })
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[70vh] text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
          <div className="relative h-32 w-32 bg-background border-2 border-dashed rounded-full flex items-center justify-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
          </div>
        </motion.div>
        <h1 className="text-3xl font-extrabold mb-3 tracking-tight">Giỏ hàng của bạn đang trống</h1>
        <p className="text-muted-foreground mb-10 max-w-md text-lg">
          Có vẻ như bạn chưa chọn được cuốn sách ưng ý nào. Hãy quay lại cửa hàng để khám phá nhé!
        </p>
        <Button asChild size="lg" className="rounded-full h-14 px-10 text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40">
          <Link href="/books">
            Khám phá ngay <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    )
  }

  const subtotal = getTotalPrice()
  const shipping = subtotal > 500000 ? 0 : 30000
  const total = subtotal + shipping

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Page Header */}
      <div className="bg-background border-b pt-10 pb-8 mb-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                Giỏ hàng <span className="text-primary/40">({getTotalItems()})</span>
              </h1>
              <p className="text-muted-foreground mt-1 font-medium">Hoàn tất đơn hàng của bạn</p>
            </div>
            <Link href="/books" className="inline-flex items-center text-sm font-bold text-primary hover:underline">
              <ChevronLeft className="mr-1 h-4 w-4" /> Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Cart Area */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="font-bold text-lg">Chi tiết sản phẩm</h2>
              <button 
                onClick={() => {
                  if (confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) clearCart()
                }} 
                className="text-sm font-bold text-destructive hover:opacity-80 transition-opacity"
              >
                Làm trống giỏ hàng
              </button>
            </div>

            <div className="bg-background rounded-[2rem] border shadow-sm overflow-hidden">
              <div className="divide-y">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div 
                      key={item.id} 
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="p-6 md:p-8 flex flex-col sm:flex-row gap-6 group relative"
                    >
                      <Link href={`/books/${item.id}`} className="relative w-full sm:w-28 aspect-[3/4] bg-muted rounded-xl overflow-hidden shrink-0 shadow-sm transition-transform hover:scale-105">
                        <Image 
                          src={item.cover_image_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop'} 
                          alt={item.title} 
                          fill
                          className="object-cover"
                        />
                      </Link>
                      
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div className="flex justify-between gap-4">
                          <div>
                            <Link href={`/books/${item.id}`} className="font-extrabold text-xl hover:text-primary transition-colors line-clamp-2">
                              {item.title}
                            </Link>
                            <p className="text-sm font-bold text-primary/60 uppercase tracking-widest mt-1">Sách in</p>
                          </div>
                          <div className="text-right hidden sm:block">
                            <p className="font-black text-xl">{formatPrice(item.price)}</p>
                            {item.quantity > 1 && (
                              <p className="text-xs text-muted-foreground mt-1">tổng {formatPrice(item.price * item.quantity)}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-6">
                          <div className="flex items-center bg-muted rounded-full p-1 border border-border/50">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-full hover:bg-background"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-10 text-center font-black text-sm">{item.quantity}</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-full hover:bg-background"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <button 
                            className="text-sm font-bold text-muted-foreground hover:text-destructive flex items-center gap-1.5 transition-colors"
                            onClick={() => {
                              removeItem(item.id)
                              toast.success('Đã xóa sản phẩm khỏi giỏ')
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="hidden sm:inline">Xóa</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Coupons & Extra Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-background rounded-[2rem] border p-6 shadow-sm">
                <h3 className="font-bold mb-4">Mã giảm giá</h3>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Nhập mã coupon..." 
                    className="flex-1 bg-muted/50 rounded-full px-4 text-sm font-medium border-none focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                  <Button type="submit" variant="secondary" className="rounded-full font-bold">Áp dụng</Button>
                </form>
              </div>
              <div className="flex flex-col justify-center gap-4 px-4">
                <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
                  <Truck className="h-5 w-5 text-primary" />
                  <span>Miễn phí giao hàng cho đơn từ 500k</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <span>Thanh toán an toàn & bảo mật</span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-4">
            <Card className="sticky top-28 bg-zinc-900 text-white rounded-[2.5rem] overflow-hidden border-none shadow-2xl shadow-primary/10">
              <CardContent className="p-8">
                <h3 className="text-xl font-black mb-8 border-b border-white/10 pb-4">Tóm tắt đơn hàng</h3>
                
                <div className="space-y-4 mb-10">
                  <div className="flex justify-between items-center text-white/70 font-medium">
                    <span>Tạm tính</span>
                    <span className="text-white font-bold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-white/70 font-medium">
                    <span>Phí vận chuyển</span>
                    <span className="text-white font-bold">{shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-[10px] text-white/40 italic">Mua thêm {formatPrice(500000 - subtotal)} để được FREE ship</p>
                  )}
                  <div className="flex justify-between items-center text-white/70 font-medium">
                    <span>Giảm giá</span>
                    <span className="text-emerald-400 font-bold">- {formatPrice(0)}</span>
                  </div>
                  
                  <Separator className="bg-white/10" />
                  
                  <div className="flex justify-between items-end pt-2">
                    <span className="text-lg font-bold">Tổng cộng</span>
                    <div className="text-right">
                      <p className="text-3xl font-black text-primary">{formatPrice(total)}</p>
                      <p className="text-[10px] text-white/40">Đã bao gồm VAT (nếu có)</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button asChild className="w-full h-14 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-black shadow-lg shadow-black/20 group transition-all hover:-translate-y-1 active:translate-y-0">
                    <Link href="/checkout">
                      THANH TOÁN NGAY <CreditCard className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                    </Link>
                  </Button>
                  <p className="text-center text-[11px] text-white/40 font-medium px-4 leading-relaxed">
                    Bằng việc tiếp tục, bạn đồng ý với Điều khoản dịch vụ và Chính sách hoàn tiền của BookShop.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Safe Badges below summary */}
            <div className="mt-8 flex justify-center gap-6 opacity-40 grayscale group-hover:opacity-100 transition-opacity">
              {/* Fake payment badges */}
              <div className="h-6 w-10 bg-muted rounded" />
              <div className="h-6 w-10 bg-muted rounded" />
              <div className="h-6 w-10 bg-muted rounded" />
              <div className="h-6 w-10 bg-muted rounded" />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}