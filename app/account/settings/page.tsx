"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AccountShell from "@/components/AccountShell";
import { useAuth } from "@/lib/auth";
import { apiPut, apiPost, apiDelete, apiError } from "@/lib/api";

export default function SettingsPage() {
  const { user, refresh, logout } = useAuth();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBio(user.bio || "");
    }
  }, [user]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await apiPut("/users/me", { name, bio });
      await refresh();
      toast.success("Profile updated");
    } catch (err) {
      toast.error(apiError(err, "Could not save"));
    } finally {
      setSavingProfile(false);
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setSavingPw(true);
    try {
      await apiPut("/users/me/password", { currentPassword, newPassword });
      toast.success("Password changed — please sign in again");
      setCurrentPassword("");
      setNewPassword("");
      await logout();
      if (typeof window !== "undefined") window.location.href = "/login";
    } catch (err) {
      toast.error(apiError(err, "Could not change password"));
    } finally {
      setSavingPw(false);
    }
  }

  async function deleteAccount() {
    if (!confirm("Permanently delete your account? This cannot be undone.")) return;
    try {
      await apiDelete("/users/me");
      toast.success("Account deleted");
      await logout();
      if (typeof window !== "undefined") window.location.href = "/";
    } catch (err) {
      toast.error(apiError(err, "Could not delete account"));
    }
  }

  return (
    <AccountShell title="My Account">
      <h2 className="font-semibold mb-4">Profile</h2>
      <form className="border border-neutral-200 p-6 space-y-4 max-w-xl" onSubmit={saveProfile}>
        <label className="block">
          <span className="text-xs text-neutral-600">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-black"
          />
        </label>
        <label className="block">
          <span className="text-xs text-neutral-600">Bio</span>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={500}
            className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-black"
          />
        </label>
        <button
          type="submit"
          disabled={savingProfile}
          className="bg-black text-white px-6 py-2 rounded text-xs tracking-widest uppercase disabled:opacity-50"
        >
          {savingProfile ? "Saving…" : "Save profile"}
        </button>
      </form>

      <h2 className="font-semibold mt-10 mb-4">Change password</h2>
      <form className="border border-neutral-200 p-6 space-y-4 max-w-xl" onSubmit={changePassword}>
        <label className="block">
          <span className="text-xs text-neutral-600">Current password</span>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-black"
          />
        </label>
        <label className="block">
          <span className="text-xs text-neutral-600">New password</span>
          <input
            type="password"
            required
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-black"
          />
        </label>
        <button
          type="submit"
          disabled={savingPw}
          className="bg-black text-white px-6 py-2 rounded text-xs tracking-widest uppercase disabled:opacity-50"
        >
          {savingPw ? "Updating…" : "Change password"}
        </button>
      </form>

      <h2 className="font-semibold mt-10 mb-4 text-rose-600">Danger zone</h2>
      <div className="border border-rose-200 p-6 max-w-xl bg-rose-50">
        <p className="text-sm text-rose-700">
          Permanently delete your account and all associated data. Purchase records
          are retained but anonymised.
        </p>
        <button
          onClick={deleteAccount}
          className="mt-4 border border-rose-400 text-rose-700 px-4 py-2 rounded text-xs tracking-widest uppercase hover:bg-rose-600 hover:text-white transition"
        >
          Delete my account
        </button>
      </div>
    </AccountShell>
  );
}
