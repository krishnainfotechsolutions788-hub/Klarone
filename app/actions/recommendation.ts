"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitRecommendationRequest(formData: {
  name: string;
  email: string;
  phone?: string;
  budget: string;
  useCase: string;
  specialRequirements?: string;
}) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("recommendation_requests").insert({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      budget: formData.budget,
      use_case: formData.useCase,
      special_requirements: formData.specialRequirements || null,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return { success: false, error: "Failed to submit request. Please try again." };
    }

    // Optional: Send an email notification via Resend here if configured
    
    return { success: true };
  } catch (error) {
    console.error("Server action error:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
