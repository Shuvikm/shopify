import {json, redirect, type LoaderFunctionArgs} from '@remix-run/server-runtime';
import {useNavigate, useFetcher, useLoaderData} from '@remix-run/react';
import {useEffect, useRef, useState, useCallback} from 'react';

export async function loader({request, context}: LoaderFunctionArgs) {
  const {session} = context as any;
  const userId = session.get('userId');
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get('redirect') || '/';
  if (userId) return redirect(redirectTo);
  return json({redirectTo});
}

// ── Country codes ────────────────────────────────────────────────────────────
const COUNTRY_CODES = [
  {code: '+91', flag: '🇮🇳', name: 'India'},
  {code: '+1', flag: '🇺🇸', name: 'US / Canada'},
  {code: '+44', flag: '🇬🇧', name: 'UK'},
  {code: '+61', flag: '🇦🇺', name: 'Australia'},
  {code: '+971', flag: '🇦🇪', name: 'UAE'},
  {code: '+65', flag: '🇸🇬', name: 'Singapore'},
  {code: '+60', flag: '🇲🇾', name: 'Malaysia'},
];

type Step = 'choose' | 'email' | 'phone' | 'verify';

// ── Tiny helpers ─────────────────────────────────────────────────────────────
function Label({children}: {children: React.ReactNode}) {
  return (
    <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">
      {children}
    </p>
  );
}

function ErrorBanner({message}: {message: string}) {
  return (
    <div className="mt-4 rounded-xl bg-red-950/60 border border-red-800 px-4 py-3 text-sm text-red-300 text-center font-medium">
      {message}
    </div>
  );
}

function PrimaryButton({
  children,
  disabled,
  onClick,
  type = 'button',
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="w-full py-4 rounded-2xl bg-[#f6c90e] text-black font-black text-sm uppercase tracking-widest hover:bg-[#f6c90e]/90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
    >
      {children}
    </button>
  );
}

function GhostButton({children, onClick}: {children: React.ReactNode; onClick: () => void}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-sm text-neutral-500 hover:text-[#f6c90e] transition-colors font-medium"
    >
      {children}
    </button>
  );
}

// ── Method card ───────────────────────────────────────────────────────────────
function MethodCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-4 p-5 rounded-2xl border border-neutral-800 bg-neutral-900 hover:border-[#f6c90e]/60 hover:bg-neutral-800 active:scale-[0.98] transition-all text-left group"
    >
      <div className="w-12 h-12 rounded-xl bg-neutral-800 group-hover:bg-[#f6c90e]/10 flex items-center justify-center shrink-0 transition-colors text-[#f6c90e]">
        {icon}
      </div>
      <div>
        <p className="font-bold text-white text-sm">{title}</p>
        <p className="text-xs text-neutral-500 mt-0.5">{description}</p>
      </div>
      <div className="ml-auto text-neutral-600 group-hover:text-[#f6c90e] transition-colors">
        <ChevronRightIcon />
      </div>
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Login() {
  const {redirectTo} = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const sendFetcher = useFetcher<{ok: boolean; method?: string; error?: string}>();
  const verifyFetcher = useFetcher<{ok: boolean; isNewUser?: boolean; error?: string}>();

  const [step, setStep] = useState<Step>('choose');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [resendCooldown, setResendCooldown] = useState(0);
  const digitRefs = useRef<Array<HTMLInputElement | null>>([]);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Cooldown timer ──────────────────────────────────────────────────────────
  const startCooldown = useCallback(() => {
    setResendCooldown(60);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  // ── After send-otp response ─────────────────────────────────────────────────
  useEffect(() => {
    if (sendFetcher.state === 'idle' && sendFetcher.data?.ok) {
      setStep('verify');
      startCooldown();
    }
  }, [sendFetcher.state, sendFetcher.data, startCooldown]);

  // ── After verify-otp response ───────────────────────────────────────────────
  useEffect(() => {
    if (verifyFetcher.state === 'idle' && verifyFetcher.data?.ok) {
      navigate(redirectTo || '/');
    }
  }, [verifyFetcher.state, verifyFetcher.data, navigate, redirectTo]);

  // ── OTP box handlers ────────────────────────────────────────────────────────
  function handleDigitChange(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);
    if (digit && index < 5) {
      digitRefs.current[index + 1]?.focus();
    }
  }

  function handleDigitKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      digitRefs.current[index - 1]?.focus();
    }
  }

  function handleDigitPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      e.preventDefault();
      const next = ['', '', '', '', '', ''];
      for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
      setOtpDigits(next);
      digitRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
  }

  // ── Submit helpers ──────────────────────────────────────────────────────────
  function submitSendOtp(type: 'email' | 'phone') {
    const fd = new FormData();
    fd.set('type', type);
    if (type === 'email') {
      fd.set('email', email);
    } else {
      fd.set('phone', phone);
      fd.set('countryCode', countryCode);
    }
    sendFetcher.submit(fd, {method: 'POST', action: '/api/send-otp'});
  }

  function submitVerifyOtp() {
    const otp = otpDigits.join('');
    if (otp.length !== 6) return;
    const fd = new FormData();
    fd.set('otp', otp);
    if (step === 'verify' && (step as Step) === 'verify') {
      if (email) fd.set('email', email);
      if (phone) fd.set('phone', `${countryCode}${phone}`);
    }
    verifyFetcher.submit(fd, {method: 'POST', action: '/api/verify-otp'});
  }

  function handleResend() {
    if (resendCooldown > 0) return;
    setOtpDigits(['', '', '', '', '', '']);
    const type = email ? 'email' : 'phone';
    submitSendOtp(type);
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  const isSending = sendFetcher.state !== 'idle';
  const isVerifying = verifyFetcher.state !== 'idle';
  const otpFull = otpDigits.join('').length === 6;

  const sendError = sendFetcher.data && !sendFetcher.data.ok ? sendFetcher.data.error : null;
  const verifyError = verifyFetcher.data && !verifyFetcher.data.ok ? verifyFetcher.data.error : null;

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-10">
          <span className="text-2xl font-black tracking-tight text-white">
            Hydro<span className="text-[#f6c90e]">Store</span>
          </span>
          <p className="text-neutral-500 text-sm mt-2">Premium products, seamless experience</p>
        </div>

        {/* Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl shadow-black/60">
          {/* ── STEP 1: Choose method ─────────────────────────────────────── */}
          {step === 'choose' && (
            <div>
              <h1 className="text-2xl font-black text-white mb-1">Welcome back</h1>
              <p className="text-neutral-500 text-sm mb-8">Choose how you want to sign in</p>

              <div className="space-y-3">
                <MethodCard
                  icon={<EmailIcon />}
                  title="Email OTP"
                  description="Get a code sent to your email"
                  onClick={() => setStep('email')}
                />
                <MethodCard
                  icon={<PhoneIcon />}
                  title="Phone OTP"
                  description="Get a code sent via SMS"
                  onClick={() => setStep('phone')}
                />
              </div>

              <p className="text-center text-xs text-neutral-600 mt-8">
                New here? An account is created automatically on first sign-in.
              </p>
            </div>
          )}

          {/* ── STEP 2a: Email input ──────────────────────────────────────── */}
          {step === 'email' && (
            <div>
              <button
                type="button"
                onClick={() => setStep('choose')}
                className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-white transition-colors mb-6"
              >
                <ChevronLeftIcon /> Back
              </button>
              <h1 className="text-2xl font-black text-white mb-1">Sign in with Email</h1>
              <p className="text-neutral-500 text-sm mb-8">
                We'll send a 6-digit code to your inbox
              </p>

              <div>
                <Label>Email address</Label>
                <input
                  type="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && email) submitSendOtp('email');
                  }}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-600 focus:outline-none focus:border-[#f6c90e] transition-colors text-sm"
                />
              </div>

              {sendError && <ErrorBanner message={sendError} />}

              <div className="mt-6">
                <PrimaryButton
                  disabled={!email || isSending}
                  onClick={() => submitSendOtp('email')}
                >
                  {isSending ? 'Sending code…' : 'Send Code'}
                </PrimaryButton>
              </div>
            </div>
          )}

          {/* ── STEP 2b: Phone input ──────────────────────────────────────── */}
          {step === 'phone' && (
            <div>
              <button
                type="button"
                onClick={() => setStep('choose')}
                className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-white transition-colors mb-6"
              >
                <ChevronLeftIcon /> Back
              </button>
              <h1 className="text-2xl font-black text-white mb-1">Sign in with Phone</h1>
              <p className="text-neutral-500 text-sm mb-8">
                We'll send a 6-digit code via SMS
              </p>

              <div>
                <Label>Mobile number</Label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="px-3 py-3.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-[#f6c90e] transition-colors text-sm shrink-0 appearance-none cursor-pointer"
                    style={{minWidth: '90px'}}
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    autoComplete="tel"
                    autoFocus
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && phone) submitSendOtp('phone');
                    }}
                    placeholder="9876543210"
                    className="flex-1 px-4 py-3.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-600 focus:outline-none focus:border-[#f6c90e] transition-colors text-sm"
                  />
                </div>
                <p className="text-xs text-neutral-600 mt-2">
                  Enter number without country code
                </p>
              </div>

              {sendError && <ErrorBanner message={sendError} />}

              <div className="mt-6">
                <PrimaryButton
                  disabled={!phone || isSending}
                  onClick={() => submitSendOtp('phone')}
                >
                  {isSending ? 'Sending code…' : 'Send Code'}
                </PrimaryButton>
              </div>
            </div>
          )}

          {/* ── STEP 3: OTP verification ──────────────────────────────────── */}
          {step === 'verify' && (
            <div>
              <button
                type="button"
                onClick={() => {
                  setStep(email ? 'email' : 'phone');
                  setOtpDigits(['', '', '', '', '', '']);
                }}
                className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-white transition-colors mb-6"
              >
                <ChevronLeftIcon /> Back
              </button>

              <h1 className="text-2xl font-black text-white mb-1">Enter your code</h1>
              <p className="text-neutral-500 text-sm mb-8">
                We sent a 6-digit code to{' '}
                <span className="text-white font-semibold">
                  {email || `${countryCode} ${phone}`}
                </span>
              </p>

              {/* 6-box OTP input */}
              <div>
                <Label>Verification code</Label>
                <div className="flex gap-2 justify-between">
                  {otpDigits.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        digitRefs.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      autoFocus={i === 0}
                      onChange={(e) => handleDigitChange(i, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(i, e)}
                      onPaste={i === 0 ? handleDigitPaste : undefined}
                      className="w-12 h-14 text-center text-2xl font-black rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-[#f6c90e] transition-colors caret-[#f6c90e]"
                    />
                  ))}
                </div>
              </div>

              {verifyError && <ErrorBanner message={verifyError} />}

              <div className="mt-6 space-y-3">
                <PrimaryButton disabled={!otpFull || isVerifying} onClick={submitVerifyOtp}>
                  {isVerifying ? 'Verifying…' : 'Verify & Sign In'}
                </PrimaryButton>

                <div className="text-center">
                  {resendCooldown > 0 ? (
                    <span className="text-xs text-neutral-600">
                      Resend code in{' '}
                      <span className="text-[#f6c90e] font-bold tabular-nums">
                        {resendCooldown}s
                      </span>
                    </span>
                  ) : (
                    <GhostButton onClick={handleResend}>Resend code</GhostButton>
                  )}
                </div>
              </div>

              <p className="text-center text-xs text-neutral-600 mt-6">
                The code is valid for 10 minutes
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-neutral-700 mt-8">
          By signing in you agree to our{' '}
          <a href="/policies/terms-of-service" className="text-neutral-500 hover:text-white transition-colors">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/policies/privacy-policy" className="text-neutral-500 hover:text-white transition-colors">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}

// ── Icon components ───────────────────────────────────────────────────────────
function EmailIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}
