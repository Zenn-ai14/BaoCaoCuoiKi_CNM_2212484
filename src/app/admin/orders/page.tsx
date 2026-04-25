import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Edit } from 'lucide-react'
import Link from 'next/link'
import { deleteOrder } from '@/lib/actions/admin'
import { DeleteButton } from '@/components/admin/DeleteButton'

export const revalidate = 0

const statusMap: Record<string, { label: string, color: string }> = {
  pending: { label: 'Chờ xử lý', color: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20' },
  processing: { label: 'Đang chuẩn bị', color: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20' },
  shipped: { label: 'Đang giao', color: 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20' },
  delivered: { label: 'Đã giao', color: 'bg-green-500/10 text-green-500 hover:bg-green-500/20' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-500/10 text-red-500 hover:bg-red-500/20' },
}

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  // Lấy danh sách đơn hàng và thông tin user
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      *,
      users (
        full_name
      )
    `)
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
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Quản lý Đơn hàng</h1>
      </div>

      {error ? (
        <div className="text-red-500 bg-red-50 p-4 rounded-lg">Lỗi tải danh sách đơn hàng.</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Tất cả đơn hàng ({orders?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground bg-muted/50 border-b">
                  <tr>
                    <th className="px-4 py-3 font-medium">Mã ĐH</th>
                    <th className="px-4 py-3 font-medium">Khách hàng</th>
                    <th className="px-4 py-3 font-medium">Ngày đặt</th>
                    <th className="px-4 py-3 font-medium">Tổng tiền</th>
                    <th className="px-4 py-3 font-medium text-center">Trạng thái</th>
                    <th className="px-4 py-3 font-medium text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {orders?.map((order) => {
                    const status = statusMap[order.status] || { label: order.status, color: 'bg-muted text-muted-foreground' }
                    return (
                      <tr key={order.id} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-3 font-mono text-xs">{order.id.split('-')[0]}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium">{(order as any).users?.full_name || 'Khách Vô Danh'}</div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{formatDate(order.created_at)}</td>
                        <td className="px-4 py-3 font-bold text-primary">{formatPrice(order.total_amount)}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge className={`${status.color} border-0 whitespace-nowrap`} variant="outline">
                            {status.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/orders/${order.id}`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-500/10">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <DeleteButton action={deleteOrder.bind(null, order.id)} />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  {(!orders || orders.length === 0) && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        Chưa có đơn hàng nào trên hệ thống.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}