'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const fullName = formData.get('fullName') as string
  
  if (!fullName || fullName.trim() === '') {
    return { error: 'Họ và tên không được để trống' }
  }

  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Bạn chưa đăng nhập' }
  }

  // Update public.users table
  const { error: updateError } = await supabase
    .from('users')
    .update({ full_name: fullName })
    .eq('id', user.id)

  if (updateError) {
    console.error('Lỗi cập nhật profile:', updateError)
    return { error: 'Không thể cập nhật thông tin. Vui lòng thử lại sau.' }
  }

  revalidatePath('/profile')
  revalidatePath('/', 'layout') // To update Header/Navbar avatar
  
  return { success: true }
}

export async function updateContactInfo(formData: FormData) {
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string

  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Bạn chưa đăng nhập' }
  }

  // Update public.users table
  const { error: updateError } = await supabase
    .from('users')
    .update({ 
      phone: phone || null,
      address: address || null
    })
    .eq('id', user.id)

  if (updateError) {
    console.error('Lỗi cập nhật thông tin liên hệ:', updateError)
    return { error: 'Không thể cập nhật thông tin. Vui lòng thử lại sau.' }
  }

  revalidatePath('/profile')
  
  return { success: true }
}

export async function updatePasswordInProfile(formData: FormData) {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (password !== confirmPassword) {
    return { error: 'Mật khẩu xác nhận không khớp.' }
  }

  if (password.length < 6) {
    return { error: 'Mật khẩu phải có ít nhất 6 ký tự.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}


