import rateLimit from 'express-rate-limit';

const buildLimiter = ({ windowMs, max, message }) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message }
  });

export const apiLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: 'Too many requests, please try again later.'
});

export const authLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: 25,
  message: 'Too many authentication attempts. Try again later.'
});
