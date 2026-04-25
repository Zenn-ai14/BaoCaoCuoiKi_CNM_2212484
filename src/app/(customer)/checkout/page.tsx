'use client'

import { useCartStore } from '@/lib/store/cart'
import { createOrder } from '@/lib/actions/order'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="container mx-auto p-8">Đang tải thông tin thanh toán...</div>
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Giỏ hàng của bạn đang trống</h1>
        <p className="mb-8 text-muted-foreground">Bạn không thể thanh toán khi không có sản phẩm nào.</p>
        <Button asChild>
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
        // Trong thực tế, bạn sẽ lấy thông tin formData (địa chỉ, sdt) lưu vào bảng orders
        // Ở đây đơn giản hóa, chúng ta chỉ truyền items và tổng tiền
        const result = await createOrder(items, getTotalPrice())
        
        if (result?.error) {
          toast.error('Lỗi đặt hàng', { description: result.error })
          return
        }

        // Đặt hàng thành công
        clearCart()
        // Hàm redirect nằm trong createOrder rồi
      } catch (error) {
        toast.error('Đã xảy ra lỗi không xác định')
      }
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Thanh Toán */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Thông tin giao hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <form id="checkout-form" action={handleCheckout} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Họ và tên người nhận *</Label>
                  <Input id="name" name="name" required placeholder="Nhập họ tên" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <Input id="phone" name="phone" required placeholder="Ví dụ: 0912345678" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Địa chỉ giao hàng chi tiết *</Label>
                  <Input id="address" name="address" required placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Ghi chú thêm (Tùy chọn)</Label>
                  <Input id="notes" name="notes" placeholder="Giao giờ hành chính, gọi trước khi đến..." />
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Tóm Tắt Đơn Hàng */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Đơn hàng của bạn ({items.length} sản phẩm)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-start text-sm py-2">
                  <div className="flex gap-4">
                    <div className="w-12 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                      {item.cover_image_url && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={item.cover_image_url} alt={item.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium line-clamp-2">{item.title}</p>
                      <p className="text-muted-foreground mt-1">SL: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </CardContent>
            <Separator />
            <CardFooter className="flex flex-col pt-6 gap-4">
              <div className="flex justify-between w-full font-bold text-lg">
                <span>Tổng thanh toán</span>
                <span className="text-primary">{formatPrice(getTotalPrice())}</span>
              </div>
              <Button 
                type="submit" 
                form="checkout-form" 
                className="w-full" 
                size="lg"
                disabled={isPending}
              >
                {isPending ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}