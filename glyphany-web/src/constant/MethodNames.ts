/**
 * API Endpoint Sabitleri.
 * Her domain için endpoint path'leri tek bir dosyada tanımlanır.
 * Yeni endpoint eklemek için ilgili const'a yeni bir key eklemek yeterli (Open/Closed).
 */

export const AuthApiMethod = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  REFRESH: "/auth/refresh",
  ME: "/auth/me",
  LOGOUT: "/auth/logout",
} as const;

export const TranslationApiMethod = {
  CREATE: "/translations",
  SEARCH: "/translations/search",
  DETAIL: "/translations",
  DELETE: "/translations",
  DOWNLOAD: "/translations/download",
} as const;

export const JobApiMethod = {
  GET_STATUS: "/jobs/{id}/status",
  CANCEL: "/jobs/{id}/cancel",
} as const;

export const SettingsApiMethod = {
  GET: "/settings",
  UPDATE: "/settings",
  USAGE: "/settings/usage",
} as const;
