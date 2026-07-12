CREATE OR REPLACE FUNCTION search_admin_products(search_query text)
RETURNS SETOF product_models AS $$
BEGIN
  -- If search is empty, return all
  IF trim(search_query) = '' THEN
    RETURN QUERY SELECT * FROM product_models;
  END IF;

  RETURN QUERY
  SELECT pm.*
  FROM product_models pm
  LEFT JOIN brands b ON pm.brand_id = b.id
  LEFT JOIN categories c ON pm.category_id = c.id
  WHERE 
    pm.name ILIKE '%' || search_query || '%' OR
    pm.code ILIKE '%' || search_query || '%' OR
    b.name ILIKE '%' || search_query || '%' OR
    c.name ILIKE '%' || search_query || '%' OR
    (b.name || ' ' || pm.name) ILIKE '%' || search_query || '%';
END;
$$ LANGUAGE plpgsql;
