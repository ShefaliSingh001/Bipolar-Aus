import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2 } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export default function AccountStep({ email, onVerified }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createAccount = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) return setError("Please use at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    setLoading(true);
    try {
      await base44.auth.register({ email, password });
      setShowOtp(true);
    } catch (err) {
      setError(err.message || "We couldn't create your account.");
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email, otpCode });
      if (result?.access_token) base44.auth.setToken(result.access_token);
      await onVerified();
    } catch (err) {
      setError(err.message || "That code didn't work.");
      setLoading(false);
    }
  };

  const resend = async () => {
    setError("");
    try {
      await base44.auth.resendOtp(email);
    } catch (err) {
      setError(err.message || "Couldn't resend the code.");
    }
  };

  if (showOtp) {
    return (
      <div className="space-y-6">
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          We sent a 6-digit code to <span className="text-foreground">{email}</span>. Enter it to finish your application.
        </p>
        <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode} autoFocus autoComplete="one-time-code">
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((i) => <InputOTPSlot key={i} index={i} />)}
          </InputOTPGroup>
        </InputOTP>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex items-center gap-5">
          <button type="button" onClick={verify} disabled={loading || otpCode.length < 6} className="ba-btn-primary">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Submitting application…" : "Verify & submit"}
          </button>
          <button type="button" onClick={resend} className="text-sm text-primary underline underline-offset-4">
            Resend code
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={createAccount} className="space-y-6">
      <p className="text-[15px] leading-relaxed text-muted-foreground">
        Choose a password so you can sign back in to your volunteer portal with{" "}
        <span className="text-foreground">{email}</span>.
      </p>
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">Password *</label>
        <input
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          className="w-full rounded-[var(--radius)] border border-border bg-card px-4 py-3 text-[15px] outline-none focus:border-primary/50"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">Confirm password *</label>
        <input
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Re-enter your password"
          className="w-full rounded-[var(--radius)] border border-border bg-card px-4 py-3 text-[15px] outline-none focus:border-primary/50"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <button type="submit" disabled={loading || !password || !confirm} className="ba-btn-primary">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? "Creating your account…" : "Create account"}
      </button>
    </form>
  );
}