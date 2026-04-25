import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, ShoppingCart, Users, DollarSign } from 'lucide-react'

export const revalidate = 0

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Lấy tổng số sách
  const { count: totalBooks } = await supabase
    .from('books')
    .select('*', { count: 'exact', head: true })

  // Lấy tổng số đơn hàng
  const { count: totalOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })

  // Lấy tổng số người dùng
  const { count: totalUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  // Tính tổng doanh thu (chỉ tính đơn đã giao - delivered)
  const { data: deliveredOrders } = await supabase
    .from('orders')
    .select('total_amount')
    .eq('status', 'delivered')

  const totalRevenue = deliveredOrders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Tổng quan thống kê</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatPrice(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Từ các đơn hàng đã giao
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Đơn hàng trên hệ thống
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sản phẩm sách</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBooks || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Đầu sách đang kinh doanh
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Người dùng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Thành viên đã đăng ký
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Trong môi trường thực tế, đây sẽ là nơi chèn biểu đồ doanh thu */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Chào mừng đến với trang quản trị</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Từ thanh điều hướng bên trái, bạn có thể quản lý danh mục sách, cập nhật thông tin sản phẩm, xử lý trạng thái đơn hàng của khách và xem danh sách người dùng trên hệ thống.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}