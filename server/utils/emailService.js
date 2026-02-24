/**
 * Node.js Email Service - Nodemailer + Gmail SMTP (host config, no service: 'gmail')
 * Uses env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS (Gmail 16-digit App Password)
 * Rate-limit safe sending with reusable sendMail() and sendOTP().
 */

const nodemailer = require('nodemailer');

// --- Environment: SMTP host config (prefer SMTP_*, fallback EMAIL_*) ---
const getConfig = () => {
  const host = (process.env.SMTP_HOST || process.env.EMAIL_HOST || 'smtp.gmail.com').trim();
  const port = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || '465', 10);
  const secure = (process.env.SMTP_SECURE || process.env.EMAIL_SECURE || 'true').toLowerCase() === 'true';
  const user = (process.env.SMTP_USER || process.env.EMAIL_USER || '').trim();
  const pass = (process.env.SMTP_PASS || process.env.EMAIL_PASSWORD || '').trim();
  const fromName = process.env.EMAIL_FROM_NAME || 'Mateshwari Moorti Bhandar';
  return { host, port, secure, user, pass, fromName };
};

// --- Rate limit: min delay between sends (Gmail-friendly) ---
const RATE_LIMIT_MS = parseInt(process.env.EMAIL_RATE_LIMIT_MS || '1500', 10); // 1.5 sec between emails
const MAX_EMAILS_PER_MINUTE = parseInt(process.env.EMAIL_MAX_PER_MINUTE || '30', 10);
let lastSendTime = 0;
const recentSendTimes = [];

const waitForRateLimit = async () => {
  const now = Date.now();
  // Prune older than 1 minute
  while (recentSendTimes.length > 0 && recentSendTimes[0] < now - 60000) {
    recentSendTimes.shift();
  }
  if (recentSendTimes.length >= MAX_EMAILS_PER_MINUTE) {
    const waitMs = recentSendTimes[0] + 60000 - now;
    if (waitMs > 0) await new Promise(r => setTimeout(r, waitMs));
  }
  const elapsed = now - lastSendTime;
  if (elapsed < RATE_LIMIT_MS) {
    await new Promise(r => setTimeout(r, RATE_LIMIT_MS - elapsed));
  }
  lastSendTime = Date.now();
  recentSendTimes.push(lastSendTime);
};

// --- Transporter: SMTP host config only (no service: 'gmail') ---
let cachedTransporter = null;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;
  const { host, port, secure, user, pass } = getConfig();
  if (!user || !pass) {
    throw new Error('SMTP_USER/SMTP_PASS (or EMAIL_USER/EMAIL_PASSWORD) must be set in .env. Use Gmail 16-digit App Password if 2FA is on.');
  }
  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    ...(port === 587 && { requireTLS: true }),
  });
  return cachedTransporter;
}

/**
 * Reusable: send a single email (rate-limited).
 * @param {Object} options - { to, subject, html, text?, from?, replyTo? }
 * @returns {Promise<{ success: boolean, messageId?: string, error?: string }>}
 */
async function sendMail(options) {
  const { to, subject, html, text, from, replyTo } = options;
  if (!to || !subject || !html) {
    return { success: false, error: 'Missing to, subject, or html' };
  }
  try {
    await waitForRateLimit();
    const { user, fromName } = getConfig();
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: from || `"${fromName}" <${user}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html,
      text: text || undefined,
      replyTo: replyTo || undefined,
    });
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('Email send error:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Send OTP email (rate-limited).
 * @param {string} to - Recipient email
 * @param {string} otp - OTP code (e.g. 6 digits)
 * @param {Object} opts - { subject?, expiresInMinutes?, fromName? }
 * @returns {Promise<{ success: boolean, messageId?: string, error?: string }>}
 */
async function sendOTP(to, otp, opts = {}) {
  const expires = opts.expiresInMinutes != null ? opts.expiresInMinutes : 10;
  const subject = opts.subject || 'Your verification code - Mateshwari Moorti Bhandar';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <div style="background: linear-gradient(135deg, #B68126 0%, #956213 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h2 style="color: #fff; margin: 0; font-size: 20px;">Verification Code</h2>
      </div>
      <div style="background: #fff; padding: 24px; border: 1px solid #eee; border-top: none; border-radius: 0 0 10px 10px;">
        <p style="color: #333; margin: 0 0 16px 0;">Your one-time verification code is:</p>
        <p style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #B68126; margin: 16px 0;">${otp}</p>
        <p style="color: #666; font-size: 14px; margin: 16px 0 0 0;">This code expires in ${expires} minutes. Do not share it with anyone.</p>
        <p style="color: #999; font-size: 12px; margin: 24px 0 0 0;">— Mateshwari Moorti Bhandar</p>
      </div>
    </div>
  `;
  const text = `Your verification code is: ${otp}. It expires in ${expires} minutes.`;
  return sendMail({ to, subject, html, text });
}

/**
 * Verify SMTP connection (optional, for startup check).
 * @returns {Promise<boolean>}
 */
async function verifyConnection() {
  try {
    const t = getTransporter();
    await t.verify();
    return true;
  } catch (err) {
    console.error('SMTP verify failed:', err.message);
    return false;
  }
}

module.exports = {
  getConfig,
  getTransporter,
  sendMail,
  sendOTP,
  verifyConnection,
};
