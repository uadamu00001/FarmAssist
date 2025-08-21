export async function sendSms(to: string, body: string) {
  // If an SMS provider (like Twilio) is configured, you can implement it here.
  if (process.env.SMS_PROVIDER === 'twilio' && process.env.TWILIO_ACCOUNT_SID) {
    // Implement real Twilio send here if desirred.
    // For now we keep a mock to keep the module independent.
    console.log('[Notification][SMS] Twilio configured but not implemented in this demo.');
    return { ok: false, info: 'not-implemented' };
  }

  console.log(`[Notification][SMS] To=${to} Body=${body}`);
  return { ok: true, info: 'mock-sent' };
}
