-- Migration: Recommendation Requests Table

CREATE TABLE public.recommendation_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    budget TEXT NOT NULL,
    use_case TEXT NOT NULL,
    special_requirements TEXT,
    status TEXT CHECK (status IN ('new', 'reviewed', 'contacted', 'closed')) DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.recommendation_requests ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert new requests (lead generation form)
CREATE POLICY "Allow public insert on recommendation_requests" ON public.recommendation_requests FOR INSERT WITH CHECK (true);

-- Allow authenticated admins to perform all operations
CREATE POLICY "Allow authenticated full access on recommendation_requests" ON public.recommendation_requests FOR ALL TO authenticated USING (true);
