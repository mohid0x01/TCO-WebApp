import { useState, useEffect } from "react";

const GITHUB_ORG = "mohidqx";
const CACHE_KEY = "gh_org_avatar";
const CACHE_TTL = 3600_000; // 1 hour

let cachedUrl: string | null = null;
let fetchPromise: Promise<string> | null = null;

function fetchAvatar(): Promise<string> {
  if (fetchPromise) return fetchPromise;
  const fallback = `https://github.com/${GITHUB_ORG}.png?size=256`;

  fetchPromise = (async () => {
    try {
      const stored = localStorage.getItem(CACHE_KEY);
      if (stored) {
        const { url, ts } = JSON.parse(stored);
        if (Date.now() - ts < CACHE_TTL) { cachedUrl = url; return url; }
      }
    } catch {}
    try {
      const r = await fetch(`https://api.github.com/users/${GITHUB_ORG}`);
      const d = await r.json();
      if (d.avatar_url) {
        const url = `${d.avatar_url}&s=256`;
        cachedUrl = url;
        localStorage.setItem(CACHE_KEY, JSON.stringify({ url, ts: Date.now() }));
        return url;
      }
    } catch {}
    cachedUrl = fallback;
    return fallback;
  })();

  return fetchPromise;
}

export function useGitHubAvatar() {
  const [url, setUrl] = useState(cachedUrl || `https://github.com/${GITHUB_ORG}.png?size=256`);

  useEffect(() => {
    fetchAvatar().then(setUrl);
  }, []);

  return url;
}
