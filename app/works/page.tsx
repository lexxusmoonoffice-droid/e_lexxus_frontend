import ProductCard from "@/components/ProductCard";
import PageHeader from "@/components/PageHeader";
import { products } from "@/lib/data";

export default function WorksPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10">
      <PageHeader title="Community Works" crumb="Lexxus / Works" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
    </div>
  );
}
