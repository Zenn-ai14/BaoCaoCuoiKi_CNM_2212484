'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const nextPath = formData.get('next') as string || '/'

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect(`/login?message=${encodeURIComponent('Sai email hoặc mật khẩu. Vui lòng thử lại.')}&next=${encodeURIComponent(nextPath)}`)
  }

  revalidatePath('/', 'layout')
  redirect(nextPath)
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const nextPath = formData.get('next') as string || '/'

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: 'customer',
      },
    },
  })

  if (error) {
    redirect(`/register?message=${encodeURIComponent(error.message)}&next=${encodeURIComponent(nextPath)}`)
  }

  revalidatePath('/', 'layout')
  redirect(`/login?message=${encodeURIComponent('Đăng ký thành công! Hãy đăng nhập.')}&next=${encodeURIComponent(nextPath)}`)
}

export async function logout() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    redirect(`/?message=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function forgotPassword(formData: FormData) {
  const email = formData.get('email') as string
  const supabase = await createClient()
  
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = headersList.get('x-forwarded-proto') || 'http'
  const origin = `${protocol}://${host}`

  // Yêu cầu lấy link reset mật khẩu. Sẽ được chuyển hướng về /reset-password thông qua auth/callback
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  })

  if (error) {
    redirect(`/forgot-password?message=${encodeURIComponent(error.message)}`)
  }

  redirect(`/forgot-password?success=${encodeURIComponent('Vui lòng kiểm tra email của bạn để đặt lại mật khẩu.')}`)
}

export async function updatePassword(formData: FormData) {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const supabase = await createClient()

  if (password !== confirmPassword) {
    redirect(`/reset-password?message=${encodeURIComponent('Mật khẩu xác nhận không khớp.')}`)
  }

  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    redirect(`/reset-password?message=${encodeURIComponent(error.message)}`)
  }

  // Đổi mật khẩu thành công thì signOut để user đăng nhập lại
  await supabase.auth.signOut()

  redirect(`/login?message=${encodeURIComponent('Đổi mật khẩu thành công. Hãy đăng nhập.')}`)
}
