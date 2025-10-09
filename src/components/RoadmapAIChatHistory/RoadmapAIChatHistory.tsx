import { HistoryIcon, Loader2Icon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover';
import { useEffect, useMemo, useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { listChatHistoryOptions } from '../../queries/chat-history';
import { isLoggedIn } from '../../lib/jwt';
import { groupChatHistory } from '../../helper/grouping';
import { ChatHistoryGroup } from '../AIChatHistory/ChatHistoryGroup';
import { queryClient } from '../../stores/query-client';
import { SearchAIChatHistory } from '../AIChatHistory/SearchAIChatHistory';
import { billingDetailsOptions } from '../../queries/billing';
import { UpgradeToProMessage } from '../AIChatHistory/ListChatHistory';
import { showLoginPopup } from '../../lib/popup';

type RoadmapAIChatHistoryProps = {
  roadmapId: string;
  activeChatHistoryId?: string;
  activeChatHistoryTitle?: string;
  onChatHistoryClick: (id: string) => void;
  onDelete?: (id: string) => void;
  onUpgrade?: () => void;
};

export function RoadmapAIChatHistory(props: RoadmapAIChatHistoryProps) {
  const {
    roadmapId,
    activeChatHistoryId,
    activeChatHistoryTitle,
    onChatHistoryClick,
    onDelete,
    onUpgrade,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');

  const { data: userBillingDetails, isLoading: isBillingDetailsLoading } =
    useQuery(billingDetailsOptions(), queryClient);
  const isPaidUser = userBillingDetails?.status === 'active';
  const {
    data: chatHistory,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading: isLoadingInfiniteQuery,
  } = useInfiniteQuery(
    {
      ...listChatHistoryOptions({
        roadmapId,
        query,
      }),
      enabled: !!roadmapId && isLoggedIn() && isOpen && isPaidUser,
    },
    queryClient,
  );

  // no initial spinner if not paid user
  // because we won't fetch the data
  useEffect(() => {
    if (!isPaidUser) {
      setIsLoading(false);
    }
  }, [isPaidUser]);

  useEffect(() => {
    if (!chatHistory || isBillingDetailsLoading) {
      return;
    }

    setIsLoading(false);
  }, [chatHistory, isBillingDetailsLoading]);

  const groupedChatHistory = useMemo(() => {
    const allHistories = chatHistory?.pages?.flatMap((page) => page.data);
    return groupChatHistory(allHistories ?? []);
  }, [chatHistory?.pages]);
  const isEmptyHistory = Object.values(groupedChatHistory ?? {}).every(
    (group) => group.histories.length === 0,
  );

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        if (!isLoggedIn()) {
          showLoginPopup();
          return;
        }

        setIsOpen(open);
      }}
    >
      <PopoverTrigger className="flex items-center justify-center gap-2 rounded-md bg-gray-200 px-3 py-1.5 text-xs text-gray-900 hover:bg-gray-300 hover:text-black">
        <HistoryIcon className="size-3.5" />
        {activeChatHistoryTitle || 'Chat History'}
      </PopoverTrigger>
      <PopoverContent
        className="z-[999] flex max-h-[400px] w-80 flex-col overflow-hidden p-0 shadow-lg"
        align="end"
        sideOffset={4}
      >
        {isLoading && (
          <div className="flex items-center justify-center py-10">
            <Loader2Icon className="size-6 animate-spin stroke-[2.5] text-gray-400" />
          </div>
        )}

        {!isLoading && !isPaidUser && (
          <UpgradeToProMessage
            className="mt-0 px-10 py-10"
            onUpgrade={() => {
              setIsOpen(false);
              onUpgrade?.();
            }}
          />
        )}

        {!isLoading && isPaidUser && (
          <>
            <SearchAIChatHistory
              onSearch={setQuery}
              isLoading={isLoadingInfiniteQuery}
              className="mt-0"
              inputClassName="border-x-0 border-t-0 border-b border-b-gray-200 rounded-none focus:border-b-gray-200"
            />

            <div className="scrollbar-track-transparent scrollbar-thin scrollbar-thumb-gray-300 grow space-y-4 overflow-y-auto p-2 pt-4">
              {isEmptyHistory && (
                <div className="flex items-center justify-center py-10">
                  <p className="text-sm text-gray-500">No chat history</p>
                </div>
              )}

              {Object.entries(groupedChatHistory ?? {}).map(([key, value]) => {
                if (value.histories.length === 0) {
                  return null;
                }

                return (
                  <ChatHistoryGroup
                    key={key}
                    title={value.title}
                    histories={value.histories}
                    activeChatHistoryId={activeChatHistoryId}
                    onChatHistoryClick={(id) => {
                      setIsOpen(false);
                      onChatHistoryClick(id);
                    }}
                    onDelete={(id) => {
                      setIsOpen(false);
                      onDelete?.(id);
                    }}
                  />
                );
              })}

              {hasNextPage && (
                <div className="mt-4">
                  <button
                    className="flex w-full items-center justify-center gap-2 text-sm text-gray-500 hover:text-black"
                    onClick={() => {
                      fetchNextPage();
                    }}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage && (
                      <>
                        <Loader2Icon className="h-4 w-4 animate-spin" />
                        Loading more...
                      </>
                    )}
                    {!isFetchingNextPage && 'Load More'}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
