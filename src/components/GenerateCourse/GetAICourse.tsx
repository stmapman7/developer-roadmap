import { useQuery } from '@tanstack/react-query';
import { getAiCourseOptions } from '../../queries/ai-course';
import { queryClient } from '../../stores/query-client';
import { useEffect, useState } from 'react';
import { AICourseContent } from './AICourseContent';
import { isLoggedIn } from '../../lib/jwt';
import { generateCourse } from '../../helper/generate-ai-course';

type GetAICourseProps = {
  courseSlug: string;
};

export function GetAICourse(props: GetAICourseProps) {
  const { courseSlug } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const [error, setError] = useState('');
  const { data: aiCourse, error: queryError } = useQuery(
    {
      ...getAiCourseOptions({ aiCourseSlug: courseSlug }),
      enabled: !!courseSlug,
    },
    queryClient,
  );

  useEffect(() => {
    if (!aiCourse) {
      return;
    }

    setIsLoading(false);
  }, [aiCourse]);

  useEffect(() => {
    if (!queryError) {
      return;
    }

    setIsLoading(false);
    setError(queryError.message);
  }, [queryError]);

  const handleRegenerateCourse = async (prompt?: string) => {
    if (!aiCourse) {
      return;
    }

    queryClient.setQueryData(
      getAiCourseOptions({ aiCourseSlug: courseSlug }).queryKey,
      {
        ...aiCourse,
        title: '',
        difficulty: '',
        modules: [],
      },
    );

    await generateCourse({
      term: aiCourse.keyword,
      slug: courseSlug,
      prompt,
      onCourseChange: (course, rawData) => {
        queryClient.setQueryData(
          getAiCourseOptions({ aiCourseSlug: courseSlug }).queryKey,
          {
            ...aiCourse,
            title: course.title,
            modules: course.modules,
          },
        );
      },
      onLoadingChange: (isNewLoading) => {
        setIsRegenerating(isNewLoading);
        if (!isNewLoading) {
          // TODO: Update progress
        }
      },
      onError: setError,
      isForce: true,
    });
  };

  return (
    <AICourseContent
      course={{
        title: aiCourse?.title || '',
        modules: aiCourse?.modules || [],
        done: aiCourse?.done || [],
      }}
      isLoading={isLoading || isRegenerating}
      courseSlug={courseSlug}
      error={error}
      onRegenerateOutline={handleRegenerateCourse}
      creatorId={aiCourse?.userId}
    />
  );
}
