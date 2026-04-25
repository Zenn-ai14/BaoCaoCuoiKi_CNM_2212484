/* Add policy for admins to delete orders */
CREATE POLICY "Admins can delete any order" ON public.orders
  FOR DELETE USING (public.is_admin());
