'use client'

import { useCartStore } from '@/lib/store/cart'
import { toast } from 'sonner'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AddToCartButton({ book }: { book: any }) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem({
      id: book.id,
      title: book.title,
      price: book.price,
      cover_image_url: book.cover_image_url,
    })
    toast.success('Đã thêm vào giỏ hàng', {
      description: `${book.title} đã được thêm vào giỏ hàng của bạn.`,
    })
  }

  return (
    <Button 
      className="flex-1 px-6 py-6 text-lg font-medium flex items-center justify-center gap-2 transition-colors" 
      disabled={book.stock_quantity <= 0}
      onClick={handleAddToCart}
    >
      <ShoppingCart className="h-5 w-5" /> {book.stock_quantity > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
    </Button>
  )
}
