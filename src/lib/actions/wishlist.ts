'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { cache } from 'react'

export const getWishlistCount = cache(async () => {
  const supabase = await createClient()
  
  // Use getSession for faster check in non-critical paths
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return 0

  const { count, error } = await supabase
    .from('wishlist')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', session.user.id)

  if (error) return 0
  return count || 0
})

export async function toggleWishlist(bookId: string) {
  const supabase = await createClient()

  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { error: 'Bạn cần đăng nhập để thêm vào danh sách yêu thích.' }
  }

  // Check if item already in wishlist
  const { data: existing, error: checkError } = await supabase
    .from('wishlist')
    .select('id')
    .eq('user_id', user.id)
    .eq('book_id', bookId)
    .single()

  if (existing) {
    // Remove from wishlist
    const { error: deleteError } = await supabase
      .from('wishlist')
      .delete()
      .eq('id', existing.id)

    if (deleteError) return { error: 'Lỗi khi xóa khỏi danh sách yêu thích.' }
    
    revalidatePath('/')
    revalidatePath('/books')
    revalidatePath('/wishlist')
    return { success: true, action: 'removed' }
  } else {
    // Add to wishlist
    const { error: insertError } = await supabase
      .from('wishlist')
      .insert({ user_id: user.id, book_id: bookId })

    if (insertError) return { error: 'Lỗi khi thêm vào danh sách yêu thích.' }

    revalidatePath('/')
    revalidatePath('/books')
    revalidatePath('/wishlist')
    return { success: true, action: 'added' }
  }
}

export async function getWishlist() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('wishlist')
    .select(`
      id,
      books:book_id (*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Chi tiết lỗi Wishlist:', error.message, error.details, error.hint)
    return []
  }

  if (!data) return []

  // Lọc bỏ các trường hợp sách bị null (do đã bị xóa khỏi DB)
  return data
    .filter(item => item.books !== null)
    .map(item => item.books)
}

export async function getWishlistIds() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('wishlist')
    .select('book_id')
    .eq('user_id', user.id)

  if (error) return []
  return data.map(item => item.book_id)
}
