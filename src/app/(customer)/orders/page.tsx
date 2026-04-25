import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { BookOpen, Package, Calendar } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const revalidate = 0 // always fetch fresh data for orders

const statusMap: Record<string, { label: string, color: string }> = {
  pending: { label: 'Chờ xử lý', color: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20' },
  processing: { label: 'Đang chuẩn bị', color: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20' },
  shipped: { label: 'Đang giao', color: 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20' },
  delivered: { label: 'Đã giao', color: 'bg-green-500/10 text-green-500 hover:bg-green-500/20' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-500/10 text-red-500 hover:bg-red-500/20' },
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

  if (!user) return null // Should not happen due to middleware

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
    <div className="container mx-auto px-4 py-8 md:py-12">
      {success && orderId && (
        <div className="mb-8 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200">
          <h2 className="font-bold flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Đặt hàng thành công!
          </h2>
          <p className="text-sm mt-1">Cảm ơn bạn đã mua sắm. Mã đơn hàng của bạn là: <span className="font-mono font-semibold">{orderId}</span></p>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-8">Đơn hàng của tôi</h1>

      {error ? (
        <div className="text-center py-12 text-red-500 bg-red-50 rounded-lg">
          <p>Đã xảy ra lỗi khi tải danh sách đơn hàng.</p>
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed flex flex-col items-center">
          <Package className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-medium mb-2">Bạn chưa có đơn hàng nào</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Hãy khám phá ngay những cuốn sách thú vị và đặt hàng nhé.
          </p>
          <Button asChild>
            <Link href="/books">
              Khám phá sách
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const status = statusMap[order.status] || { label: order.status, color: 'bg-muted text-muted-foreground' }
            
            return (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4 border-b">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        Đơn hàng <span className="font-mono text-sm text-muted-foreground">#{order.id.split('-')[0]}</span>
                      </CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Calendar className="mr-1 h-3 w-3" />
                        {formatDate(order.created_at)}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2">
                      <Badge className={`${status.color} border-0`} variant="outline">
                        {status.label}
                      </Badge>
                      <span className="font-bold text-primary">
                        {formatPrice(order.total_amount)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {order.order_items?.map((item: any) => (
                      <div key={item.id} className="flex gap-4 items-start">
                        <div className="w-16 h-20 bg-muted rounded overflow-hidden flex-shrink-0">
                          {item.books?.cover_image_url ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img 
                              src={item.books.cover_image_url} 
                              alt={item.books?.title || 'Bìa sách'} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <BookOpen className="h-6 w-6 text-muted-foreground/50" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link href={`/books/${item.books?.id}`} className="font-medium hover:text-primary transition-colors line-clamp-2">
                            {item.books?.title || 'Sách không còn tồn tại'}
                          </Link>
                          <div className="text-sm text-muted-foreground mt-1 flex justify-between">
                            <span>Số lượng: {item.quantity}</span>
                            <span>{formatPrice(item.price_at_time)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}