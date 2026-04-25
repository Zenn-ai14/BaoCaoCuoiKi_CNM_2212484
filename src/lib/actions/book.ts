"use server";

import { createClient } from "@/lib/supabase/server";
import { Book } from "@/types";

/**
 * Lấy 5 sách (sản phẩm) mới nhất từ bảng books.
 * Sử dụng unstable_cache của Next.js hoặc fetch với revalidate để hỗ trợ ISR
 * nếu không dùng trực tiếp query của supabase-js, hoặc dùng cấu hình của Next.js.
 */
export async function getLatestBooks(): Promise<Book[]> {
  const supabase = createClient();
  
  const { data: books, error } = await (await supabase)
    .from("books")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching latest books:", error);
    return [];
  }

  return books as Book[];
}

/**
 * Tìm kiếm sách nhanh cho mục đề xuất (Live Search)
 */
export async function searchBooks(query: string): Promise<Book[]> {
  if (!query || query.length < 2) return [];

  const supabase = createClient();
  
  const { data: books, error } = await (await supabase)
    .from("books")
    .select("id, title, author, price, cover_image_url")
    // Tìm kiếm không phân biệt dấu (nếu bạn đã chạy migration unaccent trước đó)
    .or(`title.ilike.%${query}%,author.ilike.%${query}%,search_title_unaccented.ilike.%${query}%,search_author_unaccented.ilike.%${query}%`)
    .limit(5);

  if (error) {
    console.error("Error searching books:", error);
    return [];
  }

  return books as Book[];
}
