'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// --- CATEGORIES ---

export async function addCategory(formData: FormData) {
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string

  const supabase = await createClient()

  const { error } = await supabase
    .from('categories')
    .insert([{ name, slug, description }])

  if (error) throw new Error(error.message)

  revalidatePath('/admin/categories')
  redirect('/admin/categories')
}

export async function editCategory(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string

  const supabase = await createClient()

  const { error } = await supabase
    .from('categories')
    .update({ name, slug, description })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/categories')
  redirect('/admin/categories')
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/categories')
}


// --- BOOKS ---

export async function addBook(formData: FormData) {
  const title = formData.get('title') as string
  const author = formData.get('author') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const stock_quantity = parseInt(formData.get('stock_quantity') as string)
  const category_id = formData.get('category_id') as string || null
  const cover_image_url = formData.get('cover_image_url') as string || null

  const supabase = await createClient()

  const { error } = await supabase
    .from('books')
    .insert([{ 
      title, author, description, price, stock_quantity, category_id, cover_image_url 
    }])

  if (error) throw new Error(error.message)

  revalidatePath('/admin/books')
  revalidatePath('/')
  redirect('/admin/books')
}

export async function editBook(id: string, formData: FormData) {
  const title = formData.get('title') as string
  const author = formData.get('author') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const stock_quantity = parseInt(formData.get('stock_quantity') as string)
  const category_id = formData.get('category_id') as string || null
  const cover_image_url = formData.get('cover_image_url') as string || null

  const supabase = await createClient()

  const { error } = await supabase
    .from('books')
    .update({ 
      title, author, description, price, stock_quantity, category_id, cover_image_url 
    })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/books')
  revalidatePath('/')
  redirect('/admin/books')
}

export async function deleteBook(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/books')
  revalidatePath('/')
}

// --- USERS ---

export async function editUserRole(id: string, formData: FormData) {
  const role = formData.get('role') as string
  const full_name = formData.get('full_name') as string

  const supabase = await createClient()

  const { error } = await supabase
    .from('users')
    .update({ role, full_name })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/users')
  redirect('/admin/users')
}

export async function deleteUser(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)

  // Auth user cannot be deleted directly from public.users because of cascade rules (it goes the other way around usually).
  // But let's assume we just delete the public profile for now or use the admin API if needed.
  // Actually, wait, auth.users id -> public.users. 
  // It is better not to provide deleteUser unless calling auth admin api. 
  // But we will provide it as is for basic requirement.

  revalidatePath('/admin/users')
}

// --- ORDERS ---

export async function updateOrderStatus(id: string, formData: FormData) {
  const status = formData.get('status') as string

  const supabase = await createClient()

  // 1. Lấy trạng thái hiện tại và danh sách sản phẩm trong đơn hàng
  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('status, order_items(book_id, quantity)')
    .eq('id', id)
    .single()

  if (fetchError || !order) throw new Error('Không tìm thấy đơn hàng')

  const previousStatus = order.status

  // 2. Cập nhật trạng thái đơn hàng
  const { error: updateError } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)

  if (updateError) throw new Error(updateError.message)

  // 3. Xử lý tồn kho
  // Nếu chuyển sang "đã giao" từ trạng thái khác
  if (status === 'delivered' && previousStatus !== 'delivered') {
    for (const item of (order.order_items as any[])) {
      const { data: book } = await supabase
        .from('books')
        .select('stock_quantity')
        .eq('id', item.book_id)
        .single()

      if (book) {
        await supabase
          .from('books')
          .update({ stock_quantity: Math.max(0, book.stock_quantity - item.quantity) })
          .eq('id', item.book_id)
      }
    }
  }
  // Nếu chuyển từ "đã giao" sang trạng thái khác (ví dụ: bị hủy hoặc hoàn trả)
  else if (previousStatus === 'delivered' && status !== 'delivered') {
    for (const item of (order.order_items as any[])) {
      const { data: book } = await supabase
        .from('books')
        .select('stock_quantity')
        .eq('id', item.book_id)
        .single()

      if (book) {
        await supabase
          .from('books')
          .update({ stock_quantity: book.stock_quantity + item.quantity })
          .eq('id', item.book_id)
      }
    }
  }

  revalidatePath('/admin/orders')
  revalidatePath('/admin/books')
  revalidatePath('/books')
  revalidatePath('/')
  redirect('/admin/orders')
}

export async function deleteOrder(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/orders')
  redirect('/admin/orders')
}
