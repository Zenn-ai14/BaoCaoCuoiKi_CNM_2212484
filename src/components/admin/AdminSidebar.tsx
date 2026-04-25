'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  BookOpen, 
  Tags, 
  ShoppingCart, 
  Users 
} from 'lucide-react'

const navItems = [
  { name: 'Tổng quan', href: '/admin', icon: LayoutDashboard },
  { name: 'Quản lý Sách', href: '/admin/books', icon: BookOpen },
  { name: 'Danh mục', href: '/admin/categories', icon: Tags },
  { name: 'Đơn hàng', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Người dùng', href: '/admin/users', icon: Users },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 border-r bg-muted/30 hidden md:block flex-shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-6">
        <h2 className="text-lg font-bold tracking-tight mb-6">Trang Quản Trị</h2>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-primary text-primary-foreground font-medium' 
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}