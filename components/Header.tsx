"use client";
import Link from "next/link";
import { Search, ShoppingBag, Heart, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Logo from "./Logo";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { useAuth } from "@/lib/auth";
import { useCurrency, currencies, type CurrencyCode } from "@/lib/currency";
import { useCategories } from "@/lib/hooks";
import CartDrawer from "./CartDrawer";
import WishlistDrawer from "./WishlistDrawer";

/** Nav items rendered in the header. Top-level categories come from the
 *  backend; Bundles/Brands are static because they're separate resources. */
type NavItem = { name: string; href: string };
const STATIC_NAV: NavItem[] = [
  { name: "Bundles", href: "/bundles" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { items: cartItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user } = useAuth();
  const { code: currencyCode, setCode: setCurrencyCode } = useCurrency();
  const { data: categoriesData } = useCategories();
  const router = useRouter();
  const pathname = usePathname();

  // Top-level categories from the backend + static entries. Rendered in
  // both desktop nav and mobile menu. When categories aren't loaded yet,
  // fall back to an empty list so the layout doesn't shift.
  const topCategories: NavItem[] = (categoriesData?.data || [])
    .filter((c) => !c.parent)
    .map((c) => ({ name: c.name, href: `/c/${c.slug}` }));
  const nav: NavItem[] = [...topCategories, ...STATIC_NAV];

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = query.trim();
    // Route search to the first top-level category, or fall back to
    // /c/models if categories haven't loaded yet.
    const target = topCategories[0]?.href || "/c/models";
    if (q) router.push(`${target}?q=${encodeURIComponent(q)}`);
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
            <select
              value={currencyCode}
              onChange={(e) => setCurrencyCode(e.target.value as CurrencyCode)}
              aria-label="Select currency"
              className="border border-neutral-300 px-2 py-1.5 text-xs hover:border-black bg-white cursor-pointer focus:outline-none focus:border-black"
            >
              {(Object.keys(currencies) as CurrencyCode[]).map((c) => (
                <option key={c} value={c}>
                  {currencies[c].symbol} {c}
                </option>
              ))}
            </select>

            <button
              onClick={openWishlist}
              className="relative p-1 hover:opacity-70 transition"
              aria-label="Open wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            <button
              onClick={openCart}
              className="relative p-1 hover:opacity-70 transition"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/account"
                  className="inline-flex items-center gap-1.5 border border-neutral-300 px-3 py-1.5 text-xs hover:border-black"
                >
                  <User className="w-3.5 h-3.5" /> {user.name.split(" ")[0]}
                </Link>
              </div>
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

        <nav className="hidden md:block border-t border-neutral-200">
          <ul className="max-w-[1400px] mx-auto px-4 lg:px-8 flex gap-7 text-sm py-3">
            {nav.map((c) => {
              const active = pathname === c.href || pathname.startsWith(c.href + "/");
              return (
                <li key={c.name}>
                  <Link
                    href={c.href}
                    className={`relative pb-3 transition ${active ? "text-black font-medium" : "text-neutral-600 hover:text-black"}`}
                  >
                    {c.name}
                    {active && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {mobileOpen && (
          <div className="md:hidden border-t border-neutral-200 px-4 py-4 space-y-3">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSearch(); setMobileOpen(false); }}
              className="flex items-center bg-neutral-100 rounded-full px-4 py-2"
            >
              <Search className="w-4 h-4" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="bg-transparent outline-none text-sm ml-2 flex-1"
              />
            </form>
            {nav.map((c) => (
              <Link key={c.name} href={c.href} className="block py-1.5 text-sm">
                {c.name}
              </Link>
            ))}
            <button
              onClick={() => { setMobileOpen(false); openCart(); }}
              className="block py-1.5 text-sm w-full text-left"
            >
              Cart ({cartItems.length})
            </button>
            <button
              onClick={() => { setMobileOpen(false); openWishlist(); }}
              className="block py-1.5 text-sm w-full text-left"
            >
              Wishlist ({wishlistItems.length})
            </button>
            {user ? (
              <>
                <Link href="/account" className="block py-1.5 text-sm">
                  My account ({user.name.split(" ")[0]})
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="block bg-black text-white text-center py-2 text-sm tracking-widest uppercase"
              >
                Sign in
              </Link>
            )}
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <WishlistDrawer open={wishlistOpen} onClose={() => setWishlistOpen(false)} />
    </>
  );
}
