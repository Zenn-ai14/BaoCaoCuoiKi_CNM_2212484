import { Navbar } from './Navbar'
import { createClient } from '@/lib/supabase/server'
import { User } from '@/types'

export async function Header() {
  const supabase = await createClient()

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  let user: User | null = null

  if (authUser) {
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (userData) {
      user = {
        id: userData.id,
        email: authUser.email!,
        full_name: userData.full_name,
        avatar_url: userData.avatar_url,
        role: userData.role,
      }
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      <Navbar user={user} />
    </header>
  )
}