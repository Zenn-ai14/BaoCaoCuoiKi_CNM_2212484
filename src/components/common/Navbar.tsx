'use client'

import Link from 'next/link'
import { ShoppingCart, BookOpen, Search, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store/cart'
import { UserNav } from './UserNav'
import { User, Book } from '@/types'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { searchBooks } from '@/lib/actions/book'
import { getWishlistCount } from '@/lib/actions/wishlist'
import Image from 'next/image'

interface NavbarProps {
  user: User | null
}

export function Navbar({ user }: NavbarProps) {
  const [mounted, setMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Book[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [wishlistCount, setWishlistCount] = useState(0)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const getTotalItems = useCartStore((state) => state.getTotalItems)

  useEffect(() => {
    setMounted(true)
    setSearchQuery(searchParams.get('q') || '')
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    if (user) {
      getWishlistCount().then(setWishlistCount)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [searchParams, user])

  // Logic xử lý gợi ý khi gõ (Debounce)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true)
        const results = await searchBooks(searchQuery)
        setSuggestions(results)
        setIsSearching(false)
        setShowSuggestions(true)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuggestions(false)
    if (searchQuery.trim()) {
      router.push(`/books?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push('/books')
    }
  }

  return (
    <nav 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        isScrolled 
          ? "border-b bg-background/70 backdrop-blur-xl py-3 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.1)]" 
          : "bg-transparent py-5"
      )}
      onMouseLeave={() => setShowSuggestions(false)}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Left Section: Logo */}
        <div className="flex items-center gap-6 lg:gap-10">
          <Link href="/" className="flex items-center space-x-2.5 group shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full group-hover:bg-primary/40 transition-colors" />
              <div className="relative bg-primary p-2 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-primary/20">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
            <span className={cn(
              "hidden sm:inline-block font-bold text-2xl tracking-tight transition-colors",
              isScrolled ? "text-foreground" : "text-foreground"
            )}>
              Book<span className="text-primary">Shop</span>
            </span>
          </Link>
          
          <div className="hidden lg:flex gap-1">
            {[
              { name: 'Trang chủ', href: '/' },
              { name: 'Sách', href: '/books' },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-all rounded-full group overflow-hidden",
                  isScrolled ? "text-muted-foreground" : "text-zinc-700 dark:text-zinc-300"
                )}
              >
                <span className="relative z-10 group-hover:text-primary transition-colors">{item.name}</span>
                <span className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-1/2" />
              </Link>
            ))}
          </div>
        </div>

        {/* Middle Section: Search Bar with Suggestions */}
        <div className="flex-1 max-w-md px-4 hidden md:block relative">
          <form onSubmit={handleSearch} className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              placeholder="Tìm kiếm sách, tác giả..."
              className="w-full pl-10 pr-4 h-10 rounded-full bg-muted/50 border-border/50 focus:bg-background transition-all duration-300 focus:ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
            />
          </form>

          {/* Suggestions Dropdown */}
          {showSuggestions && (searchQuery.length >= 2) && (
            <div className="absolute top-full left-4 right-4 mt-2 bg-background border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[60]">
              <div className="p-2">
                {isSearching ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">Đang tìm kiếm...</div>
                ) : suggestions.length > 0 ? (
                  <div className="flex flex-col">
                    <p className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Sản phẩm gợi ý</p>
                    {suggestions.map((book) => (
                      <Link
                        key={book.id}
                        href={`/books/${book.id}`}
                        className="flex items-center gap-3 p-2 hover:bg-muted rounded-xl transition-colors group"
                        onClick={() => setShowSuggestions(false)}
                      >
                        <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded-md border bg-muted">
                          <Image
                            src={book.cover_image_url || "/placeholder-book.jpg"}
                            alt={book.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold truncate group-hover:text-primary transition-colors">{book.title}</h4>
                          <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                        </div>
                        <div className="text-sm font-black text-primary">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price)}
                        </div>
                      </Link>
                    ))}
                    <Link 
                      href={`/books?q=${searchQuery}`}
                      className="p-3 text-center text-xs font-bold text-primary hover:bg-primary/5 transition-colors border-t mt-1"
                      onClick={() => setShowSuggestions(false)}
                    >
                      Xem tất cả quả cho "{searchQuery}"
                    </Link>
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">Không tìm thấy kết quả nào</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="flex items-center pr-2 gap-1">
            {/* Mobile Search Icon - Only visible on small screens */}
            <Button variant="ghost" size="icon" className="md:hidden rounded-full" onClick={() => router.push('/books')}>
              <Search className="h-5 w-5" />
            </Button>

            {/* Wishlist Link */}
            <Button asChild variant="ghost" size="icon" className="relative hover:bg-rose-50 hover:text-rose-500 rounded-full transition-all duration-300 active:scale-90">
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Yêu thích</span>
                {mounted && wishlistCount > 0 && (
                  <Badge className="absolute -right-1.5 -top-1.5 h-5 min-w-[20px] justify-center rounded-full px-1 text-[10px] font-bold bg-rose-500 text-white border-2 border-background animate-in zoom-in">
                    {wishlistCount}
                  </Badge>
                )}
              </Link>
            </Button>

            <Button asChild variant="ghost" size="icon" className="relative hover:bg-primary/10 hover:text-primary rounded-full transition-all duration-300 active:scale-90">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Giỏ hàng</span>
                {mounted && getTotalItems() > 0 && (
                  <Badge className="absolute -right-1.5 -top-1.5 h-5 min-w-[20px] justify-center rounded-full px-1 text-[10px] font-bold bg-primary text-primary-foreground border-2 border-background animate-in zoom-in">
                    {getTotalItems()}
                  </Badge>
                )}
              </Link>
            </Button>
          </div>

          <div className="h-6 w-[1px] bg-border/60 mx-1 hidden sm:block" />

          {user ? (
            <UserNav user={user} />
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex rounded-full font-medium hover:bg-primary/5">
                <Link href="/login">Đăng nhập</Link>
              </Button>
              <Button asChild size="sm" className="rounded-full px-4 sm:px-6 font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 bg-primary text-primary-foreground">
                <Link href="/register">Đăng ký</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
