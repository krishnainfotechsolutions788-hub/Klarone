import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { icecatId: string } }
) {
  const { icecatId } = await params;

  const ICECAT_BASE_URL = process.env.ICECAT_BASE_URL || "https://live.icecat.biz/api";
  const ICECAT_USERNAME = process.env.ICECAT_USERNAME;
  const ICECAT_API_TOKEN = process.env.ICECAT_API_TOKEN;
  
  if (!ICECAT_USERNAME || !ICECAT_API_TOKEN) {
    return NextResponse.json({ error: "Icecat credentials not configured" }, { status: 500 });
  }

  try {
    const url = new URL(ICECAT_BASE_URL);
    url.searchParams.append("lang", "en");
    url.searchParams.append("shopname", ICECAT_USERNAME);
    url.searchParams.append("icecat_id", icecatId);
    url.searchParams.append("content", "essentialinfo"); 

    const response = await fetch(url.toString(), {
      headers: {
        "api-token": ICECAT_API_TOKEN,
        ...(process.env.ICECAT_CONTENT_TOKEN && { "content-token": process.env.ICECAT_CONTENT_TOKEN })
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch from Icecat API" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ data: data.data || data });
  } catch (error: any) {
    console.error("Icecat Preview Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
