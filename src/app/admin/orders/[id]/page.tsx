import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Edit, Package, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { updateOrderStatus } from '@/lib/actions/admin'
import { notFound } from 'next/navigation'

const statusMap: Record<string, { label: string, color: string }> = {
  pending: { label: 'Chờ xử lý', color: 'bg-yellow-500/10 text-yellow-500' },
  processing: { label: 'Đang chuẩn bị', color: 'bg-blue-500/10 text-blue-500' },
  shipped: { label: 'Đang giao', color: 'bg-purple-500/10 text-purple-500' },
  delivered: { label: 'Đã giao', color: 'bg-green-500/10 text-green-500' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-500/10 text-red-500' },
}

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      users (
        full_name,
        id
      ),
      order_items (
        id,
        quantity,
        price_at_time,
        books (
          title,
          cover_image_url
        )
      )
    `)
    .eq('id', id)
    .single()

  if (error || !order) {
    notFound()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
      dateStyle: 'full',
      timeStyle: 'medium',
    }).format(new Date(dateString))
  }

  const currentStatus = statusMap[order.status] || { label: order.status, color: 'bg-muted text-muted-foreground' }
  const updateAction = updateOrderStatus.bind(null, id)

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Chi tiết Đơn hàng</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Thông tin chung */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Mã đơn hàng: <span className="font-mono font-normal">{order.id}</span></CardTitle>
            <CardDescription>Đặt lúc: {formatDate(order.created_at)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" /> Sản phẩm ({order.order_items?.length || 0})
              </h3>
              <div className="space-y-4">
                {order.order_items?.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                    <div className="h-16 w-12 bg-muted rounded overflow-hidden shrink-0">
                      {item.books?.cover_image_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={item.books.cover_image_url} alt={item.books.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-secondary text-secondary-foreground text-xs">Ảnh</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium line-clamp-1">{item.books?.title || 'Sản phẩm không xác định'}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.price_at_time)} x {item.quantity}
                      </p>
                    </div>
                    <div className="font-semibold text-right">
                      {formatPrice(item.price_at_time * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <span className="font-medium text-lg">Tổng cộng</span>
              <span className="font-bold text-2xl text-primary">{formatPrice(order.total_amount)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Thông tin khách & Trạng thái */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Khách hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{(order as any).users?.full_name || 'Khách vô danh'}</p>
              <p className="text-sm text-muted-foreground mt-1 font-mono break-all">ID: {(order as any).users?.id}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cập nhật Trạng thái</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={updateAction} className="space-y-4">
                <div className="space-y-2">
                  <Label>Trạng thái hiện tại</Label>
                  <div className="pb-2">
                    <Badge className={`${currentStatus.color} border-0 text-sm`} variant="outline">
                      {currentStatus.label}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Đổi trạng thái thành</Label>
                  <select 
                    id="status" 
                    name="status"
                    defaultValue={order.status}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="pending">Chờ xử lý</option>
                    <option value="processing">Đang chuẩn bị</option>
                    <option value="shipped">Đang giao</option>
                    <option value="delivered">Đã giao</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>

                <Button type="submit" className="w-full">
                  Cập nhật trạng thái
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
