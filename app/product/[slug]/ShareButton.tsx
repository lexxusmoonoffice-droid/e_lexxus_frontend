"use client";

import React, { useState, useEffect } from "react";
import { Share2, X, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

interface ShareButtonProps {
  productName?: string;
}

export default function ShareButton({ productName = "Lexxus Product" }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, [isOpen]);

  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy link:", err);
        toast.error("Could not copy link");
      });
  };

  const platforms = [
    {
      name: "WhatsApp",
      color: "bg-[#25D366] hover:bg-[#20ba59]",
      icon: (
        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(productName + " - " + shareUrl)}`,
    },
    {
      name: "X / Twitter",
      color: "bg-[#0F1419] hover:bg-[#20252a]",
      icon: (
        <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(productName)}`,
    },
    {
      name: "Facebook",
      color: "bg-[#1877F2] hover:bg-[#166fe3]",
      icon: (
        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Pinterest",
      color: "bg-[#BD081C] hover:bg-[#ab0718]",
      icon: (
        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.4 7.63 11.2-.1-.9-.2-2.4 0-3.4l1.4-6c-.2-.6-.4-1.4-.4-2.2 0-2.1 1.2-3.6 2.7-3.6 1.3 0 1.9.9 1.9 2.1 0 1.3-.8 3.2-1.2 5-.4 1.6.8 2.9 2.4 2.9 2.9 0 5.1-3 5.1-7.4 0-3.9-2.8-6.6-6.8-6.6-4.6 0-7.3 3.5-7.3 7.1 0 1.4.5 2.9 1.2 3.7.1.1.1.3 0 .4l-.4 1.8c-.1.3-.2.4-.5.3-1.8-.9-2.8-3.6-2.8-5.7 0-6.2 4.5-12 13.1-12 6.9 0 12.3 4.9 12.3 11.5 0 6.9-4.3 12.4-10.4 12.4-2 0-4-1-4.7-2.3L8 23.6c-.6 2.3-2.1 5.2-3.1 6.8 1.1.3 2.3.5 3.5.5 6.6 0 12-5.4 12-12C24 5.37 18.63 0 12 0z" />
        </svg>
      ),
      href: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(productName)}`,
    },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-1.5 text-neutral-500 hover:text-black hover:bg-neutral-50 rounded-full transition flex items-center justify-center"
        aria-label="Share product"
        title="Share"
      >
        <Share2 className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          {/* Modal box */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative border border-neutral-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-800">Share this product</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-black hover:bg-neutral-100 p-1 rounded-full transition"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Social Share grid */}
            <div className="grid grid-cols-4 gap-3 my-6">
              {platforms.map((p) => (
                <a
                  key={p.name}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={`w-11 h-11 rounded-full ${p.color} transition flex items-center justify-center shadow-sm group-hover:scale-105 duration-200`}>
                    {p.icon}
                  </div>
                  <span className="text-[11px] font-medium text-neutral-500 group-hover:text-black transition">
                    {p.name}
                  </span>
                </a>
              ))}
            </div>

            {/* Copy Link container */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-1.5 flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent border-none outline-none text-xs text-neutral-600 px-2 truncate"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <button
                onClick={handleCopy}
                className="bg-black text-white hover:bg-neutral-800 text-xs px-3.5 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
