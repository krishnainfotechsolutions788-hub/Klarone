"use server";

import { createClient } from "@/lib/supabase/server";

export async function fetchAdminCustomers(page: number, pageSize: number) {
  const supabase = await createClient();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Call the secure RPC function to get all customers with their stats
  const { data: customers, error, count } = await supabase
    .rpc("get_admin_customers", {}, { count: 'exact' })
    .range(from, to);

  if (error) {
    console.error("Error fetching admin customers:", error);
    throw new Error("Failed to fetch customers");
  }

  return { customers, totalCount: count || 0 };
}
