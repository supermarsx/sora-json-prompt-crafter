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

export function useGithubStats() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<GithubStats>();

  useEffect(() => {
    if (DISABLE_STATS) return;
    const cached = safeGet<GithubStats>('githubStats', null, { json: true });
    const cachedTs = safeGet<number>('githubStatsTimestamp', 0, { json: true });
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
          safeSet('githubStats', data, { json: true });
          safeSet('githubStatsTimestamp', Date.now(), { json: true });
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
