"use client";

import { authClient } from "@/lib/auth-client";
import { Avatar } from "./ui";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAvatar } from "@/hooks/useAvatar";
import { Camera, Check, Loader2, Trash2, Upload } from "lucide-react";
import { useState, useRef } from "react";

export function ProfileSettings() {
  const currentUser = useCurrentUser();
  const { src: avatarSrc, set: setAvatar } = useAvatar();
  const [name, setName] = useState(currentUser.name);
  const [syncedName, setSyncedName] = useState(currentUser.name);
  const [emailAlerts, setEmailAlerts] = useState(currentUser.emailAlerts);
  const [syncedEmailAlerts, setSyncedEmailAlerts] = useState(currentUser.emailAlerts);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // currentUser fields arrive asynchronously (authClient.useSession() resolves
  // after first render) — adjust during render once real data lands instead
  // of getting stuck on the initial-value defaults.
  if (currentUser.name && currentUser.name !== syncedName) {
    setSyncedName(currentUser.name);
    setName(currentUser.name);
  }
  if (currentUser.emailAlerts !== syncedEmailAlerts) {
    setSyncedEmailAlerts(currentUser.emailAlerts);
    setEmailAlerts(currentUser.emailAlerts);
  }

  const input =
    "w-full h-10 px-3 rounded-lg border border-line bg-white text-sm font-sans text-navy focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold";
  const label = "block text-sm font-sans font-semibold text-ink mb-1.5";

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const result = ev.target?.result as string;
      setAvatar(result); // instant local reactivity (header/sidebar)
      try {
        await authClient.updateUser({ image: result }); // cross-device persistence
      } catch {
        // Non-fatal — the photo still shows locally even if the sync failed.
      }
      setUploading(false);
    };
    reader.readAsDataURL(file);

    // Reset input so the same file can be re-selected
    e.target.value = "";
  }

  async function removeAvatar() {
    setAvatar(null);
    try {
      await authClient.updateUser({ image: null });
    } catch {
      // ignore
    }
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const { error: updateError } = await authClient.updateUser({ name, email_alerts: emailAlerts });
      if (updateError) {
        setError(updateError.message ?? "Could not save changes.");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-line shadow-sm overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-line">
        <h2 className="font-display font-semibold text-navy">Profile</h2>
      </div>
      <div className="p-6 space-y-5">
        {/* Avatar upload */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Avatar
              initials={currentUser.initials}
              src={avatarSrc}
              className="h-16 w-16 text-xl flex-shrink-0"
            />
            {/* Overlay on hover */}
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute inset-0 rounded-full bg-navy/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:opacity-50"
            >
              {uploading ? (
                <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera className="h-5 w-5 text-white" />
              )}
            </button>
          </div>

          <div className="min-w-0">
            <p className="font-sans font-semibold text-ink">{name}</p>
            <p className="text-sm text-muted font-sans">{currentUser.role}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-gold hover:underline cursor-pointer disabled:opacity-50"
              >
                <Upload className="h-3 w-3" />
                {avatarSrc ? "Change photo" : "Upload photo"}
              </button>
              {avatarSrc && (
                <button
                  onClick={removeAvatar}
                  className="inline-flex items-center gap-1 text-xs font-sans font-medium text-red-500 hover:underline cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" />
                  Remove
                </button>
              )}
            </div>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Full Name</label>
            <input className={input} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className={label}>Work Email</label>
            <input
              className={`${input} bg-mist text-muted cursor-not-allowed`}
              value={currentUser.email}
              disabled
              title="Email can't be changed here — contact an administrator."
            />
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Role</label>
            {/* Role is server-controlled (set by an admin), not self-service — read-only. */}
            <div className={`${input} flex items-center bg-mist text-ink cursor-not-allowed`}>
              {currentUser.role}
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <p className="text-sm font-sans font-semibold text-ink">Notifications</p>
          <label className="flex items-center justify-between gap-3 py-2">
            <span className="text-sm font-sans text-ink">Email alerts for new applications</span>
            <input type="checkbox" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} className="h-4 w-4 rounded border-line accent-gold" />
          </label>
        </div>

        {error && <p className="text-sm text-danger font-sans">{error}</p>}

        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-gradient-to-r from-gold to-[#F0C864] text-navy text-sm font-semibold font-sans hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {!saving && saved && <Check className="h-4 w-4" />}
          {saving ? "Saving…" : saved ? "Saved" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
