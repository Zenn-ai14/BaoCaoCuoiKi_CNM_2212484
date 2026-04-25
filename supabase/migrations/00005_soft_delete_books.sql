/* Add is_active column to books table for soft delete */
ALTER TABLE public.books ADD COLUMN is_active BOOLEAN DEFAULT TRUE NOT NULL;

/* Update RLS policies to respect is_active */
/* For public viewing, only show active books or allow admins to see all */
DROP POLICY IF EXISTS "Anyone can view books" ON public.books;

CREATE POLICY "Anyone can view books" ON public.books
  FOR SELECT USING (is_active = true OR public.is_admin());
