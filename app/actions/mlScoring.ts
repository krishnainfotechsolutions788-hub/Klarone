"use server";

import { estimateLaptopScoresAndValue, fetchMLRecommendations, LaptopRawSpecs } from "@/lib/services/mlModelService";

export async function calculateMLScoresAction(specs: {
  brand?: string;
  cpu?: string;
  gpu?: string;
  ram?: string;
  storage?: string;
  display?: string;
  msrp?: number;
}) {
  const ramGb = specs.ram ? parseInt(specs.ram.match(/(\d+)/)?.[1] || "8", 10) : 8;
  const ssdGb = specs.storage ? parseInt(specs.storage.match(/(\d+)/)?.[1] || "512", 10) : 512;

  const rawSpecs: Partial<LaptopRawSpecs> = {
    brand: specs.brand || "Laptop",
    processor_name: specs.cpu || "Intel Core i5",
    graphics: specs.gpu || "Integrated Graphics",
    "ram(GB)": ramGb,
    "ssd(GB)": ssdGb,
    "Operating System": "Windows 11",
    "resolution (pixels)": specs.display || "1920x1080",
  };

  const result = await estimateLaptopScoresAndValue(rawSpecs);

  if (result) {
    return {
      success: true,
      scores: {
        gaming: result.gaming_score,
        student: result.student_score,
        business: result.business_score,
        predictedPrice: result.predicted_price,
      },
    };
  }

  return {
    success: false,
    error: "ML service unavaliable",
  };
}

import { createAdminClient } from "@/lib/supabase/admin";

export async function getDynamicSuggestionsAction() {
  try {
    const supabase = createAdminClient();
    
    // Fetch products from master catalog and laptops table
    const { data: dbMasters } = await supabase
      .from('kc_master_products')
      .select('model, msrp, kc_brands(name)')
      .limit(10);

    const { data: dbLaptops } = await supabase
      .from('kc_laptops')
      .select('model, msrp, kc_brands(name)')
      .limit(10);

    const allItems: { brand: string; model: string; price: number }[] = [];

    if (dbMasters && dbMasters.length > 0) {
      dbMasters.forEach((m: any) => {
        allItems.push({
          brand: m.kc_brands?.name || "Laptop",
          model: m.model || "Pro",
          price: Number(m.msrp || 60000),
        });
      });
    }

    if (dbLaptops && dbLaptops.length > 0) {
      dbLaptops.forEach((l: any) => {
        allItems.push({
          brand: l.kc_brands?.name || "Laptop",
          model: l.model || "Ultra",
          price: Number(l.msrp || 55000),
        });
      });
    }

    if (allItems.length > 0) {
      // Build dynamic suggestion prompts based on real database products
      const dynamicSuggestions = [
        {
          text: `Best laptop under ₹${allItems[0].price.toLocaleString('en-IN')}: ${allItems[0].brand} ${allItems[0].model}`,
          category: "budget"
        },
        ...(allItems[1] ? [{
          text: `${allItems[1].brand} ${allItems[1].model} for Coding & Software Development`,
          category: "coding"
        }] : []),
        ...(allItems[2] ? [{
          text: `Compare ${allItems[0].brand} vs ${allItems[2].brand} for Indian B.Tech Students`,
          category: "student"
        }] : []),
        ...(allItems[3] ? [{
          text: `High performance ${allItems[3].brand} ${allItems[3].model} under ₹${allItems[3].price.toLocaleString('en-IN')}`,
          category: "performance"
        }] : []),
        {
          text: `Top rated coding & business laptop with doorstep warranty in India`,
          category: "warranty"
        },
        {
          text: `Lightweight ultrabook for college with 10+ hr battery life`,
          category: "battery"
        }
      ];

      return { success: true, suggestions: dynamicSuggestions };
    }
  } catch (err) {
    console.error("Failed to fetch dynamic suggestions from DB:", err);
  }

  // Smart fallback dynamic prompts based on Indian market catalog
  return {
    success: true,
    suggestions: [
      { text: "Best laptop for B.Tech CSE coding under ₹60,000", category: "coding" },
      { text: "Lightweight student laptop with 10+ hr battery life", category: "battery" },
      { text: "Video editing & YouTube content creation laptop under ₹80,000", category: "creators" },
      { text: "MacBook Air M2 vs Lenovo ThinkPad for software developers", category: "compare" },
      { text: "Gaming & ML laptop with RTX graphics under ₹75,000", category: "gaming" },
      { text: "Best business laptop with doorstep onsite warranty in India", category: "business" },
    ]
  };
}

export async function getMLRecommendationsAction(query: string, customLaptops?: any[]) {
  try {
    let laptopsToEvaluate = customLaptops;
    let rawDbProducts: any[] = [];

    // If custom laptops list is not explicitly passed, query dynamic catalog from Supabase
    if (!laptopsToEvaluate || laptopsToEvaluate.length === 0) {
      const supabase = createAdminClient();

      // Query 1: Master products with variants & intelligence
      const { data: dbProducts } = await supabase
        .from('kc_master_products')
        .select(`
          id, model, msrp, official_images,
          kc_brands(name),
          kc_variants (
            id, cpu, gpu, ram, storage, display, msrp,
            kc_intelligence (
              gaming_score, student_score, business_score, programming_score
            )
          )
        `)
        .limit(30);

      // Query 2: Laptops table
      const { data: dbLaptops } = await supabase
        .from('kc_laptops')
        .select(`
          id, model, msrp, cpu, gpu, ram, storage, display, battery,
          gaming_score, student_score, business_score, programming_score,
          kc_brands(name)
        `)
        .limit(30);

      if (dbProducts && dbProducts.length > 0) {
        dbProducts.forEach((p: any) => {
          const v = p.kc_variants?.[0] || {};
          const intel = v.kc_intelligence?.[0] || {};
          rawDbProducts.push({
            model_name: `${p.kc_brands?.name || ''} ${p.model}`,
            brand: p.kc_brands?.name || 'Generic',
            price: Number(v.msrp || p.msrp || 60000),
            processor_name: v.cpu || 'Intel Core i5',
            graphics: v.gpu || 'Integrated Graphics',
            ram_gb: parseInt(v.ram || '8', 10) || 8,
            ssd_gb: parseInt(v.storage || '512', 10) || 512,
            display: v.display || '15.6" FHD',
            gaming_score: intel.gaming_score || 70,
            student_score: intel.student_score || 80,
            business_score: intel.business_score || 75,
            programming_score: intel.programming_score || 85,
            official_images: p.official_images || []
          });
        });
      }

      if (dbLaptops && dbLaptops.length > 0) {
        dbLaptops.forEach((l: any) => {
          rawDbProducts.push({
            model_name: `${l.kc_brands?.name || ''} ${l.model}`,
            brand: l.kc_brands?.name || 'Generic',
            price: Number(l.msrp || 55000),
            processor_name: l.cpu || 'Intel Core i5',
            graphics: l.gpu || 'Integrated Graphics',
            ram_gb: parseInt(l.ram || '8', 10) || 8,
            ssd_gb: parseInt(l.storage || '512', 10) || 512,
            display: l.display || '14" FHD',
            gaming_score: l.gaming_score || 70,
            student_score: l.student_score || 80,
            business_score: l.business_score || 75,
            programming_score: l.programming_score || 85,
            official_images: []
          });
        });
      }

      laptopsToEvaluate = rawDbProducts;
    }

    // Try calling external Python ML recommendation service
    let recommendations = await fetchMLRecommendations(query, laptopsToEvaluate);

    // If external Python ML server is offline or returned empty, execute dynamic in-memory scoring engine
    if (!recommendations || recommendations.length === 0) {
      const qLower = query.toLowerCase();
      
      // Determine query intent flags
      const isCoding = qLower.includes("coding") || qLower.includes("developer") || qLower.includes("software") || qLower.includes("b.tech");
      const isGaming = qLower.includes("gaming") || qLower.includes("rtx") || qLower.includes("rendering") || qLower.includes("gpu");
      const isStudent = qLower.includes("student") || qLower.includes("college") || qLower.includes("academic");
      const isBusiness = qLower.includes("business") || qLower.includes("corporate") || qLower.includes("office");

      // Extract target budget if specified in query
      let targetBudget = 1000000;
      const matchUnder = qLower.match(/(?:under|below|budget|within|upto|up to)\s*(?:₹|rs\.?|inr)?\s*(\d+)(?:k|,000)?/i);
      if (matchUnder) {
        let val = parseInt(matchUnder[1], 10);
        if (val < 1000) val = val * 1000; // e.g. 60k -> 60000
        targetBudget = val;
      }

      const list = laptopsToEvaluate && laptopsToEvaluate.length > 0 ? laptopsToEvaluate : [
        {
          model_name: "Lenovo ThinkPad E14 Gen 5",
          brand: "Lenovo",
          price: 64990,
          processor_name: "Intel Core i5-1335U",
          graphics: "Intel Iris Xe",
          ram_gb: 16,
          ssd_gb: 512,
          display: "14\" FHD IPS",
          gaming_score: 65,
          student_score: 92,
          business_score: 95,
          programming_score: 96,
          official_images: ["/top/top2.webp"]
        },
        {
          model_name: "Apple MacBook Air M2",
          brand: "Apple",
          price: 89900,
          processor_name: "Apple M2 Chip",
          graphics: "8-Core GPU",
          ram_gb: 8,
          ssd_gb: 512,
          display: "13.6\" Liquid Retina",
          gaming_score: 60,
          student_score: 96,
          business_score: 94,
          programming_score: 98,
          official_images: ["/top/top1.webp"]
        },
        {
          model_name: "ASUS Vivobook S 15 OLED",
          brand: "ASUS",
          price: 72990,
          processor_name: "Intel Core i5-13500H",
          graphics: "Intel Iris Xe",
          ram_gb: 16,
          ssd_gb: 512,
          display: "15.6\" 2.8K 120Hz OLED",
          gaming_score: 75,
          student_score: 90,
          business_score: 88,
          programming_score: 91,
          official_images: ["/top/top3.webp"]
        },
        {
          model_name: "HP Victus Gaming 15",
          brand: "HP",
          price: 58990,
          processor_name: "AMD Ryzen 5 7535HS",
          graphics: "NVIDIA RTX 2050 4GB",
          ram_gb: 16,
          ssd_gb: 512,
          display: "15.6\" 144Hz FHD",
          gaming_score: 88,
          student_score: 85,
          business_score: 70,
          programming_score: 84,
          official_images: ["/top/top4.webp"]
        }
      ];

      // Calculate dynamic match scores
      const scored = list.map((laptop: any) => {
        let score = 75; // base score

        if (isCoding) score += (laptop.programming_score || 80) * 0.2;
        if (isGaming) score += (laptop.gaming_score || 70) * 0.2;
        if (isStudent) score += (laptop.student_score || 80) * 0.2;
        if (isBusiness) score += (laptop.business_score || 75) * 0.2;

        // Budget match bonus/penalty
        if (laptop.price <= targetBudget) {
          score += 10;
        } else {
          score -= Math.min(25, ((laptop.price - targetBudget) / targetBudget) * 30);
        }

        // Clamp final match score between 82% and 98%
        const finalScore = Math.min(98, Math.max(82, Math.round(score)));

        // Generate dynamic reasons
        const reasons: string[] = [];
        if (isCoding || laptop.programming_score >= 90) {
          reasons.push(`High programming score (${laptop.programming_score || 90}/100) with ${laptop.processor_name}`);
        }
        if (laptop.ram_gb >= 16) {
          reasons.push(`${laptop.ram_gb}GB RAM for seamless multitasking & compiling`);
        }
        if (laptop.price <= targetBudget) {
          reasons.push(`Fits well within your target budget of ₹${laptop.price.toLocaleString('en-IN')}`);
        } else {
          reasons.push(`Official brand warranty and high resale value in India`);
        }

        // Dynamic badges
        let badge = "Top Recommendation";
        if (isCoding) badge = "Best for Coding";
        else if (isGaming || laptop.gaming_score >= 85) badge = "Highest Performance";
        else if (laptop.price < 60000) badge = "Best Student Value";
        else if (laptop.brand === "Apple" || laptop.brand === "Dell") badge = "Premium Choice";

        const rawImg = laptop.official_images && laptop.official_images[0];
        let image = "/top/top1.webp";
        if (typeof rawImg === 'string' && (rawImg.startsWith('http') || rawImg.startsWith('/'))) {
          image = rawImg;
        } else if (rawImg && typeof rawImg === 'object') {
          image = rawImg.url || rawImg.src || rawImg.path || "/top/top1.webp";
        } else if (laptop.brand === "Apple") {
          image = "/top/top1.webp";
        } else if (laptop.brand === "Lenovo") {
          image = "/top/top2.webp";
        } else if (laptop.brand === "ASUS") {
          image = "/top/top3.webp";
        } else if (laptop.brand === "HP") {
          image = "/top/top4.webp";
        }

        return {
          model_name: laptop.model_name,
          actual_price: laptop.price,
          recommendation_score: finalScore,
          gaming_score: laptop.gaming_score || 70,
          student_score: laptop.student_score || 85,
          business_score: laptop.business_score || 80,
          reason: reasons.join(". "),
          reasons: reasons,
          image: image,
          badge: badge,
          specs: [
            laptop.processor_name,
            `${laptop.ram_gb}GB RAM`,
            `${laptop.ssd_gb}GB SSD`,
            laptop.display || "FHD Display"
          ]
        };
      });

      // Sort by recommendation score descending
      recommendations = scored.sort((a, b) => b.recommendation_score - a.recommendation_score).slice(0, 4);
    }

    return {
      success: recommendations.length > 0,
      recommendations,
    };
  } catch (err: any) {
    console.error("Failed to generate dynamic recommendations:", err);
    return {
      success: false,
      recommendations: [],
    };
  }
}

