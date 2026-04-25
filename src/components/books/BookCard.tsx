'use client'

import { Book } from '@/types'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store/cart'
import { toast } from 'sonner'
import Image from 'next/link' // Wait, I should use next/image
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

// Correcting the imports
import NextImage from 'next/image'

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
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

  // Fallback image if cover_image_url is not provided
  const imageUrl = book.cover_image_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop'

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-md">
      <Link href={`/books/${book.id}`} className="block relative aspect-[2/3] overflow-hidden">
        {/* Using a standard img tag with object-cover for simplicity, or Next.js Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={`Bìa sách ${book.title}`}
          className="object-cover w-full h-full transition-transform hover:scale-105"
        />
      </Link>
      <CardHeader className="p-4 flex-none">
        <Link href={`/books/${book.id}`}>
          <h3 className="font-semibold text-lg line-clamp-1 hover:text-primary transition-colors" title={book.title}>
            {book.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1">
        <div className="flex items-center justify-between">
          <p className="font-bold text-lg text-primary">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price)}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto">
        <Button 
          onClick={handleAddToCart} 
          className="w-full"
          disabled={book.stock_quantity <= 0}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {book.stock_quantity > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
        </Button>
      </CardFooter>
    </Card>
  )
}