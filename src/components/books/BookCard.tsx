'use client'

import { Book } from '@/types'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store/cart'
import { toast } from 'sonner'
import Link from 'next/link'
import { ShoppingCart, Heart } from 'lucide-react'
import { toggleWishlist } from '@/lib/actions/wishlist'
import { useTransition, useState } from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

// Correcting the imports
import NextImage from 'next/image'

interface BookCardProps {
  book: Book
  isWishlistedInitial?: boolean
}

export function BookCard({ book, isWishlistedInitial = false }: BookCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const [isPending, startTransition] = useTransition()
  const [isWishlisted, setIsWishlisted] = useState(isWishlistedInitial)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
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

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    startTransition(async () => {
      // Optimistic update
      const previousState = isWishlisted
      setIsWishlisted(!previousState)
      
      const result = await toggleWishlist(book.id)
      
      if (result.error) {
        toast.error(result.error)
        setIsWishlisted(previousState) // Revert on error
      } else {
        if (result.action === 'added') {
          toast.success('Đã thêm vào yêu thích')
        } else {
          toast.success('Đã xóa khỏi yêu thích')
        }
      }
    })
  }

  // Fallback image if cover_image_url is not provided
  const imageUrl = book.cover_image_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop'

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 border-border/50 rounded-2xl group bg-card relative">
      {/* Wishlist Button */}
      <button 
        onClick={handleWishlist}
        disabled={isPending}
        className={cn(
          "absolute top-3 right-3 z-10 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg",
          isWishlisted 
            ? "bg-rose-500 text-white scale-110" 
            : "bg-white/80 text-zinc-400 hover:text-rose-500 hover:bg-white"
        )}
      >
        <Heart className={cn("h-4 w-4 transition-transform", isWishlisted && "fill-current")} />
      </button>

      <Link href={`/books/${book.id}`} className="block relative aspect-[3/4] overflow-hidden bg-muted/30">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={`Bìa sách ${book.title}`}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
      </Link>
      <CardHeader className="p-4 flex-none space-y-1">
        <p className="text-[10px] font-black text-primary uppercase tracking-widest opacity-70">BookShop Choice</p>
        <Link href={`/books/${book.id}`}>
          <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors duration-300" title={book.title}>
            {book.title}
          </h3>
        </Link>
        <p className="text-xs font-medium text-muted-foreground line-clamp-1 italic">bởi {book.author}</p>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1">
        <div className="flex items-center justify-between">
          <p className="font-black text-xl text-primary">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price)}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto">
        <Button 
          onClick={handleAddToCart} 
          className="w-full rounded-xl font-bold shadow-lg shadow-primary/10 transition-all active:scale-95"
          disabled={book.stock_quantity <= 0}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {book.stock_quantity > 0 ? 'MUA NGAY' : 'HẾT HÀNG'}
        </Button>
      </CardFooter>
    </Card>
  )
}