const MAX_RETRIES = 5;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Both TheMealDB and TheCocktailDB free tiers rate-limit aggressively when the seed script
// fires many lookups back to back — retry 429s with backoff instead of failing the whole run.
export async function fetchJsonWithRetry<T>(url: string): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    const response = await fetch(url, { cache: "force-cache" });
    if (response.ok) return response.json() as Promise<T>;

    if (response.status === 429 && attempt < MAX_RETRIES) {
      const retryAfter = Number(response.headers.get("retry-after"));
      const wait = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 400 * 2 ** attempt;
      await delay(wait);
      continue;
    }

    throw new Error(`${url} responded ${response.status}`);
  }
}
