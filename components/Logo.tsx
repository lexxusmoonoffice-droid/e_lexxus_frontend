import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="inline-flex items-end leading-none">
      <span className="logo-wordmark relative">
        Le
        <span className="relative inline-block mr-[0.35em]" style={{ letterSpacing: 0 }}>
          <span className="absolute left-0 bottom-full mb-[3px] w-full h-[2px] bg-black" />
          x
        </span>
        <span className="relative inline-block mr-[0.35em]" style={{ letterSpacing: 0 }}>
          <span className="absolute left-0 bottom-full mb-[3px] w-full h-[2px] bg-black" />
          x
        </span>
        us Moon
      </span>
    </Link>
  );
}
