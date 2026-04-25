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
