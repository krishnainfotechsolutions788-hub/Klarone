import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { icecatId, q, brand } = body;

    if (!icecatId && !q) {
      return NextResponse.json({ error: "icecatId or query (q) is required" }, { status: 400 });
    }

    const ICECAT_BASE_URL = process.env.ICECAT_BASE_URL || "https://live.icecat.biz/api";
    const ICECAT_USERNAME = process.env.ICECAT_USERNAME;
    const ICECAT_API_TOKEN = process.env.ICECAT_API_TOKEN;
    
    if (!ICECAT_USERNAME || !ICECAT_API_TOKEN) {
      return NextResponse.json({ error: "Icecat credentials not configured" }, { status: 500 });
    }

    const url = new URL(ICECAT_BASE_URL);
    url.searchParams.append("lang", "en");
    url.searchParams.append("shopname", ICECAT_USERNAME);
    
    if (icecatId) {
      url.searchParams.append("icecat_id", icecatId);
    } else if (/^\d{12,14}$/.test(q)) {
      url.searchParams.append("GTIN", q);
    } else {
      url.searchParams.append("ProductCode", q);
      if (brand) {
        url.searchParams.append("Brand", brand);
      } else {
        return NextResponse.json({ error: "Icecat requires a Brand name when importing by Product Code. Please return to the search page and specify the Brand." }, { status: 400 });
      }
    }
    // content param omitted to get the full datasheet

    const response = await fetch(url.toString(), {
      headers: {
        "api-token": ICECAT_API_TOKEN,
        ...(process.env.ICECAT_CONTENT_TOKEN && { "content-token": process.env.ICECAT_CONTENT_TOKEN })
      },
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        return NextResponse.json({ error: errorData.Message || errorData.message || "Failed to fetch full product from Icecat API" }, { status: response.status });
      } catch (e) {
        return NextResponse.json({ error: "Failed to fetch full product from Icecat API" }, { status: response.status });
      }
    }

    const data = await response.json();
    
    // In a real production app, we would map `data` to `kc_master_products` and `kc_variants` here
    // and insert it into Supabase as a Draft. For V1, we will return the full mapped payload 
    // to the frontend so the Admin can review it before calling the save action.
    
    return NextResponse.json({ data: data.data || data });
  } catch (error: any) {
    console.error("Icecat Import Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
