import { useQuery } from '@tanstack/react-query';
import { queryClient } from '../../stores/query-client';
import {
  aiQuestionSuggestionsOptions,
  type AIQuestionSuggestionsResponse,
} from '../../queries/user-ai-session';
import type { AllowedFormat } from './ContentGenerator';
import { Loader2Icon, RefreshCcwIcon, SendIcon, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/classname';
import { flushSync } from 'react-dom';
import { CheckIcon } from '../ReactIcons/CheckIcon';
import { Tooltip } from '../Tooltip';

export type QuestionAnswerChatMessage =
  | { role: 'user'; answer: string }
  | {
      role: 'assistant';
      question: string;
      possibleAnswers: string[];
    };

type QuestionAnswerChatProps = {
  term: string;
  format: AllowedFormat | (string & {});
  questionAnswerChatMessages: QuestionAnswerChatMessage[];
  setQuestionAnswerChatMessages: (
    messages: QuestionAnswerChatMessage[],
  ) => void;
  defaultQuestions?: AIQuestionSuggestionsResponse['questions'];
  type?: 'create' | 'update';

  from?: 'content' | 'quiz';

  className?: string;
};

export function QuestionAnswerChat(props: QuestionAnswerChatProps) {
  const {
    term,
    format,
    defaultQuestions,
    questionAnswerChatMessages,
    setQuestionAnswerChatMessages,
    type = 'create',
    className = '',
    from = 'content',
  } = props;

  const [activeMessageIndex, setActiveMessageIndex] = useState(
    defaultQuestions?.length ?? 0,
  );
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'answering' | 'done'>('answering');

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    data: aiQuestionSuggestions,
    isLoading: isLoadingAiQuestionSuggestions,
  } = useQuery(
    aiQuestionSuggestionsOptions({ term, format, from }, defaultQuestions),
    queryClient,
  );

  const activeMessage = aiQuestionSuggestions?.questions[activeMessageIndex];

  const scrollToBottom = () => {
    if (!scrollAreaRef.current) {
      return;
    }

    scrollAreaRef.current.scrollTo({
      top: scrollAreaRef.current.scrollHeight,
      behavior: 'instant',
    });
  };
  const handleAnswerSelect = (answer: string) => {
    const trimmedAnswer = answer.trim();
    if (!activeMessage || !trimmedAnswer) {
      return;
    }

    const newMessages: QuestionAnswerChatMessage[] = [
      ...questionAnswerChatMessages,
      {
        role: 'assistant',
        ...activeMessage,
      },
      {
        role: 'user',
        answer: trimmedAnswer,
      },
    ];

    setQuestionAnswerChatMessages(newMessages);
    setMessage('');

    const hasMoreMessages =
      activeMessageIndex < aiQuestionSuggestions.questions.length - 1;
    if (!hasMoreMessages) {
      setStatus('done');
      return;
    }

    flushSync(() => {
      setActiveMessageIndex(activeMessageIndex + 1);
      setStatus('answering');

      // focus the input
      inputRef.current?.focus();
    });

    scrollToBottom();
  };

  const handleReset = () => {
    setQuestionAnswerChatMessages([]);
    setActiveMessageIndex(0);
    setStatus('answering');
  };

  const handleEditMessage = (messageIndex: number) => {
    // Remove the assistant question and user answer pair
    // Since user messages are at odd indices, we want to remove both
    // the assistant message (at messageIndex - 1) and the user message (at messageIndex)
    const assistantMessageIndex = messageIndex - 1;
    const newMessages = questionAnswerChatMessages.slice(
      0,
      assistantMessageIndex,
    );
    setQuestionAnswerChatMessages(newMessages);

    // Calculate which question should be active
    // Since we removed both assistant and user messages, the question index
    // is simply assistantMessageIndex / 2
    const questionIndex = Math.floor(assistantMessageIndex / 2);
    setActiveMessageIndex(questionIndex);
    setStatus('answering');

    setMessage('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  useEffect(() => {
    scrollToBottom();
  }, [defaultQuestions, type]);

  return (
    <>
      <div
        className={cn(
          'relative h-[350px] w-full overflow-hidden rounded-xl border border-gray-200 bg-white',
          className,
        )}
      >
        {isLoadingAiQuestionSuggestions && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <div className="flex animate-pulse items-center gap-2 rounded-full border border-gray-200 bg-gray-50 p-2 px-4 text-sm">
              <Loader2Icon className="size-4 animate-spin" />
              <span>Generating personalized questions...</span>
            </div>
          </div>
        )}

        {!isLoadingAiQuestionSuggestions && status === 'done' && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <div className="flex flex-col items-center">
              <CheckIcon additionalClasses="size-12" />
              <p className="mt-3 text-lg font-semibold">Preferences saved</p>
              <p className="text-sm text-gray-500">
                You can now start generating {format}
              </p>

              <button
                className="mt-4 flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-1.5 text-sm text-gray-500 hover:bg-gray-200 focus:outline-none"
                onClick={handleReset}
              >
                <RefreshCcwIcon className="size-3.5" />
                Reanswer questions
              </button>
            </div>
          </div>
        )}

        {!isLoadingAiQuestionSuggestions && status === 'answering' && (
          <>
            <div className="flex h-full w-full flex-col bg-white">
              <div
                ref={scrollAreaRef}
                className="relative h-full w-full grow overflow-y-auto"
              >
                <div className="absolute inset-0 flex flex-col">
                  <div className="flex w-full grow flex-col justify-end gap-2 p-2">
                    {questionAnswerChatMessages.map((message, index) => (
                      <QuestionAnswerChatMessage
                        key={index}
                        role={message.role}
                        question={
                          message.role === 'assistant'
                            ? message.question
                            : undefined
                        }
                        answer={
                          message.role === 'user' ? message.answer : undefined
                        }
                        onEdit={
                          message.role === 'user'
                            ? () => handleEditMessage(index)
                            : undefined
                        }
                      />
                    ))}

                    {activeMessage && (
                      <QuestionAnswerChatMessage
                        role="assistant"
                        question={activeMessage?.question ?? ''}
                        possibleAnswers={activeMessage.possibleAnswers}
                        onAnswerSelect={handleAnswerSelect}
                      />
                    )}
                  </div>
                </div>
              </div>

              {!activeMessage && type === 'update' && (
                <div className="p-2">
                  <button
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-200 p-2 hover:bg-gray-300"
                    onClick={() => {
                      setQuestionAnswerChatMessages([]);
                      setActiveMessageIndex(0);
                      setStatus('answering');
                    }}
                  >
                    <Trash2 className="size-4" />
                    Reanswer all questions
                  </button>
                </div>
              )}

              {activeMessage && (
                <div className="p-2">
                  <div className="rounded-lg border border-gray-200 bg-white">
                    <div className="flex w-full items-center justify-between gap-2 p-2">
                      <input
                        ref={inputRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-transparent text-sm focus:outline-none"
                        placeholder={
                          activeMessage.possibleAnswers
                            ? 'Type your answer...'
                            : 'Or type your own answer...'
                        }
                        data-clarity-unmask="true"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAnswerSelect(message);
                            setMessage('');
                          }
                        }}
                      />

                      <button
                        type="button"
                        className="flex size-7 shrink-0 items-center justify-center rounded-md hover:bg-gray-100 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={!message}
                        onClick={() => {
                          handleAnswerSelect(message);
                          setMessage('');
                        }}
                      >
                        <SendIcon className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

type QuestionAnswerChatMessageProps = {
  role: 'user' | 'assistant';
  question?: string;
  answer?: string;
  possibleAnswers?: string[];
  onAnswerSelect?: (answer: string) => void;
  onEdit?: () => void;
};

function QuestionAnswerChatMessage(props: QuestionAnswerChatMessageProps) {
  const { role, question, answer, possibleAnswers, onAnswerSelect, onEdit } =
    props;

  const hasAnswers = possibleAnswers && possibleAnswers.length > 0;

  return (
    <div
      className={cn(
        'flex w-fit items-center gap-2 rounded-lg border p-2 text-pretty',
        role === 'user' && 'self-end border-gray-200 bg-gray-300/30',
        role === 'assistant' && 'border-yellow-200 bg-yellow-300/30',
      )}
    >
      {role === 'assistant' && (
        <div className="text-sm">
          <div className={cn(hasAnswers && 'mb-2')}>{question}</div>
          {hasAnswers && onAnswerSelect && (
            <div className="mt-2">
              <div className="flex flex-wrap gap-1.5">
                {possibleAnswers.map((answer) => (
                  <button
                    type="button"
                    key={answer}
                    className="cursor-pointer rounded-md border border-yellow-300/50 bg-white/70 px-2 py-1 text-xs text-gray-700 hover:bg-white hover:shadow-sm focus:outline-none"
                    onClick={() => {
                      onAnswerSelect(answer);
                    }}
                  >
                    {answer}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {role === 'user' && (
        <div className="flex items-center gap-2">
          <div className="text-sm">{answer}</div>
          {onEdit && (
            <div className="group relative">
              <button
                type="button"
                className="flex size-6 shrink-0 items-center justify-center rounded-md text-gray-500 opacity-70 hover:bg-gray-100 hover:opacity-100 focus:outline-none"
                onClick={onEdit}
              >
                <Trash2 className="size-4" />
              </button>
              <Tooltip additionalClass="-translate-y-2" position="top-right">
                Reanswer after this point
              </Tooltip>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
