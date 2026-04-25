import { createClient } from '@/lib/supabase/server'
import { BookOpen, Package, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { OrderList } from '@/components/common/OrderList'

export const revalidate = 0 // always fetch fresh data for orders

const statusMap: Record<string, { label: string, color: string }> = {
  pending: { label: 'Chờ xử lý', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  processing: { label: 'Đang chuẩn bị', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  shipped: { label: 'Đang giao', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  delivered: { label: 'Đã giao', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  cancelled: { label: 'Đã hủy', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' },
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; orderId?: string }>
}) {
  const { success, orderId } = await searchParams
  const supabase = await createClient()

  // Middleware ensures user is authenticated, but we need the ID
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Lấy đơn hàng cùng với chi tiết (order_items) và thông tin sách
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        quantity,
        price_at_time,
        books (
          id,
          title,
          cover_image_url
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(dateString))
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Page Header */}
      <div className="bg-background border-b pt-12 pb-10 mb-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black tracking-tight flex items-center gap-4">
                Đơn hàng của tôi <Package className="text-primary/20 h-8 w-8" />
              </h1>
              <p className="text-muted-foreground mt-2 font-medium text-lg">Theo dõi và quản lý lịch sử mua sắm của bạn</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold">Tổng số đơn hàng</p>
                <p className="text-2xl font-black text-primary">{orders?.length || 0}</p>
              </div>
              <div className="h-10 w-[1px] bg-border mx-4 hidden md:block" />
              <Button asChild className="rounded-full px-6 font-bold shadow-lg shadow-primary/20">
                <Link href="/books">Tiếp tục mua sắm</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {success && orderId && (
          <div className="mb-10 p-6 bg-emerald-50 text-emerald-800 rounded-[2rem] border border-emerald-100 shadow-xl shadow-emerald-500/5 flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight">Đặt hàng thành công!</h2>
                <p className="font-medium opacity-80">Mã đơn hàng của bạn là: <span className="font-mono font-bold bg-emerald-100 px-2 py-0.5 rounded text-emerald-900">#{orderId.split('-')[0].toUpperCase()}</span></p>
              </div>
            </div>
            <p className="text-sm font-bold bg-white/50 px-4 py-2 rounded-full border border-emerald-200">Chúng tôi sẽ sớm liên hệ để xác nhận đơn hàng.</p>
          </div>
        )}

        {error ? (
          <div className="text-center py-20 bg-background rounded-[2.5rem] border shadow-sm">
            <p className="text-red-500 font-bold text-lg">Đã xảy ra lỗi khi tải danh sách đơn hàng.</p>
            <Button variant="outline" className="mt-4 rounded-full" onClick={() => window.location.reload()}>Thử lại</Button>
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="text-center py-32 bg-background rounded-[2.5rem] border border-dashed flex flex-col items-center shadow-sm">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full" />
              <div className="relative h-28 w-28 bg-muted/30 rounded-full flex items-center justify-center">
                <Package className="h-12 w-12 text-muted-foreground opacity-40" />
              </div>
            </div>
            <h3 className="text-2xl font-black mb-3 tracking-tight">Bạn chưa có đơn hàng nào</h3>
            <p className="text-muted-foreground mb-10 max-w-md font-medium text-lg leading-relaxed px-4">
              Hãy khám phá ngay những cuốn sách thú vị và bắt đầu hành trình tri thức của mình nhé.
            </p>
            <Button asChild size="lg" className="rounded-full h-14 px-10 text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40">
              <Link href="/books">
                Khám phá sách ngay <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        ) : (
          <OrderList 
            orders={orders} 
          />
        )}
      </div>
    </div>
  )
}

function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}