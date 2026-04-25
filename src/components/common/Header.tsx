import { Navbar } from './Navbar'
import { createClient } from '@/lib/supabase/server'
import { User } from '@/types'

export async function Header() {
  const supabase = await createClient()

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  let user: User | null = null
  let wishlistCount = 0

  if (authUser) {
    // Fetch user details and wishlist count in parallel for performance
    const [userResponse, wishlistResponse] = await Promise.all([
      supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single(),
      supabase
        .from('wishlist')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', authUser.id)
    ])

    const { data: userData } = userResponse
    const { count } = wishlistResponse

    if (userData) {
      user = {
        id: userData.id,
        email: authUser.email!,
        full_name: userData.full_name,
        avatar_url: userData.avatar_url,
        role: userData.role,
      }
    }
    
    wishlistCount = count || 0
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      <Navbar user={user} initialWishlistCount={wishlistCount} />
    </header>
  )
}