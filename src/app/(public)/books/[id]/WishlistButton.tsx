'use client'

import { toggleWishlist } from '@/lib/actions/wishlist'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useTransition, useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface WishlistButtonProps {
  bookId: string
  isWishlistedInitial: boolean
}

export default function WishlistButton({ bookId, isWishlistedInitial }: WishlistButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [isWishlisted, setIsWishlisted] = useState(isWishlistedInitial)

  const handleToggle = () => {
    startTransition(async () => {
      const previousState = isWishlisted
      setIsWishlisted(!previousState)
      
      const result = await toggleWishlist(bookId)
      
      if (result.error) {
        toast.error(result.error)
        setIsWishlisted(previousState)
      } else {
        if (result.action === 'added') {
          toast.success('Đã thêm vào yêu thích')
        } else {
          toast.success('Đã xóa khỏi yêu thích')
        }
      }
    })
  }

  return (
    <Button 
      variant="outline" 
      size="lg" 
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "rounded-xl px-6 font-bold transition-all",
        isWishlisted && "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700"
      )}
    >
      <Heart className={cn("mr-2 h-5 w-5", isWishlisted && "fill-current")} />
      {isWishlisted ? 'ĐÃ YÊU THÍCH' : 'YÊU THÍCH'}
    </Button>
  )
}
