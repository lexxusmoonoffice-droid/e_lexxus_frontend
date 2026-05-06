import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex flex-col items-start leading-none">
      <div className="flex gap-[3px] items-end h-3">
        <span className="block w-4 h-[2px] bg-black" />
        <span className="block w-4 h-[2px] bg-black" />
        <span className="block w-4 h-[2px] bg-black" />
      </div>
      <span className="logo-wordmark mt-1">LEXXUS</span>
    </Link>
  );
}
