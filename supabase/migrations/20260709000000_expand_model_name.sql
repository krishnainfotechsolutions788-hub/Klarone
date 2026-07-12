-- Migration: Expand model name column to allow long product names without truncation

ALTER TABLE public.kc_master_products ALTER COLUMN model TYPE TEXT;
