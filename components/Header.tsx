"use client";
import Link from "next/link";
import { Search, ShoppingBag, Heart, Menu, X, User, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Logo from "./Logo";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { useAuth } from "@/lib/auth";
import { useCategoriesWithPreviews } from "@/lib/hooks";
import CartDrawer from "./CartDrawer";
import WishlistDrawer from "./WishlistDrawer";
import type { ApiCategory, ApiProductPreview } from "@/lib/types";

const STATIC_NAV = [{ name: "Bundles", href: "/bundles" }];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { items: cartItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user } = useAuth();
  const { data: categoriesData } = useCategoriesWithPreviews();
  const router = useRouter();
  const pathname = usePathname();

  const topCategories = categoriesData?.data || [];
  const firstCatHref = topCategories[0] ? `/c/${topCategories[0].slug}` : "/c/models";

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = query.trim();
    if (q) router.push(`${firstCatHref}?q=${encodeURIComponent(q)}`);
  };

  function openCart() {
    if (!user) { router.push("/login?next=/cart"); return; }
    setCartOpen(true); setWishlistOpen(false);
  }

  function openWishlist() {
    if (!user) { router.push("/login?next=/account/wishlist"); return; }
    setWishlistOpen(true); setCartOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-4 flex items-center gap-4">
          <Logo />

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-auto relative">
            <div className="flex items-center w-full bg-neutral-100 px-5 py-2.5">
              <Search className="w-4 h-4 text-neutral-500 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What are you looking for?"
                className="flex-1 bg-transparent outline-none text-sm ml-3"
              />
              <button type="submit" className="bg-black text-white px-4 py-1.5 text-xs font-medium">
                Search
              </button>
            </div>
          </form>

          <div className="hidden md:flex items-center gap-3 text-sm">
            <button onClick={openWishlist} className="relative p-1 hover:opacity-70 transition" aria-label="Wishlist">
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </button>
            <button onClick={openCart} className="relative p-1 hover:opacity-70 transition" aria-label="Cart">
              <ShoppingBag className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
            {user ? (
              <Link href="/account" className="inline-flex items-center gap-1.5 border border-neutral-300 px-3 py-1.5 text-xs hover:border-black">
                <User className="w-3.5 h-3.5" /> {user.name.split(" ")[0]}
              </Link>
            ) : (
              <Link href="/login" className="border border-neutral-300 text-xs px-4 py-1.5 hover:border-black">
                Sign in
              </Link>
            )}
          </div>

          <button className="md:hidden ml-auto" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Desktop nav with mega-menu */}
        <nav className="hidden md:block border-t border-neutral-200">
          <ul className="max-w-[1400px] mx-auto px-4 lg:px-8 flex gap-7 text-sm py-3">
            {topCategories.map((cat) => {
              const active = pathname === `/c/${cat.slug}` || pathname.startsWith(`/c/${cat.slug}/`);
              return (
                <MegaMenuItem key={cat.id} cat={cat} active={active} />
              );
            })}
            {STATIC_NAV.map((c) => {
              const active = pathname === c.href || pathname.startsWith(c.href + "/");
              return (
                <li key={c.name}>
                  <Link
                    href={c.href}
                    className={`relative pb-3 transition ${active ? "text-black font-medium" : "text-neutral-600 hover:text-black"}`}
                  >
                    {c.name}
                    {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <MobileMenu
            categories={topCategories}
            staticNav={STATIC_NAV}
            cartCount={cartItems.length}
            wishlistCount={wishlistItems.length}
            user={user}
            query={query}
            setQuery={setQuery}
            onSearch={() => { handleSearch(); setMobileOpen(false); }}
            onCart={() => { setMobileOpen(false); openCart(); }}
            onWishlist={() => { setMobileOpen(false); openWishlist(); }}
            onClose={() => setMobileOpen(false)}
          />
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <WishlistDrawer open={wishlistOpen} onClose={() => setWishlistOpen(false)} />
    </>
  );
}

function MegaMenuItem({ cat, active }: { cat: ApiCategory; active: boolean }) {
  const [open, setOpen] = useState(false);
  const [hoveredSub, setHoveredSub] = useState<ApiCategory | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const subs = cat.children || [];

  function scheduleClose() {
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      setHoveredSub(null);
    }, 150);
  }

  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  const activeSub = hoveredSub || subs[0] || null;
  const previews: ApiProductPreview[] = activeSub?.previews || [];

  if (subs.length === 0) {
    return (
      <li>
        <Link
          href={`/c/${cat.slug}`}
          className={`relative pb-3 transition ${active ? "text-black font-medium" : "text-neutral-600 hover:text-black"}`}
        >
          {cat.name}
          {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />}
        </Link>
      </li>
    );
  }

  return (
    <li
      className="relative"
      onMouseEnter={() => { cancelClose(); setOpen(true); }}
      onMouseLeave={scheduleClose}
    >
      <Link
        href={`/c/${cat.slug}`}
        className={`relative pb-3 transition inline-flex items-center gap-1 ${active ? "text-black font-medium" : "text-neutral-600 hover:text-black"}`}
      >
        {cat.name}
        {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />}
      </Link>

      {open && (
        <div
          className="absolute top-full left-0 mt-1 z-50 bg-white border border-neutral-200 shadow-xl rounded-xl overflow-hidden flex min-w-[720px]"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          {/* Subcategory list */}
          <div className="w-64 border-r border-neutral-100 py-3">
            <div className="px-4 pb-2 text-[10px] text-neutral-400 font-medium tracking-widest uppercase">
              {cat.name}
            </div>
            <Link
              href={`/c/${cat.slug}`}
              className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-black transition-colors"
            >
              All {cat.name}
            </Link>
            {subs.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onMouseEnter={() => { cancelClose(); setHoveredSub(sub); }}
                className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition-colors ${
                  activeSub?.id === sub.id
                    ? "bg-neutral-50 text-black font-medium"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-black"
                }`}
              >
                {sub.image && (
                  <img src={sub.image} alt="" className="w-5 h-5 rounded object-cover shrink-0" />
                )}
                <span className="flex-1 truncate">{sub.name}</span>
                <ChevronRight className="w-3 h-3 text-neutral-400 shrink-0" />
              </button>
            ))}
          </div>

          {/* Product previews */}
          {activeSub && (
            <div className="flex-1 p-5 min-w-[400px]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-neutral-700">{activeSub.name}</span>
                <Link
                  href={`/c/${cat.slug}?sub=${activeSub.slug}`}
                  className="text-xs text-neutral-500 hover:text-black transition-colors"
                >
                  View all →
                </Link>
              </div>
              {previews.length === 0 ? (
                <p className="text-xs text-neutral-400 py-8 text-center">No products yet</p>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {previews.map((p) => (
                    <Link
                      key={p.id || p.slug}
                      href={`/product/${p.slug}`}
                      className="group/card"
                    >
                      <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden mb-2">
                        {p.thumbnail ? (
                          <img
                            src={p.thumbnail}
                            alt={p.title}
                            className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-300 text-xs">
                            No image
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-neutral-700 truncate group-hover/card:text-black transition-colors">
                        {p.title}
                      </p>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {p.price === 0 ? "Free" : `₹${p.price.toLocaleString()}`}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </li>
  );
}

function MobileMenu({
  categories,
  staticNav,
  cartCount,
  wishlistCount,
  user,
  query,
  setQuery,
  onSearch,
  onCart,
  onWishlist,
  onClose,
}: {
  categories: ApiCategory[];
  staticNav: { name: string; href: string }[];
  cartCount: number;
  wishlistCount: number;
  user: { name: string } | null;
  query: string;
  setQuery: (q: string) => void;
  onSearch: () => void;
  onCart: () => void;
  onWishlist: () => void;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="md:hidden border-t border-neutral-200 px-4 py-4 space-y-1">
      <form onSubmit={(e) => { e.preventDefault(); onSearch(); }} className="flex items-center bg-neutral-100 rounded-full px-4 py-2 mb-3">
        <Search className="w-4 h-4" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="bg-transparent outline-none text-sm ml-2 flex-1"
        />
      </form>

      {categories.map((cat) => {
        const subs = cat.children || [];
        const isExpanded = expanded === cat.id;
        return (
          <div key={cat.id}>
            <div className="flex items-center justify-between">
              <Link href={`/c/${cat.slug}`} onClick={onClose} className="flex-1 py-2 text-sm font-medium">
                {cat.name}
              </Link>
              {subs.length > 0 && (
                <button
                  type="button"
                  onClick={() => setExpanded(isExpanded ? null : cat.id)}
                  className="p-2 text-neutral-500"
                >
                  <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                </button>
              )}
            </div>
            {isExpanded && subs.length > 0 && (
              <div className="pl-4 border-l border-neutral-200 ml-2 mb-1 space-y-0.5">
                {subs.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/c/${cat.slug}?sub=${sub.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-2 py-1.5 text-sm text-neutral-600"
                  >
                    {sub.image && (
                      <img src={sub.image} alt="" className="w-4 h-4 rounded object-cover shrink-0" />
                    )}
                    {sub.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {staticNav.map((c) => (
        <Link key={c.name} href={c.href} onClick={onClose} className="block py-2 text-sm">
          {c.name}
        </Link>
      ))}

      <div className="pt-2 border-t border-neutral-100 space-y-1">
        <button onClick={onCart} className="block py-2 text-sm w-full text-left">
          Cart ({cartCount})
        </button>
        <button onClick={onWishlist} className="block py-2 text-sm w-full text-left">
          Wishlist ({wishlistCount})
        </button>
        {user ? (
          <Link href="/account" onClick={onClose} className="block py-2 text-sm">
            My account ({user.name.split(" ")[0]})
          </Link>
        ) : (
          <Link href="/login" onClick={onClose} className="block bg-black text-white text-center py-2 text-sm tracking-widest uppercase mt-2">
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
}
