import { login } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; next?: string }>
}) {
  const { message, next } = await searchParams

  return (
    <div className="flex h-screen w-full items-center justify-center px-4 bg-muted/40">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Đăng nhập</CardTitle>
          <CardDescription>
            Nhập email và mật khẩu của bạn để truy cập tài khoản.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" action={login}>
            <input type="hidden" name="next" value={next || '/'} />
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Mật khẩu</Label>
              </div>
              <Input id="password" name="password" type="password" required />
            </div>
            
            {message && <div className="text-sm text-red-500">{message}</div>}

            <Button type="submit" className="w-full">
              Đăng nhập
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <div className="text-center text-sm">
            Chưa có tài khoản?{' '}
            <Link href={`/register${next ? `?next=${next}` : ''}`} className="underline">
              Đăng ký
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}