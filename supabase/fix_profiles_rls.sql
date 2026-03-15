-- Fix: infinite recursion in profiles RLS policy
-- Run this in Supabase SQL Editor

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
  (auth.jwt() ->> 'role') = 'admin'
);
