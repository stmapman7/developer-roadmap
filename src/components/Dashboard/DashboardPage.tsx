import { useStore } from '@nanostores/react';
import { useEffect, useState } from 'react';
import { useParams } from '../../hooks/use-params';
import { useToast } from '../../hooks/use-toast';
import { httpGet } from '../../lib/http';
import { getUser } from '../../lib/jwt';
import { $teamList } from '../../stores/team';
import type { TeamListResponse } from '../TeamDropdown/TeamDropdown';
import { DashboardTabButton } from './DashboardTabButton';
import { PersonalDashboard, type BuiltInRoadmap } from './PersonalDashboard';
import { TeamDashboard } from './TeamDashboard';
import type { QuestionGroupType } from '../../lib/question-group';
import type { VideoFileType } from '../../lib/video';
import { cn } from '../../lib/classname';
import type { OfficialGuideDocument } from '../../queries/official-guide';

type DashboardPageProps = {
  builtInRoleRoadmaps?: BuiltInRoadmap[];
  builtInSkillRoadmaps?: BuiltInRoadmap[];
  builtInBestPractices?: BuiltInRoadmap[];
  isTeamPage?: boolean;
  questionGroups?: QuestionGroupType[];
  guides?: OfficialGuideDocument[];
  videos?: VideoFileType[];
};

export function DashboardPage(props: DashboardPageProps) {
  const {
    builtInRoleRoadmaps,
    builtInBestPractices,
    builtInSkillRoadmaps,
    isTeamPage = false,
    guides,
    videos,
  } = props;

  const currentUser = getUser();
  const toast = useToast();
  const teamList = useStore($teamList);

  const { t: currTeamId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [selectedTeamId, setSelectedTeamId] = useState<string>();

  async function getAllTeams() {
    if (teamList.length > 0) {
      return;
    }

    const { response, error } = await httpGet<TeamListResponse>(
      `${import.meta.env.PUBLIC_API_URL}/v1-get-user-teams`,
    );
    if (error || !response) {
      toast.error(error?.message || 'Something went wrong');
      return;
    }

    $teamList.set(response);
  }

  useEffect(() => {
    getAllTeams().finally(() => {
      if (currTeamId) {
        setSelectedTeamId(currTeamId);
      }

      setIsLoading(false);
    });
  }, [currTeamId]);

  const userAvatar =
    currentUser?.avatar && !isLoading
      ? `${import.meta.env.PUBLIC_AVATAR_BASE_URL}/${currentUser.avatar}`
      : '/img/default-avatar.png';

  return (
    <>
      <div
        className={cn('bg-slate-900', {
          'striped-loader-slate': isLoading,
        })}
      >
        <div className="min-h-[70px] bg-slate-800/30 py-5">
          <div className="container flex flex-wrap items-center gap-1.5">
            {!isLoading && (
              <>
                <DashboardTabButton
                  label="Personal"
                  isActive={!selectedTeamId && !isTeamPage}
                  href="/dashboard"
                  avatar={userAvatar}
                />
                {teamList.map((team) => {
                  const { avatar } = team;
                  const avatarUrl = avatar
                    ? `${import.meta.env.PUBLIC_AVATAR_BASE_URL}/${avatar}`
                    : '/img/default-avatar.png';
                  return (
                    <DashboardTabButton
                      key={team._id}
                      label={team.name}
                      isActive={team._id === selectedTeamId}
                      {...(team.status === 'invited'
                        ? {
                            href: `/respond-invite?i=${team.memberId}`,
                          }
                        : {
                            href: `/teams/${team._id}/activity`,
                          })}
                      avatar={avatarUrl}
                    />
                  );
                })}
                <DashboardTabButton
                  label="+ Create Team"
                  isActive={false}
                  href="/teams/new"
                  className="border border-dashed border-slate-700 bg-transparent px-3 text-sm text-[13px] text-gray-500 hover:border-solid hover:border-slate-700 hover:text-gray-400"
                />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="">
        {!selectedTeamId && !isTeamPage && (
          <div className="bg-slate-900">
            <PersonalDashboard
              builtInRoleRoadmaps={builtInRoleRoadmaps}
              builtInSkillRoadmaps={builtInSkillRoadmaps}
              builtInBestPractices={builtInBestPractices}
              guides={guides}
              videos={videos}
            />
          </div>
        )}

        {(selectedTeamId || isTeamPage) && (
          <div className="container">
            <TeamDashboard
              builtInRoleRoadmaps={builtInRoleRoadmaps!}
              builtInSkillRoadmaps={builtInSkillRoadmaps!}
              teamId={selectedTeamId!}
            />
          </div>
        )}
      </div>
    </>
  );
}
