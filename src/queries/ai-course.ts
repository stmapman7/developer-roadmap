import { httpGet } from '../lib/query-http';
import { isLoggedIn } from '../lib/jwt';
import { queryOptions } from '@tanstack/react-query';
import type { QuestionAnswerChatMessage } from '../components/ContentGenerator/QuestionAnswerChat';

export interface AICourseProgressDocument {
  _id: string;
  userId: string;
  courseId: string;
  done: string[];
  createdAt: Date;
  updatedAt: Date;
}

type AICourseModule = {
  title: string;
  lessons: string[];
};

type GetAICourseParams = {
  aiCourseSlug: string;
};

export interface AICourseDocument {
  _id: string;
  userId: string;
  title: string;
  slug?: string;
  keyword: string;
  done: string[];
  difficulty: string;
  modules: AICourseModule[];
  viewCount: number;
  questionAndAnswers?: QuestionAnswerChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

type GetAICourseResponse = AICourseDocument;

export function getAiCourseOptions(params: GetAICourseParams) {
  return {
    queryKey: ['ai-course', params],
    queryFn: () => {
      return httpGet<GetAICourseResponse>(
        `/v1-get-ai-course/${params.aiCourseSlug}`,
      );
    },
    enabled: !!params.aiCourseSlug,
    refetchOnMount: false,
  };
}

export type GetAICourseLimitResponse = {
  used: number;
  limit: number;
  course: {
    used: number;
    limit: number;
  };
  guide: {
    used: number;
    limit: number;
  };
  roadmap: {
    used: number;
    limit: number;
  };
  quiz: {
    used: number;
    limit: number;
  };
};

export function aiLimitOptions() {
  return queryOptions({
    queryKey: ['ai-course-limit'],
    queryFn: () => {
      return httpGet<GetAICourseLimitResponse>(`/v1-get-ai-course-limit`);
    },
    enabled: !!isLoggedIn(),
    retryOnMount: false,
    refetchOnMount: false,
  });
}

export type ListUserAiCoursesQuery = {
  perPage?: string;
  currPage?: string;
  query?: string;
};

export type AICourseWithLessonCount = AICourseDocument & {
  lessonCount: number;
};

type ListUserAiCoursesResponse = {
  data: AICourseWithLessonCount[];
  totalCount: number;
  totalPages: number;
  currPage: number;
  perPage: number;
};

export function listUserAiCoursesOptions(
  params: ListUserAiCoursesQuery = {
    perPage: '21',
    currPage: '1',
    query: '',
  },
) {
  return {
    queryKey: ['user-ai-courses', params],
    queryFn: () => {
      return httpGet<ListUserAiCoursesResponse>(
        `/v1-list-user-ai-courses`,
        params,
      );
    },
    enabled: !!isLoggedIn(),
  };
}

type ListFeaturedAiCoursesParams = {};

type ListFeaturedAiCoursesQuery = {
  perPage?: string;
  currPage?: string;
};

type ListFeaturedAiCoursesResponse = {
  data: AICourseWithLessonCount[];
  totalCount: number;
  totalPages: number;
  currPage: number;
  perPage: number;
};

export function listFeaturedAiCoursesOptions(
  params: ListFeaturedAiCoursesQuery = {
    perPage: '21',
    currPage: '1',
  },
) {
  return {
    queryKey: ['featured-ai-courses', params],
    queryFn: () => {
      return httpGet<ListFeaturedAiCoursesResponse>(
        `/v1-list-featured-ai-courses`,
        params,
      );
    },
  };
}

type ListExploreAiCoursesParams = {};

export type ListExploreAiCoursesQuery = {
  perPage?: string;
  currPage?: string;
  query?: string;
};

type ListExploreAiCoursesResponse = {
  data: AICourseWithLessonCount[];
  totalCount: number;
  totalPages: number;
  currPage: number;
  perPage: number;
};

export function listExploreAiCoursesOptions(
  params: ListExploreAiCoursesQuery = {
    perPage: '21',
    currPage: '1',
    query: '',
  },
) {
  return {
    queryKey: ['explore-ai-courses', params],
    queryFn: () => {
      return httpGet<ListExploreAiCoursesResponse>(
        `/v1-list-explore-ai-courses`,
        params,
      );
    },
  };
}
