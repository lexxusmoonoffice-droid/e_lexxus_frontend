export default function PageHeader({ title, crumb }: { title: string; crumb?: string }) {
  return (
    <div className="mb-8">
      {crumb && <div className="text-xs text-neutral-500">{crumb}</div>}
      <h1 className="text-3xl font-semibold mt-1">{title}</h1>
    </div>
  );
}
