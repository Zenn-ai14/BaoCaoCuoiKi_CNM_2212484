'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Package, BookOpen, ChevronRight, Clock, MapPin, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface OrderListProps {
  orders: any[]
}

const statusMap: Record<string, { label: string, color: string }> = {
  pending: { label: 'Chờ xử lý', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  processing: { label: 'Đang chuẩn bị', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  shipped: { label: 'Đang giao', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  delivered: { label: 'Đã giao', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  cancelled: { label: 'Đã hủy', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' },
}

function OrderCard({ order, index }: { order: any, index: number }) {
  const [isExpanded, setIsExpanded] = React.useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(dateString))
  }

  const status = statusMap[order.status] || { label: order.status, color: 'bg-muted text-muted-foreground' }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="rounded-[2rem] border shadow-sm overflow-hidden bg-background group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
        <CardHeader 
          className="bg-muted/20 pb-6 border-b border-border/50 cursor-pointer hover:bg-muted/30 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2">
                  Đơn hàng <span className="text-primary">#{order.id.split('-')[0].toUpperCase()}</span>
                </CardTitle>
                <CardDescription className="flex items-center mt-1 font-bold text-xs uppercase tracking-widest text-muted-foreground">
                  <Clock className="mr-1.5 h-3 w-3" />
                  {formatDate(order.created_at)}
                </CardDescription>
              </div>
            </div>
            
            <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3">
              <div className="flex items-center gap-3">
                <Badge className={`${status.color} border-none font-black text-[10px] px-3 py-1 rounded-full shadow-sm uppercase tracking-tighter`} variant="outline">
                  {status.label}
                </Badge>
                <div className={cn(
                  "h-8 w-8 rounded-full border border-border flex items-center justify-center transition-transform duration-300",
                  isExpanded ? "rotate-180 bg-primary text-primary-foreground border-primary" : "bg-background"
                )}>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
              <span className="font-black text-2xl text-zinc-900">
                {formatPrice(order.total_amount)}
              </span>
            </div>
          </div>
        </CardHeader>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="divide-y divide-border/40">
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="p-6 md:p-8 flex items-center gap-6 group/item hover:bg-muted/20 transition-colors">
                      <div className="relative h-20 w-15 md:h-24 md:w-18 bg-muted rounded-xl overflow-hidden shrink-0 shadow-sm transition-transform group-hover/item:scale-105">
                        <Image 
                          src={item.books?.cover_image_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop'} 
                          alt={item.books?.title || 'Bìa sách'} 
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <Link href={`/books/${item.books?.id}`} className="font-extrabold text-base md:text-lg hover:text-primary transition-colors line-clamp-1 block">
                              {item.books?.title || 'Sách không còn tồn tại'}
                            </Link>
                            <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-wider">Mã SP: {item.books?.id?.split('-')[0]}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-black text-base">{formatPrice(item.price_at_time)}</p>
                            <p className="text-[10px] font-bold text-muted-foreground mt-1">SL: {item.quantity}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="hidden sm:block">
                        <Link href={`/books/${item.books?.id}`}>
                          <div className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                            <ChevronRight className="h-5 w-5" />
                          </div>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Order Footer - Actions */}
                <div className="p-6 bg-zinc-50 border-t border-border/50 flex flex-col sm:flex-row justify-end items-center gap-4">
                  <div className="flex gap-3 w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none rounded-full font-bold text-xs h-10 px-6">
                      Chi tiết đơn hàng
                    </Button>
                    <Button variant="default" size="sm" className="flex-1 sm:flex-none rounded-full font-bold text-xs h-10 px-6 shadow-lg shadow-primary/20">
                      Mua lại
                    </Button>
                  </div>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}

export function OrderList({ orders }: OrderListProps) {
  return (
    <div className="space-y-8">
      {orders.map((order, index) => (
        <OrderCard key={order.id} order={order} index={index} />
      ))}
    </div>
  )
}
