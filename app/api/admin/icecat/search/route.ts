import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q"); // Could be GTIN or ProductCode
  const brand = searchParams.get("brand");

  if (!q) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
  }

  const ICECAT_BASE_URL = process.env.ICECAT_BASE_URL || "https://live.icecat.biz/api";
  const ICECAT_USERNAME = process.env.ICECAT_USERNAME;
  const ICECAT_API_TOKEN = process.env.ICECAT_API_TOKEN;
  
  if (!ICECAT_USERNAME || !ICECAT_API_TOKEN) {
    return NextResponse.json({ error: "Icecat credentials not configured" }, { status: 500 });
  }

  try {
    // Construct Icecat API URL
    // According to docs, requires lang, shopname, and identifier (GTIN, or ProductCode+Brand)
    const url = new URL(ICECAT_BASE_URL);
    url.searchParams.append("lang", "en");
    url.searchParams.append("shopname", ICECAT_USERNAME);
    url.searchParams.append("content", "essentialinfo"); // Lightweight preview

    // Simple heuristic: If it's a number and 12-14 digits, it's likely a GTIN.
    // Otherwise, assume it's a ProductCode, but that requires a Brand.
    if (/^\d{12,14}$/.test(q)) {
      url.searchParams.append("GTIN", q);
    } else if (brand) {
      url.searchParams.append("Brand", brand);
      url.searchParams.append("ProductCode", q);
    } else {
      url.searchParams.append("ProductCode", q); // Might fail without brand, but we pass it anyway
    }

    const response = await fetch(url.toString(), {
      headers: {
        "api-token": ICECAT_API_TOKEN,
        ...(process.env.ICECAT_CONTENT_TOKEN && { "content-token": process.env.ICECAT_CONTENT_TOKEN })
      },
    });

    if (!response.ok) {
      // Icecat often returns 400 or 404 with a JSON body explaining why
      try {
        const errorData = await response.json();
        return NextResponse.json({ error: errorData.Message || errorData.message || "Product not found in Icecat" }, { status: response.status });
      } catch (e) {
        return NextResponse.json({ error: "Failed to fetch from Icecat API" }, { status: response.status });
      }
    }

    const data = await response.json();
    
    // Check if Icecat returned a valid product or an error message (Icecat returns 200 with error objects sometimes)
    if (data.statusCode === 4 || data.msg === "OK") {
       return NextResponse.json({ data: data.data || data });
    } else {
       return NextResponse.json({ error: data.message || "Product not found on Icecat" }, { status: 404 });
    }
  } catch (error: any) {
    console.error("Icecat Search Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
