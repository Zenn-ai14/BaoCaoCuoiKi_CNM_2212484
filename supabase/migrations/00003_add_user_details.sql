-- Add address and phone to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;
