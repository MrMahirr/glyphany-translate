/**
 * Query string builder utility.
 * Liste/arama endpoint'leri için query parametrelerini URL'e dönüştürür.
 * null, undefined ve boş string değerler otomatik filtrelenir.
 */
export function buildSearchPath(
  basePath: string,
  params?: Record<string, unknown>
): string {
  if (!params) return basePath;

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}
