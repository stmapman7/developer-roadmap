import { useQuery } from '@tanstack/react-query';
import type { GetRoadmapResponse } from '../components/CustomRoadmap/CustomRoadmap';
import { httpGet, FetchError } from '../lib/query-http';
import { queryClient } from '../stores/query-client';

type UseCustomRoadmapOptions = {
  slug?: string;
  id?: string;
  secret?: string;
};

export function useCustomRoadmap(options: UseCustomRoadmapOptions) {
  const { slug, id, secret } = options;

  return useQuery<GetRoadmapResponse, FetchError>(
    {
      queryKey: [
        'get-roadmap',
        {
          slug,
          id,
        },
      ],
      queryFn: async () => {
        try {
          const roadmapUrl = slug
            ? new URL(
                `${import.meta.env.PUBLIC_API_URL}/v1-get-roadmap-by-slug/${slug}`,
              )
            : new URL(`${import.meta.env.PUBLIC_API_URL}/v1-get-roadmap/${id}`);

          if (secret) {
            roadmapUrl.searchParams.set('secret', secret);
          }

          return await httpGet<GetRoadmapResponse>(roadmapUrl.toString());
        } catch (error) {
          if (error instanceof SyntaxError) {
            throw new FetchError(404, 'Roadmap not found');
          }

          throw error;
        }
      },
      retry: false,
      enabled: !!(slug || id),
    },
    queryClient,
  );
}
