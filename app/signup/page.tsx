"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Logo from "@/components/Logo";
import { useAuth } from "@/lib/auth";
import { Eye, EyeOff } from "lucide-react";

function GoogleIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const { signup, login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signup(name, email, password);
      // Auto-login on success for smoother onboarding.
      await login(email, password);
      toast.success("Account created — check your email to verify");
      router.push("/account");
    } catch (err) {
      const msg = (err as Error).message || "Sign-up failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md border border-neutral-200 p-8">
        <div className="flex justify-center mb-6"><Logo /></div>
        <h1 className="text-2xl font-semibold text-center">Create your account</h1>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="block">
            <span className="text-xs text-neutral-600">Name</span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-black"
            />
          </label>
          <label className="block">
            <span className="text-xs text-neutral-600">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-black"
            />
          </label>
          <label className="block">
            <span className="text-xs text-neutral-600">Password</span>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full border border-neutral-300 rounded-lg pl-3 pr-10 py-2.5 text-sm outline-none focus:border-black"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block">
              At least 8 characters.
            </span>
          </label>
          {error && <div className="text-xs text-rose-600">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2.5 rounded-lg text-sm tracking-widest uppercase disabled:opacity-50"
          >
            {loading ? "Creating…" : "Create account"}
          </button>
        </form>
        <div className="mt-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-neutral-200" />
          <span className="text-xs text-neutral-400">or</span>
          <div className="flex-1 h-px bg-neutral-200" />
        </div>

        <a
          href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google?next=/account`}
          className="mt-4 w-full flex items-center justify-center gap-3 border border-neutral-300 py-2.5 rounded-lg text-sm hover:border-black transition"
        >
          <GoogleIcon />
          Continue with Google
        </a>

        <div className="mt-4 text-xs text-center text-neutral-500">
          Already have an account? <Link href="/login" className="underline text-black">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
