import Link from 'next/link'
import { BookOpen, Globe, MessageCircle, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="inline-block font-bold">BookShop</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              BookShop là nền tảng thương mại điện tử chuyên cung cấp các loại sách chất lượng cao, đa dạng thể loại.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Globe className="h-5 w-5" />
                <span className="sr-only">Website</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <MessageCircle className="h-5 w-5" />
                <span className="sr-only">Community</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </div>
          
          <div className="flex flex-col space-y-4">
            <h3 className="font-semibold text-foreground">Sản phẩm</h3>
            <ul className="flex flex-col space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/books?category=van-hoc" className="hover:text-primary">Văn học</Link>
              </li>
              <li>
                <Link href="/books?category=kinh-te" className="hover:text-primary">Kinh tế</Link>
              </li>
              <li>
                <Link href="/books?category=ky-nang" className="hover:text-primary">Kỹ năng sống</Link>
              </li>
              <li>
                <Link href="/books?category=thieu-nhi" className="hover:text-primary">Thiếu nhi</Link>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col space-y-4">
            <h3 className="font-semibold text-foreground">Hỗ trợ</h3>
            <ul className="flex flex-col space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary">Chính sách đổi trả</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">Hướng dẫn mua hàng</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">Phương thức thanh toán</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">Liên hệ</Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col space-y-4">
            <h3 className="font-semibold text-foreground">Về chúng tôi</h3>
            <ul className="flex flex-col space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary">Giới thiệu</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">Tuyển dụng</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">Điều khoản dịch vụ</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">Chính sách bảo mật</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between border-t pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} BookShop. Đã đăng ký bản quyền.
          </p>
        </div>
      </div>
    </footer>
  )
}