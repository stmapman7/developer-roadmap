import { CheckSquare, Gift, SquarePen } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { AllowedProfileVisibility } from '../../api/user.ts';
import { useToast } from '../../hooks/use-toast';
import { cn } from '../../lib/classname.ts';
import { httpGet } from '../../lib/http';
import type { QuestionGroupType } from '../../lib/question-group';
import type { AllowedRoadmapRenderer } from '../../lib/roadmap.ts';
import type { VideoFileType } from '../../lib/video';
import { type StreakResponse } from '../../stores/streak';
import type { PageType } from '../CommandMenu/CommandMenu';
import { FeaturedGuideList } from '../FeaturedGuides/FeaturedGuideList';
import { FeaturedVideoList } from '../FeaturedVideos/FeaturedVideoList';
import {
  FavoriteRoadmaps,
  type AIRoadmapType,
} from '../HeroSection/FavoriteRoadmaps.tsx';
import { HeroRoadmap } from '../HeroSection/HeroRoadmap.tsx';
import type { ProjectStatusDocument } from '../Projects/ListProjectSolutions';
import type { UserProgress } from '../TeamProgress/TeamProgressPage';
import { useIsPaidUser } from '../../queries/billing.ts';
import { UpgradeAccountModal } from '../Billing/UpgradeAccountModal.tsx';
import type { OfficialGuideDocument } from '../../queries/official-guide.ts';

const projectGroups = [
  {
    title: 'Frontend',
    id: 'frontend',
  },
  {
    title: 'Backend',
    id: 'backend',
  },
  {
    title: 'DevOps',
    id: 'devops',
  },
];

type UserDashboardResponse = {
  name: string;
  email: string;
  avatar: string;
  headline: string;
  username: string;
  profileVisibility: AllowedProfileVisibility;
  progresses: UserProgress[];
  projects: ProjectStatusDocument[];
  aiRoadmaps: AIRoadmapType[];
};

export type BuiltInRoadmap = {
  id: string;
  url: string;
  title: string;
  description: string;
  isFavorite?: boolean;
  isNew?: boolean;
  relatedRoadmapIds?: string[];
  renderer?: AllowedRoadmapRenderer;
  metadata?: Record<string, any>;
};

type PersonalDashboardProps = {
  builtInRoleRoadmaps?: BuiltInRoadmap[];
  builtInSkillRoadmaps?: BuiltInRoadmap[];
  builtInBestPractices?: BuiltInRoadmap[];
  questionGroups?: QuestionGroupType[];
  guides?: OfficialGuideDocument[];
  videos?: VideoFileType[];
};

type DashboardStatItemProps = {
  isLoading: boolean;
};

function UpgradeAccountButton(props: DashboardStatItemProps) {
  const { isLoading } = props;

  const { isPaidUser, isLoading: isPaidUserLoading } = useIsPaidUser();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  if (isPaidUser) {
    return null;
  }

  return (
    <>
      {showUpgradeModal && (
        <UpgradeAccountModal onClose={() => setShowUpgradeModal(false)} />
      )}

      <button
        onClickCapture={() => setShowUpgradeModal(true)}
        className={cn(
          'flex items-center gap-1.5 rounded-lg bg-white py-1.5 pr-3 pl-2.5 text-xs text-purple-700 duration-200 hover:bg-purple-600 hover:text-white',
          {
            'striped-loader-slate striped-loader-slate-fast border-transparent bg-slate-800/50 text-transparent hover:bg-transparent hover:text-transparent hover:shadow-none':
              isLoading || isPaidUserLoading,
          },
        )}
        onClick={() => {}}
      >
        <Gift size={16} className={cn({ 'text-transparent': isLoading })} />
        <span>Upgrade Account</span>
      </button>
    </>
  );
}

type ProfileButtonProps = {
  isLoading: boolean;
  name?: string;
  username?: string;
  avatar?: string;
};

function PersonalProfileButton(props: ProfileButtonProps) {
  const { isLoading, name, username, avatar } = props;

  if (isLoading || !username) {
    return (
      <a
        href="/account/update-profile"
        className={cn(
          'flex items-center gap-2 rounded-lg bg-slate-800/50 py-2 pr-3 pl-3 font-medium outline-slate-700 hover:bg-slate-800 hover:outline-slate-400',
          {
            'striped-loader-slate striped-loader-slate-fast text-transparent':
              isLoading,
            'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20': !isLoading,
          },
        )}
      >
        <CheckSquare className="h-4 w-4" strokeWidth={2.5} />
        Set up your profile
      </a>
    );
  }

  return (
    <div className="flex gap-1.5">
      <a
        href={`/u/${username}`}
        className="flex items-center gap-2 rounded-lg bg-slate-800/50 py-2 pr-3 pl-3 text-slate-300 transition-colors hover:bg-slate-800/70"
      >
        <img
          src={avatar}
          alt={name || 'Profile'}
          className="h-5 w-5 rounded-full ring-1 ring-slate-700"
        />
        <span className="font-medium">Visit Profile</span>
      </a>
      <a
        href="/account/update-profile"
        className="flex items-center gap-2 rounded-lg bg-slate-800/50 py-2 pr-3 pl-3 text-slate-400 transition-colors hover:bg-slate-800/70 hover:text-slate-300"
        title="Edit Profile"
      >
        <SquarePen className="h-4 w-4" />
      </a>
    </div>
  );
}

type DashboardStatsProps = {
  profile: ProfileButtonProps;
  accountStreak?: StreakResponse;
  finishedProjectsCount?: number;
  isLoading: boolean;
};

function DashboardStats(props: DashboardStatsProps) {
  const { isLoading, profile } = props;

  return (
    <div className="container mb-3 flex flex-col gap-4 pt-6 pb-2 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PersonalProfileButton
          isLoading={isLoading}
          name={profile.name}
          username={profile.username}
          avatar={profile.avatar}
        />
        <div className="hidden flex-wrap items-center gap-2 md:flex">
          <UpgradeAccountButton isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

export function PersonalDashboard(props: PersonalDashboardProps) {
  const {
    builtInRoleRoadmaps = [],
    builtInBestPractices = [],
    builtInSkillRoadmaps = [],
    guides = [],
    videos = [],
  } = props;

  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [personalDashboardDetails, setPersonalDashboardDetails] =
    useState<UserDashboardResponse>();
  const [projectDetails, setProjectDetails] = useState<PageType[]>([]);

  async function loadProgress() {
    const { response: progressList, error } =
      await httpGet<UserDashboardResponse>(
        `${import.meta.env.PUBLIC_API_URL}/v1-user-dashboard`,
      );

    if (error || !progressList) {
      return;
    }

    progressList?.progresses?.forEach((progress) => {
      window.dispatchEvent(
        new CustomEvent('mark-favorite', {
          detail: {
            resourceId: progress.resourceId,
            resourceType: progress.resourceType,
            isFavorite: progress.isFavorite,
          },
        }),
      );
    });
    setPersonalDashboardDetails(progressList);
  }

  async function loadAllProjectDetails() {
    const { error, response } = await httpGet<PageType[]>(`/pages.json`);

    if (error) {
      toast.error(error.message || 'Something went wrong');
      return;
    }

    if (!response) {
      return [];
    }

    const allProjects = response.filter((page) => page.group === 'Projects');
    setProjectDetails(allProjects);
  }

  useEffect(() => {
    Promise.allSettled([loadProgress(), loadAllProjectDetails()]).finally(() =>
      setIsLoading(false),
    );
  }, []);

  useEffect(() => {
    window.addEventListener('refresh-favorites', loadProgress);
    return () => window.removeEventListener('refresh-favorites', loadProgress);
  }, []);

  const learningRoadmapsToShow: UserProgress[] = (
    personalDashboardDetails?.progresses || []
  )
    .filter((progress) => !progress.isCustomResource)
    .sort((a, b) => {
      const updatedAtA = new Date(a.updatedAt);
      const updatedAtB = new Date(b.updatedAt);

      if (a.isFavorite && !b.isFavorite) {
        return -1;
      }

      if (!a.isFavorite && b.isFavorite) {
        return 1;
      }

      return updatedAtB.getTime() - updatedAtA.getTime();
    });

  const customRoadmaps: UserProgress[] = (
    personalDashboardDetails?.progresses || []
  )
    .filter((progress) => progress.isCustomResource)
    .sort((a, b) => {
      const updatedAtA = new Date(a.updatedAt);
      const updatedAtB = new Date(b.updatedAt);
      return updatedAtB.getTime() - updatedAtA.getTime();
    });

  const { avatar, name } = personalDashboardDetails || {};
  const avatarLink = avatar
    ? `${import.meta.env.PUBLIC_AVATAR_BASE_URL}/${avatar}`
    : '/img/default-avatar.png';

  const enrichedProjects = personalDashboardDetails?.projects
    .map((project) => {
      const projectDetail = projectDetails.find(
        (page) => page.id === project.projectId,
      );

      return {
        ...project,
        title: projectDetail?.title || 'N/A',
      };
    })
    .sort((a, b) => {
      if (a.repositoryUrl && !b.repositoryUrl) {
        return 1;
      }

      if (!a.repositoryUrl && b.repositoryUrl) {
        return -1;
      }

      return 0;
    });

  const { username } = personalDashboardDetails || {};

  return (
    <div>
      <DashboardStats
        profile={{
          name,
          username,
          avatar: avatarLink,
          isLoading,
        }}
        isLoading={isLoading}
      />

      <FavoriteRoadmaps
        progress={learningRoadmapsToShow}
        customRoadmaps={customRoadmaps}
        projects={enrichedProjects || []}
        isLoading={isLoading}
      />

      <div className="bg-linear-to-b from-slate-900 to-black pb-12">
        <div className="relative mt-6 border-t border-t-[#1e293c] pt-12">
          <div className="container">
            <h2
              id="role-based-roadmaps"
              className="text-md font-regular absolute -top-[17px] left-4 flex rounded-lg border border-[#1e293c] bg-slate-900 px-3 py-1 text-slate-400 sm:left-1/2 sm:-translate-x-1/2"
            >
              Role Based Roadmaps
            </h2>

            <div className="grid grid-cols-1 gap-3 px-2 sm:grid-cols-2 sm:px-0 lg:grid-cols-3">
              {builtInRoleRoadmaps.map((roadmap) => {
                const roadmapProgress = learningRoadmapsToShow.find(
                  (lr) => lr.resourceId === roadmap.id,
                );

                const percentageDone =
                  (((roadmapProgress?.skipped || 0) +
                    (roadmapProgress?.done || 0)) /
                    (roadmapProgress?.total || 1)) *
                  100;

                return (
                  <HeroRoadmap
                    key={roadmap.id}
                    resourceId={roadmap.id}
                    resourceType="roadmap"
                    resourceTitle={roadmap.title}
                    isFavorite={roadmap.isFavorite}
                    percentageDone={percentageDone}
                    isNew={roadmap.isNew}
                    url={`/${roadmap.id}`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="relative mt-12 border-t border-t-[#1e293c] pt-12">
          <div className="container">
            <h2 className="text-md font-regular absolute -top-[17px] left-4 flex rounded-lg border border-[#1e293c] bg-slate-900 px-3 py-1 text-slate-400 sm:left-1/2 sm:-translate-x-1/2">
              Skill Based Roadmaps
            </h2>

            <div className="grid grid-cols-1 gap-3 px-2 sm:grid-cols-2 sm:px-0 lg:grid-cols-3">
              {builtInSkillRoadmaps.map((roadmap) => {
                const roadmapProgress = learningRoadmapsToShow.find(
                  (lr) => lr.resourceId === roadmap.id,
                );

                const percentageDone =
                  (((roadmapProgress?.skipped || 0) +
                    (roadmapProgress?.done || 0)) /
                    (roadmapProgress?.total || 1)) *
                  100;

                return (
                  <HeroRoadmap
                    key={roadmap.id}
                    resourceId={roadmap.id}
                    resourceType="roadmap"
                    resourceTitle={roadmap.title}
                    isFavorite={roadmap.isFavorite}
                    percentageDone={percentageDone}
                    isNew={roadmap.isNew}
                    url={`/${roadmap.id}`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="relative mt-12 border-t border-t-[#1e293c] pt-12">
          <div className="container">
            <h2 className="text-md font-regular absolute -top-[17px] left-4 flex rounded-lg border border-[#1e293c] bg-slate-900 px-3 py-1 text-slate-400 sm:left-1/2 sm:-translate-x-1/2">
              Project Ideas
            </h2>

            <div className="grid grid-cols-1 gap-3 px-2 sm:grid-cols-2 sm:px-0 lg:grid-cols-3">
              {projectGroups.map((projectGroup) => {
                return (
                  <HeroRoadmap
                    percentageDone={0}
                    key={projectGroup.id}
                    resourceId={projectGroup.id}
                    resourceType="roadmap"
                    resourceTitle={projectGroup.title}
                    url={`/${projectGroup.id}/projects`}
                    allowFavorite={false}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="relative mt-12 border-t border-t-[#1e293c] pt-12">
          <div className="container">
            <h2 className="text-md font-regular absolute -top-[17px] left-4 flex rounded-lg border border-[#1e293c] bg-slate-900 px-3 py-1 text-slate-400 sm:left-1/2 sm:-translate-x-1/2">
              Best Practices
            </h2>

            <div className="grid grid-cols-1 gap-3 px-2 sm:grid-cols-2 sm:px-0 lg:grid-cols-3">
              {builtInBestPractices.map((roadmap) => {
                const roadmapProgress = learningRoadmapsToShow.find(
                  (lr) => lr.resourceId === roadmap.id,
                );

                const percentageDone =
                  (((roadmapProgress?.skipped || 0) +
                    (roadmapProgress?.done || 0)) /
                    (roadmapProgress?.total || 1)) *
                  100;

                return (
                  <HeroRoadmap
                    key={roadmap.id}
                    resourceId={roadmap.id}
                    resourceType="best-practice"
                    resourceTitle={roadmap.title}
                    isFavorite={roadmap.isFavorite}
                    percentageDone={percentageDone}
                    isNew={roadmap.isNew}
                    url={`/best-practices/${roadmap.id}`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 bg-gray-50 px-4 py-5 sm:gap-16 sm:px-0 sm:py-16">
        <FeaturedGuideList
          heading="Guides"
          guides={guides.slice(0, 15)}
          questions={guides
            .filter((guide) => guide.roadmapId === 'questions')
            .slice(0, 15)}
        />
        <FeaturedVideoList heading="Videos" videos={videos} />
      </div>
    </div>
  );
}
