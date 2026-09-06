import React, { useEffect, useRef, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2 } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export default function AccountStep({ email, password, onVerified }) {
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    base44.auth.register({ email, password })
      .then(() => setLoading(false))
      .catch((err) => {
        setError(err.message || "We couldn't create your account.");
        setLoading(false);
      });
  }, [email, password]);

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
          {loading ? "Working…" : "Verify & submit application"}
        </button>
        <button type="button" onClick={resend} className="text-sm text-primary underline underline-offset-4">
          Resend code
        </button>
      </div>
    </div>
  );
}