// Stub — email sending is handled via SendGrid fetch in api.auth.send-otp.tsx
export async function sendOTPEmail(_email: string, _otp: string, _name?: string): Promise<boolean> {
  return false;
}
export async function sendWelcomeEmail(_email: string, _name: string): Promise<boolean> {
  return false;
}
