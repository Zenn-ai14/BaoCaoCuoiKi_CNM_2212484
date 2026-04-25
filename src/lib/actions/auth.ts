'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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
        role: 'customer', // Default role mapping matches trigger
      },
    },
  })

  if (error) {
    redirect(`/register?message=${encodeURIComponent(error.message)}&next=${encodeURIComponent(nextPath)}`)
  }

  // Next.js standard for successful sign up -> go to login or home
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