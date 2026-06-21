import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

import { getAffiliateId } from "@/lib/site-config";

function buildAffiliateLink(
  baseUrl: string,
  affiliateId: string,
): string {
  const encodedUrl = encodeURIComponent(baseUrl);
  return `https://s.shopee.vn/an_redir?origin_link=${encodedUrl}&affiliate_id=${affiliateId}&sub_id=-----`;
}

function normalizeInputUrl(raw: string): string {
  const trimmed = (raw || "").trim();
  if (!trimmed) throw new Error("Vui lòng nhập link Shopee");
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawUrl: string = body.url;

    if (!rawUrl || !rawUrl.trim()) {
      return NextResponse.json(
        { error: "Vui lòng nhập link Shopee" },
        { status: 400 },
      );
    }

    const url = normalizeInputUrl(rawUrl);

    let realUrl: string;

    try {
      const response = await axios.get(url, {
        maxRedirects: 0,
        validateStatus: (status) => status >= 200 && status < 400,
      });

      const redirectUrl = response.headers["location"];
      const finalUrl = redirectUrl || url;
      const parsed = new URL(finalUrl);

      if (!parsed.hostname.includes("shopee.vn")) {
        return NextResponse.json(
          { error: "Không lấy được link sản phẩm. Kiểm tra lại URL." },
          { status: 400 },
        );
      }

      realUrl = `https://shopee.vn${parsed.pathname}`;
    } catch {
      return NextResponse.json(
        { error: "Không lấy được link sản phẩm. Kiểm tra lại URL." },
        { status: 400 },
      );
    }

    const affiliateUrl = buildAffiliateLink(
      realUrl.replace("opaanlp", "product"),
      getAffiliateId(),
    );

    return NextResponse.json({
      realUrl: realUrl.replace("opaanlp", "product"),
      affiliateUrl,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Có lỗi xảy ra";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
