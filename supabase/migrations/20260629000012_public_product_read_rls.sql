-- Enable anonymous read access to public product data
CREATE POLICY "Allow anonymous read access on product_models" ON public.product_models FOR SELECT TO anon USING (status = 'active');
CREATE POLICY "Allow anonymous read access on product_variants" ON public.product_variants FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous read access on product_images" ON public.product_images FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous read access on inventory_units" ON public.inventory_units FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous read access on brands" ON public.brands FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous read access on series" ON public.series FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous read access on categories" ON public.categories FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous read access on variant_attribute_values" ON public.variant_attribute_values FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous read access on attributes" ON public.attributes FOR SELECT TO anon USING (true);
