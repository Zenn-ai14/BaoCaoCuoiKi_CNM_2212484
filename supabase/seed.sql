-- File: supabase/seed.sql
-- Hướng dẫn: Copy toàn bộ nội dung file này và chạy trong SQL Editor của Supabase.

-- 1. Chèn dữ liệu mẫu cho bảng Categories (Danh mục)
-- Sử dụng các UUID cố định để dễ dàng liên kết với bảng Books
INSERT INTO public.categories (id, name, slug, description)
VALUES 
  ('a1b2c3d4-0000-0000-0000-000000000001', 'Văn học', 'van-hoc', 'Các tác phẩm văn học kinh điển và đương đại trong nước và quốc tế.'),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'Kinh tế', 'kinh-te', 'Sách về kinh doanh, tài chính, đầu tư, khởi nghiệp và quản trị.'),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'Kỹ năng sống', 'ky-nang', 'Sách phát triển bản thân, rèn luyện tư duy và các kỹ năng mềm cần thiết.'),
  ('a1b2c3d4-0000-0000-0000-000000000004', 'Thiếu nhi', 'thieu-nhi', 'Sách truyện, truyện tranh, bách khoa tri thức dành cho trẻ em.')
ON CONFLICT (id) DO NOTHING;

-- 2. Chèn dữ liệu mẫu cho bảng Books (Sách)
INSERT INTO public.books (title, author, description, price, stock_quantity, cover_image_url, category_id, average_rating)
VALUES 
  (
    'Nhà Giả Kim', 
    'Paulo Coelho', 
    'Một câu chuyện triết lý sâu sắc về hành trình theo đuổi ước mơ và lắng nghe trái tim mình.', 
    85000, 
    100, 
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop', 
    'a1b2c3d4-0000-0000-0000-000000000001', 
    4.8
  ),
  (
    'Đắc Nhân Tâm', 
    'Dale Carnegie', 
    'Cuốn sách nổi tiếng nhất mọi thời đại về nghệ thuật giao tiếp và thu phục lòng người.', 
    76000, 
    150, 
    'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop', 
    'a1b2c3d4-0000-0000-0000-000000000003', 
    4.9
  ),
  (
    'Cha Giàu Cha Nghèo', 
    'Robert Kiyosaki', 
    'Cuốn sách thay đổi tư duy về tiền bạc, tài sản và tiêu sản.', 
    110000, 
    80, 
    'https://images.unsplash.com/photo-1554774853-719586f82d77?q=80&w=800&auto=format&fit=crop', 
    'a1b2c3d4-0000-0000-0000-000000000002', 
    4.7
  ),
  (
    'Tư Duy Nhanh Và Chậm', 
    'Daniel Kahneman', 
    'Khám phá hai hệ thống tư duy chi phối cách chúng ta đưa ra quyết định.', 
    180000, 
    50, 
    'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop', 
    'a1b2c3d4-0000-0000-0000-000000000002', 
    4.6
  ),
  (
    'Harry Potter và Hòn Đá Phù Thủy', 
    'J.K. Rowling', 
    'Phần đầu tiên trong series phép thuật huyền thoại về cậu bé phù thủy Harry Potter.', 
    135000, 
    200, 
    'https://images.unsplash.com/photo-1626618012641-bfbca5a3d239?q=80&w=800&auto=format&fit=crop', 
    'a1b2c3d4-0000-0000-0000-000000000004', 
    5.0
  ),
  (
    'Hoàng Tử Bé', 
    'Antoine de Saint-Exupéry', 
    'Một câu chuyện thiếu nhi đầy chất thơ và triết lý dành cho người lớn.', 
    65000, 
    120, 
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop', 
    'a1b2c3d4-0000-0000-0000-000000000004', 
    4.9
  ),
  (
    'Sức Mạnh Của Thói Quen', 
    'Charles Duhigg', 
    'Cách thói quen hình thành và cách chúng ta có thể thay đổi chúng để thành công.', 
    145000, 
    70, 
    'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=800&auto=format&fit=crop', 
    'a1b2c3d4-0000-0000-0000-000000000003', 
    4.5
  ),
  (
    'Tuổi Trẻ Đáng Giá Bao Nhiêu', 
    'Rosie Nguyễn', 
    'Những lời khuyên chân thành giúp bạn trẻ định hướng cuộc đời và tận dụng tuổi thanh xuân.', 
    82000, 
    90, 
    'https://images.unsplash.com/photo-1522881113454-e0c1f4e15640?q=80&w=800&auto=format&fit=crop', 
    'a1b2c3d4-0000-0000-0000-000000000003', 
    4.4
  );