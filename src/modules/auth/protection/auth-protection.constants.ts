export const MAX_ATTEMPTS = 5;
export const ATTEMPT_TTL = 900; // seconds
export const LOCK_TTL = 300; // seconds

const AUTH_PREFIX = 'auth';
export const USER_ATTEMPTS_PREFIX = `${AUTH_PREFIX}:attempts`;
export const USER_LOCK_PREFIX = `${AUTH_PREFIX}:lock`;
