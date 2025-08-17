import { useEffect, useState } from 'react';
import { toast } from '@/components/ui/sonner-toast';
import { useTranslation } from 'react-i18next';
import { DISABLE_STATS } from '@/lib/config';
import { safeGet, safeSet } from '@/lib/storage';

export interface GithubStats {
  stars: number;
  forks: number;
  issues: number;
}

/**
 * Retrieves basic repository statistics from GitHub for display in the app.
 *
 * Fetches the following endpoints:
 * - `https://api.github.com/repos/supermarsx/sora-json-prompt-crafter` for star and fork counts.
 * - `https://api.github.com/search/issues?q=repo:supermarsx/sora-json-prompt-crafter+type:issue+state:open` for the number of open issues.
 *
 * Results are cached in `localStorage` for one hour using `safeGet`/`safeSet`.
 * Subsequent calls within that period reuse the cached values to avoid extra network requests.
 *
 * @returns A `GithubStats` object with `stars`, `forks`, and `issues` or `undefined` while loading/if disabled.
 */
export function useGithubStats() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<GithubStats>();

  useEffect(() => {
    if (DISABLE_STATS) return;
    const cached = safeGet<GithubStats>('githubStats', null, true);
    const cachedTs = safeGet<number>('githubStatsTimestamp', 0, true);
    if (
      cached &&
      typeof cachedTs === 'number' &&
      Date.now() - cachedTs < 3600000
    ) {
      setStats(cached);
      return;
    }
    const controller = new AbortController();
    const { signal } = controller;
    const load = async () => {
      try {
        const repoRes = await fetch(
          'https://api.github.com/repos/supermarsx/sora-json-prompt-crafter',
          { signal },
        );
        if (!repoRes.ok) throw new Error('non ok');
        const repoData = await repoRes.json();

        const issuesRes = await fetch(
          'https://api.github.com/search/issues?q=repo:supermarsx/sora-json-prompt-crafter+type:issue+state:open',
          { signal },
        );
        if (!issuesRes.ok) throw new Error('non ok');
        const issuesData = await issuesRes.json();

        if (!signal.aborted) {
          const data: GithubStats = {
            stars: repoData.stargazers_count,
            forks: repoData.forks_count,
            issues: issuesData.total_count,
          };
          setStats(data);
          safeSet('githubStats', data, true);
          safeSet('githubStatsTimestamp', Date.now(), true);
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          toast.error(t('githubStatsError'));
        }
      }
    };
    void load();
    return () => controller.abort();
  }, [t]);

  return stats;
}
