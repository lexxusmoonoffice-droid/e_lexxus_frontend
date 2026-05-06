import PageHeader from "@/components/PageHeader";

const people = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  name: `Person ${i + 1}`,
  image: `https://images.unsplash.com/photo-1${500000 + i * 12345}?w=400`,
}));

export default function PeoplePage() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10">
      <PageHeader title="People 3D Models" crumb="Lexxus / People" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {people.map((p) => (
          <div key={p.id} className="card">
            <div className="aspect-[3/4] bg-neutral-100 overflow-hidden">
              <img src={`https://images.unsplash.com/photo-151${7841905240 + p.id}?w=400`} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-sm">{p.name}</h3>
              <p className="text-xs text-neutral-500 mt-1">Rigged 3D Character</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
