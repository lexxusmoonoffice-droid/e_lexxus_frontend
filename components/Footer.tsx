"use client";

import Link from "next/link";
import Logo from "./Logo";
import { 
  Linkedin, Facebook, Youtube, Instagram, Twitter, 
  Github, MessageCircle, Globe 
} from "lucide-react";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { useCategories } from "@/lib/hooks";
import type { ApiSocialLink } from "@/lib/types";

function getSocialIcon(key: string) {
  const k = key.toLowerCase();
  if (k.includes("linkedin")) return Linkedin;
  if (k.includes("facebook")) return Facebook;
  if (k.includes("youtube")) return Youtube;
  if (k.includes("instagram")) return Instagram;
  if (k.includes("twitter") || k.includes("x.com")) return Twitter;
  if (k.includes("github")) return Github;
  if (k.includes("discord") || k.includes("whatsapp") || k.includes("slack")) return MessageCircle;
  return Globe;
}

const DEFAULT_PLATFORMS = ["linkedin", "facebook", "youtube", "instagram", "twitter"];

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState<ApiSocialLink[]>([]);
  const { data: categoriesData } = useCategories();

  useEffect(() => {
    apiGet<{ links: ApiSocialLink[] }>("/social-links")
      .then((d) => { if (d.links) setSocialLinks(d.links); })
      .catch(() => {});
  }, []);

  // Top-level categories (getTree returns root-level items with children nested)
  const categoryLinks: [string, string][] = (categoriesData?.data || [])
    .map((c) => [c.name, `/c/${c.slug}`] as [string, string]);

  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 mt-24">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-14 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <Logo />
          <p className="text-sm text-neutral-600 mt-4 max-w-sm">
            Premium 3D models of world-famous brands for your designs. Contact brands directly and
            bring your ideas to life easily with Lexxus.
          </p>
          <div className="flex gap-2 mt-5">
            {socialLinks.length > 0
              ? socialLinks.map((link) => {
                  const Icon = getSocialIcon(link.platform);
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 border border-neutral-300 rounded flex items-center justify-center hover:border-black hover:text-black text-neutral-500 bg-white transition-all shadow-sm"
                      aria-label={link.platform}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })
              : DEFAULT_PLATFORMS.map((key) => {
                  const Icon = getSocialIcon(key);
                  return (
                    <div key={key} className="w-8 h-8 border border-neutral-300 rounded flex items-center justify-center opacity-30">
                      <Icon className="w-4 h-4" />
                    </div>
                  );
                })}
          </div>
        </div>

        <FooterCol
          title="Products"
          links={
            categoryLinks.length > 0
              ? categoryLinks
              : [["3D Models", "/c/models"], ["3D Scenes", "/c/scenes"], ["Textures", "/c/textures"]]
          }
        />
        <FooterCol title="Company" links={[["About us","/about"],["Blog","/blog"],["Statistics","/statistics"],["Portfolio","/portfolio"]]} />
        <FooterCol title="Support" links={[["FAQ","/faq"],["Feedback","/feedback"],["Privacy Policy","/privacy"],["Terms of Service","/terms"],["License Terms","/license"]]} />
      </div>

      <div className="border-t border-neutral-200">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-5 text-xs text-neutral-500 flex flex-col md:flex-row justify-between items-center gap-3">
          <span>© 2026 Owned by Lexxus LLC. All rights reserved.</span>
          <div className="flex gap-3 text-neutral-400">
            <span>VISA</span><span>Mastercard</span><span>UPI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="font-semibold text-sm mb-4">{title}</h4>
      <ul className="space-y-2 text-sm text-neutral-600">
        {links.map(([l, h]) => (
          <li key={l}><Link href={h} className="hover:text-black">{l}</Link></li>
        ))}
      </ul>
    </div>
  );
}
