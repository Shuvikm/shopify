// Stub — OTP logic is handled entirely in api.auth.send-otp.tsx / api.auth.verify-otp.tsx
// using Hydrogen AppSession (cookie) storage instead of a database table.
export async function generateOTP(): Promise<string> {
  return String(Math.floor(100000 + Math.random() * 900000));
}
export async function storeOTP(_email: string, _otp: string, _type?: string): Promise<void> {}
export async function verifyOTP(_email: string, _otp: string, _type?: string): Promise<{valid: boolean; message: string}> {
  return {valid: false, message: 'Use /api/auth/verify-otp instead'};
}
export async function deleteOTP(_email: string, _type?: string): Promise<void> {}
export async function getOTPRecord(_email: string, _type?: string) {
  return null;
}
