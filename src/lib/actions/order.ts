'use server'

import { createClient } from '@/lib/supabase/server'
import { CartItem } from '@/types'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createOrder(cartItems: CartItem[], totalAmount: number) {
  const supabase = await createClient()

  // 1. Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Bạn cần đăng nhập để đặt hàng' }
  }

  // 2. Validate cart
  if (!cartItems || cartItems.length === 0) {
    return { error: 'Giỏ hàng của bạn đang trống' }
  }

  // 3. Start a transaction (Supabase RPC or sequential inserts)
  // Since we don't have a custom RPC for transaction, we'll do sequential inserts
  // Note: For production with high concurrency, consider creating a Postgres function (RPC) to handle this transactionally.

  // Insert Order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      total_amount: totalAmount,
      status: 'pending'
    })
    .select()
    .single()

  if (orderError) {
    console.error('Lỗi tạo đơn hàng:', orderError)
    return { error: 'Không thể tạo đơn hàng. Vui lòng thử lại sau.' }
  }

  // Prepare Order Items
  const orderItemsData = cartItems.map(item => ({
    order_id: order.id,
    book_id: item.id,
    quantity: item.quantity,
    price_at_time: item.price
  }))

  // Insert Order Items
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsData)

  if (itemsError) {
    console.error('Lỗi tạo chi tiết đơn hàng:', itemsError)
    // Rollback order (best effort)
    await supabase.from('orders').delete().eq('id', order.id)
    return { error: 'Không thể lưu chi tiết đơn hàng. Vui lòng thử lại.' }
  }

  // 4. Revalidate and redirect
  revalidatePath('/orders')
  redirect(`/orders?success=true&orderId=${order.id}`)
}
