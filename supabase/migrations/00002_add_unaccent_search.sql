-- Migration to support accent-insensitive search (Fixed for Immutability)
-- Run this in your Supabase SQL Editor

-- 1. Enable unaccent extension
CREATE EXTENSION IF NOT EXISTS unaccent;

-- 2. Create an immutable wrapper for unaccent
-- PostgreSQL requires IMMUTABLE functions for generated columns
CREATE OR REPLACE FUNCTION public.immutable_unaccent(text)
RETURNS text AS $$
BEGIN
    RETURN unaccent($1);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 3. Add generated columns for unaccented search
ALTER TABLE public.books 
ADD COLUMN IF NOT EXISTS search_title_unaccented TEXT 
GENERATED ALWAYS AS (public.immutable_unaccent(title)) STORED;

ALTER TABLE public.books 
ADD COLUMN IF NOT EXISTS search_author_unaccented TEXT 
GENERATED ALWAYS AS (public.immutable_unaccent(author)) STORED;

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_books_title_unaccented ON public.books (search_title_unaccented);
CREATE INDEX IF NOT EXISTS idx_books_author_unaccented ON public.books (search_author_unaccented);
