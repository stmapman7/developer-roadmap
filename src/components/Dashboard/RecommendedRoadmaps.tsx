import type { BuiltInRoadmap } from './PersonalDashboard';
import { ArrowUpRight } from 'lucide-react';
import { MarkFavorite } from '../FeaturedItems/MarkFavorite.tsx';

type RecommendedRoadmapsProps = {
  roadmaps: BuiltInRoadmap[];
  isLoading: boolean;
};

export function RecommendedRoadmaps(props: RecommendedRoadmapsProps) {
  const { roadmaps: roadmapsToShow, isLoading } = props;

  return (
    <>
      <div className="mb-2 mt-8 flex items-center justify-between gap-2">
        <h2 className="text-xs uppercase text-gray-400">
          Recommended Roadmaps
        </h2>

        <a
          href="/roadmaps"
          className="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-700 hover:bg-gray-300 hover:text-black"
        >
          All Roadmaps
        </a>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <RecommendedCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 md:grid-cols-3">
          {roadmapsToShow.map((roadmap) => (
            <RecommendedRoadmapCard key={roadmap.id} roadmap={roadmap} />
          ))}
        </div>
      )}

      <div className="mt-6 text-sm text-gray-500">
        Need some help getting started? Check out our{' '}<a href="/get-started" className="text-blue-600 underline">Getting Started Guide</a>.
      </div>
    </>
  );
}

type RecommendedRoadmapCardProps = {
  roadmap: BuiltInRoadmap;
};

export function RecommendedRoadmapCard(props: RecommendedRoadmapCardProps) {
  const { roadmap } = props;
  const { title, url, description } = roadmap;

  return (
    <a
      href={url}
      className="font-regular text-sm sm:text-sm group relative block rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-black no-underline hover:border-gray-400 hover:bg-gray-50"
    >
      <MarkFavorite className={'opacity-30'} resourceType={'roadmap'} resourceId={roadmap.id} />
      {title}
    </a>
  );
}

function RecommendedCardSkeleton() {
  return (
    <div className="h-[38px] w-full animate-pulse rounded-md bg-gray-200" />
  );
}
