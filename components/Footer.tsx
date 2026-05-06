"use client";

import Link from "next/link";
import Logo from "./Logo";
import { Linkedin, Facebook, Youtube, Instagram, Twitter } from "lucide-react";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

type SocialLinks = {
  linkedin?: string;
  facebook?: string;
  youtube?: string;
  instagram?: string;
  twitter?: string;
};

const SOCIAL_ICONS: { key: keyof SocialLinks; Icon: React.ElementType }[] = [
  { key: "linkedin", Icon: Linkedin },
  { key: "facebook", Icon: Facebook },
  { key: "youtube", Icon: Youtube },
  { key: "instagram", Icon: Instagram },
  { key: "twitter", Icon: Twitter },
];

export default function Footer() {
  const [social, setSocial] = useState<SocialLinks>({});

  useEffect(() => {
    apiGet<{ social?: SocialLinks }>("/settings/public")
      .then((d) => { if (d.social) setSocial(d.social); })
      .catch(() => {});
  }, []);

  const activeLinks = SOCIAL_ICONS.filter(({ key }) => !!social[key]);

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
            {activeLinks.length > 0
              ? activeLinks.map(({ key, Icon }) => (
                  <a
                    key={key}
                    href={social[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 border border-neutral-300 rounded flex items-center justify-center hover:border-black transition-colors"
                    aria-label={key}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))
              : SOCIAL_ICONS.map(({ key, Icon }) => (
                  <div key={key} className="w-8 h-8 border border-neutral-300 rounded flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                ))}
          </div>
        </div>

        <FooterCol title="Products" links={[["3D Models","/c/models"],["3D Scenes","/c/scenes"],["Textures","/c/textures"]]} />
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
