/* 1. Thay đổi ràng buộc khóa ngoại để cho phép xóa hoàn toàn sách (Cascade Delete) */
ALTER TABLE public.order_items 
DROP CONSTRAINT IF EXISTS order_items_book_id_fkey,
ADD CONSTRAINT order_items_book_id_fkey 
  FOREIGN KEY (book_id) 
  REFERENCES public.books(id) 
  ON DELETE CASCADE;

/* 2. Xóa chính sách RLS cũ có phụ thuộc vào cột is_active */
DROP POLICY IF EXISTS "Anyone can view books" ON public.books;

/* 3. Xóa cột is_active */
ALTER TABLE public.books DROP COLUMN IF EXISTS is_active;

/* 4. Tạo lại chính sách RLS mới không phụ thuộc vào is_active */
CREATE POLICY "Anyone can view books" ON public.books
  FOR SELECT USING (true);
