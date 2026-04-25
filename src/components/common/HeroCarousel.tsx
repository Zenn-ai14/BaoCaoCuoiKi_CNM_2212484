"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, ShoppingCart } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Book } from "@/types";

interface HeroCarouselProps {
  books: Book[];
}

export function HeroCarousel({ books }: HeroCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  // Khởi tạo plugin ngay trong component để đảm bảo nó được React handle đúng
  const plugin = React.useMemo(
    () => Autoplay({ delay: 3000, stopOnInteraction: false }),
    []
  );

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (!books || books.length === 0) {
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  return (
    <div className="relative w-full overflow-hidden bg-transparent text-foreground rounded-[2rem] border border-border shadow-sm">
      <Carousel
        setApi={setApi}
        plugins={[plugin]}
        className="w-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent className="bg-transparent">
          {books.map((book, index) => (
            <CarouselItem key={book.id} className="bg-transparent">
              <div className="relative flex flex-col md:flex-row items-center h-[500px] md:h-[600px] w-full bg-transparent">
                {/* Text Section (40%) */}
                <div className="absolute md:relative z-10 flex flex-col justify-center w-full md:w-[40%] h-full p-8 md:p-12 lg:p-16 bg-background/60 md:bg-transparent backdrop-blur-md md:backdrop-blur-none">
                  <AnimatePresence mode="wait">
                    {current === index && (
                      <motion.div
                        key={book.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col gap-4"
                      >
                        <div className="flex gap-2">
                          {index === 0 && (
                            <Badge className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold border-none px-3 py-1">
                              MỚI VỀ
                            </Badge>
                          )}
                          {index === 1 && (
                            <Badge className="bg-amber-500 text-white hover:bg-amber-600 font-bold border-none px-3 py-1">
                              HOT DEAL
                            </Badge>
                          )}
                        </div>
                        
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight line-clamp-2">
                          {book.title}
                        </h2>
                        
                        <p className="text-muted-foreground font-bold text-lg">
                          Tác giả: <span className="text-primary">{book.author}</span>
                        </p>
                        
                        <p className="text-foreground/80 line-clamp-3 md:line-clamp-4 max-w-md font-medium">
                          {book.description || "Một tác phẩm tuyệt vời mà bạn không nên bỏ lỡ. Khám phá ngay để có những trải nghiệm đọc sách thú vị."}
                        </p>
                        
                        <div className="text-3xl font-black text-primary mt-2">
                          {formatPrice(book.price)}
                        </div>

                        <div className="flex flex-wrap gap-4 mt-6">
                          <Button asChild size="lg" className="rounded-full px-8 font-black shadow-lg shadow-primary/20">
                            <Link href={`/books/${book.id}`}>
                              XEM CHI TIẾT
                              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </Button>
                          <Button size="lg" variant="outline" className="border-primary/20 text-primary hover:bg-primary/5 rounded-full px-8">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            GIỎ HÀNG
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Image Section (60%) */}
                <div className="absolute top-0 left-0 md:relative w-full md:w-[60%] h-full overflow-hidden bg-primary/5">
                  <AnimatePresence mode="wait">
                    {current === index && (
                      <motion.div
                        key={`img-${book.id}`}
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.05, opacity: 0 }}
                        transition={{ duration: 0.7 }}
                        className="w-full h-full"
                      >
                        <Image
                          src={book.cover_image_url || "/placeholder-book.jpg"}
                          alt={book.title}
                          fill
                          className="object-cover object-center md:object-contain md:p-12"
                          priority={index === 0}
                          sizes="(max-width: 768px) 100vw, 60vw"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="left-4 bg-background/80 border-border text-foreground hover:bg-primary hover:text-primary-foreground" />
          <CarouselNext className="right-4 bg-background/80 border-border text-foreground hover:bg-primary hover:text-primary-foreground" />
        </div>
      </Carousel>
      
      {/* Carousel Dots Indicators */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
        {books.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              current === index 
                ? "bg-primary w-8" 
                : "bg-primary/20 hover:bg-primary/40"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
