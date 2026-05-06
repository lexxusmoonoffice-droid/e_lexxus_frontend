import Link from "next/link";
import PageHeader from "@/components/PageHeader";

const artists = [
  { name: "Bariskina Julia", followers: "145", works: 18 },
  { name: "WWZ Studio", followers: "1.3k", works: 42 },
  { name: "Alla Balashova", followers: "988", works: 27 },
  { name: "Mohammad Danni", followers: "1.1k", works: 34 },
  { name: "Heera T", followers: "512", works: 14 },
  { name: "Azizbek", followers: "876", works: 22 },
  { name: "Yormani Vurel", followers: "2.1k", works: 56 },
  { name: "Kai Lin", followers: "710", works: 19 },
];

export default function ArtistsPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10">
      <PageHeader title="Artists" crumb="Lexxus / Artists" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {artists.map((a) => (
          <Link key={a.name} href="#" className="card p-6 text-center block">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 mx-auto flex items-center justify-center text-white text-xl font-bold">
              {a.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <h3 className="font-semibold mt-4">{a.name}</h3>
            <div className="text-xs text-neutral-500 mt-1">{a.works} works · {a.followers} followers</div>
            <button className="mt-4 btn-outline !py-1.5 !px-4 text-xs">Follow</button>
          </Link>
        ))}
      </div>
    </div>
  );
}
