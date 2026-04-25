'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitReview(bookId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Bạn cần đăng nhập để gửi đánh giá.')
  }

  const rating = parseInt(formData.get('rating') as string)
  const comment = formData.get('comment') as string

  if (isNaN(rating) || rating < 1 || rating > 5) {
    throw new Error('Đánh giá không hợp lệ.')
  }

  const { error } = await supabase
    .from('reviews')
    .insert([{
      book_id: bookId,
      user_id: user.id,
      rating,
      comment
    }])

  if (error) {
    if (error.code === '23505') { // Unique violation
      throw new Error('Bạn đã đánh giá cuốn sách này rồi.')
    }
    throw new Error(error.message)
  }

  // Cập nhật điểm đánh giá trung bình cho sách (Optional, có thể dùng trigger trong DB)
  const { data: reviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('book_id', bookId)
  
  if (reviews && reviews.length > 0) {
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    await supabase.from('books').update({ average_rating: avgRating }).eq('id', bookId)
  }

  revalidatePath(`/books/${bookId}`)
}
