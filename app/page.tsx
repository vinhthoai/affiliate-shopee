"use client";

import { useState, useRef, useCallback } from "react";

import {
  FACEBOOK_POST_URL,
  ZALO_HELP_URL,
  ZALO_NOTIFY_GROUP_URL,
} from "@/lib/site-config";

export default function Home() {
  const [inputUrl, setInputUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    realUrl: string;
    affiliateUrl: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputUrl(text);
      setError("");
      setResult(null);
    } catch {
      textareaRef.current?.focus();
    }
  };

  const handleClear = () => {
    setInputUrl("");
    setError("");
    setResult(null);
    textareaRef.current?.focus();
  };

  const runConvert = useCallback(
    async () => {
      if (!inputUrl.trim()) {
        setError("Vui lòng nhập link Shopee");
        return;
      }

      setLoading(true);
      setError("");
      setResult(null);

      try {
        const res = await fetch("/api/convert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: inputUrl.trim() }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Có lỗi xảy ra");
          return;
        }

        setResult(data);
      } catch {
        setError("Lỗi kết nối. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    },
    [inputUrl],
  );

  const requestConvert = () => {
    if (!inputUrl.trim()) {
      setError("Vui lòng nhập link Shopee");
      return;
    }
    setError("");

    runConvert();
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const backToStep1 = () => {
    setResult(null);
    setCopied(false);
  };

  return (
    <div className="min-h-screen bg-[#fdf5f2] flex flex-col">
      <header className="w-full bg-[#ee4d2d] pt-6 pb-5 px-4 text-center">
        <div className="mx-auto max-w-lg flex items-center justify-center gap-3">
          <div>
            <h1 className="text-white text-xl font-extrabold leading-tight tracking-tight">
              ĐỔI LINK SHOPEE
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-lg mx-auto px-4 pt-5 pb-8">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              !result
                ? "bg-[#ee4d2d] text-white"
                : "bg-slate-200 text-slate-500"
            }`}
          >
            1 · Nhập link &amp; chuyển đổi
          </span>
          <span className="text-slate-300">→</span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              result ? "bg-[#ee4d2d] text-white" : "bg-slate-200 text-slate-500"
            }`}
          >
            2 · Sao chép &amp; mua
          </span>
        </div>

        {!result ? (
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 p-4">
            <div className="flex justify-end gap-2 mb-3 flex-wrap">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handlePaste}
                  className="flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-600 cursor-pointer select-none transition-all duration-150 active:scale-95 active:bg-blue-100 hover:shadow-sm"
                >
                  <span>📋</span> Dán link
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-200 px-4 py-2 text-sm font-medium text-slate-500 cursor-pointer select-none transition-all duration-150 active:scale-95 active:bg-slate-100 hover:shadow-sm"
                >
                  ✕ Xóa
                </button>
              </div>
            </div>

            <textarea
              ref={textareaRef}
              value={inputUrl}
              onChange={(e) => {
                setInputUrl(e.target.value);
                setError("");
              }}
              placeholder="Dán link Shopee vào đây và nhấn chuyển đổi..."
              rows={4}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition resize-none cursor-text placeholder:text-slate-400 focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
              style={{ fontSize: "16px" }}
            />

            {error && (
              <p className="mt-2 text-sm text-red-500 font-medium text-center">
                ❌ {error}
              </p>
            )}

            <button
              type="button"
              onClick={requestConvert}
              disabled={loading}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#ee4d2d] px-4 py-4 text-base font-extrabold text-white tracking-wide cursor-pointer select-none transition-all duration-150 active:scale-[0.97] active:brightness-90 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 shadow-lg shadow-[#ee4d2d]/25 hover:shadow-xl hover:shadow-[#ee4d2d]/30"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>ĐANG XỬ LÝ...</span>
                </>
              ) : (
                <span>CHUYỂN ĐỔI NGAY</span>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl border border-green-200 bg-green-50 p-4 animate-fade-in">
              <p className="text-xs font-semibold text-green-800 mb-1">
                Link affiliate
              </p>
              <p className="break-all rounded-lg bg-white px-3 py-2.5 text-xs font-medium text-green-700 border border-green-200 select-all">
                {result.affiliateUrl}
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(result.affiliateUrl)}
                  className={`flex items-center justify-center gap-2 rounded-full px-3 py-3.5 text-sm font-bold text-white cursor-pointer select-none transition-all duration-150 ${
                    copied
                      ? "bg-green-600 scale-[0.97]"
                      : "bg-green-500 active:scale-[0.97] active:brightness-90 shadow-lg shadow-green-200/50 hover:shadow-xl"
                  }`}
                >
                  {copied ? (
                    <>
                      <svg
                        className="h-4 w-4 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Đã chép</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-4 w-4 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      <span>Sao chép</span>
                    </>
                  )}
                </button>

                <a
                  href={result.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full bg-[#ee4d2d] px-3 py-3.5 text-sm font-bold text-white cursor-pointer select-none transition-all duration-150 active:scale-[0.97] active:brightness-90 shadow-lg shadow-[#ee4d2d]/25 hover:shadow-xl text-center"
                >
                  <span>🛒</span>
                  <span>Mua ngay</span>
                </a>
              </div>
            </div>

            <div className="rounded-2xl bg-blue-50 border border-blue-200 p-4">
              <p className="text-sm font-semibold text-blue-800 mb-2">
                Comment lên Facebook
              </p>
              <p className="text-xs text-blue-700 leading-relaxed mb-3">
                Sau khi sao chép link, mở bài viết bên dưới và dán link vào phần
                bình luận để áp dụng được mã giảm giá.
              </p>
              <a
                href={FACEBOOK_POST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1877F2] px-4 py-3.5 text-sm font-bold text-white cursor-pointer select-none transition-all duration-150 active:scale-[0.97] active:brightness-90 shadow-md shadow-blue-300/40 hover:shadow-lg"
              >
                <span>📘</span>
                <span>Mở bài viết để comment</span>
              </a>
            </div>

            <button
              type="button"
              onClick={backToStep1}
              className="w-full rounded-full border-2 border-slate-200 bg-white py-3 text-sm font-bold text-slate-600 cursor-pointer active:scale-[0.98] hover:bg-slate-50"
            >
              ← Chuyển đổi link khác
            </button>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-center text-base font-extrabold text-slate-700 mb-4">
            Liên hệ &amp; Trợ giúp
          </h2>

          <div className="space-y-3">
            <a
              href={ZALO_NOTIFY_GROUP_URL}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-500 px-4 py-3.5 text-sm font-bold text-white cursor-pointer select-none transition-all duration-150 active:scale-[0.97] active:brightness-90 shadow-md shadow-blue-200/50 hover:shadow-lg"
            >
              <span>💬</span>
              <span>Nhóm Zalo thông báo lên mã</span>
            </a>

            <a
              href={ZALO_HELP_URL}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-white border-2 border-blue-500 px-4 py-3.5 text-sm font-bold text-blue-600 cursor-pointer select-none transition-all duration-150 active:scale-[0.97] active:bg-blue-50 hover:shadow-md"
            >
              <span>🆘</span>
              <span>Trợ giúp</span>
            </a>
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-slate-100 py-4 text-center">
        <p className="text-xs text-slate-400">
          © 2026{" "}
          <span className="font-bold text-slate-500">
            HOANXU.VN - MUA SẮM &amp; HOÀN TIỀN
          </span>
        </p>
      </footer>

    </div>
  );
}
