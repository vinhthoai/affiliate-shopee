/** Cấu hình — ưu tiên biến môi trường (Vercel / .env.local), fallback khi không set */

const DEFAULT_AFFILIATE_ID = "17337630000";
const DEFAULT_FACEBOOK_POST_URL = "https://www.facebook.com";
const DEFAULT_ZALO_NOTIFY_GROUP_URL = "https://zalo.me";
const DEFAULT_ZALO_HELP_URL = "https://zalo.me";

/** Chỉ gọi từ server (vd. Route Handler). Không import trong `"use client"`. */
export function getAffiliateId(): string {
  const v = process.env.AFFILIATE_ID?.trim();
  return v || DEFAULT_AFFILIATE_ID;
}

export const FACEBOOK_POST_URL =
  process.env.FACEBOOK_POST_URL?.trim() || DEFAULT_FACEBOOK_POST_URL;

/** Nhóm Zalo thông báo lên mã */
export const ZALO_NOTIFY_GROUP_URL =
  process.env.ZALO_NOTIFY_GROUP_URL?.trim() || DEFAULT_ZALO_NOTIFY_GROUP_URL;

/** Link Zalo trợ giúp */
export const ZALO_HELP_URL =
  process.env.ZALO_HELP_URL?.trim() || DEFAULT_ZALO_HELP_URL;
