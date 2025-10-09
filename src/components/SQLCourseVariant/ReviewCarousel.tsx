import {
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
  User2Icon,
} from 'lucide-react';
import { useLayoutEffect, useMemo, useState } from 'react';
import { markdownToHtml } from '../../lib/markdown';
import { getTailwindScreenDimension } from '../../lib/is-mobile';
import { cn } from '../../lib/classname';

type Review = {
  name: string;
  role: string;
  rating: number;
  text: string | string[];
  avatarUrl?: string;
  isProminent?: boolean;
  isSecondaryProminent?: boolean;
  companyName?: string;
  companyLogo?: string;
};

export function ReviewCarousel() {
  const reviews: Review[] = [
    {
      companyName: 'Cloud Camping',
      companyLogo: 'https://assets.roadmap.sh/guest/cloudcamping-mcpl6.jpeg',
      name: 'Robin Wieruch',
      role: 'Author - Multiple Best-Sellers',
      rating: 5,
      text: [
        'Kamran has been in the **educative space for a long time**, and it shows in the way he teaches SQL: clear, structured, and straight to the point.',
        "Even if you've used SQL before, this **course will fill in gaps you didn't even realize you had**. Get ready to level up your database skills!",
      ],
      avatarUrl: 'https://assets.roadmap.sh/guest/robin.jpeg',
      isProminent: true,
    },
    {
      companyName: 'Hack Mamba',
      companyLogo: 'https://assets.roadmap.sh/guest/hackmbamba-h0ivr.jpeg',
      name: 'William Imoh',
      role: 'Founder and Data Enthusiast',
      rating: 5,
      text: [
        'I bought this course for the advanced chapters but ended up completing the entire course. I learned a lot of new things and it was **well worth the investment**.',
        'No matter your SQL experience, this course is **a must-have** if you want to level up your SQL and data analysis skills. Highly recommended!',
      ],
      avatarUrl: 'https://assets.roadmap.sh/guest/william-imoh-sd2dk.jpg',
      isProminent: true,
    },
    {
      companyName: 'GlobalLogic',
      companyLogo:
        'https://assets.roadmap.sh/guest/globallogic_logo-3m3ho.jpeg',
      name: 'Martina Milagros',
      role: 'Software Engineer',
      rating: 5,
      text: [
        'Thanks to Kamran Ahmed for the **incredible Master SQL course!** I truly appreciate the way you break down complex topics with such clarity and ease.',
        '**Highly recommend this course** to anyone looking to level up their SQL game!',
      ],
      avatarUrl: 'https://assets.roadmap.sh/guest/martina-awc4x.jpeg',
    },
    {
      companyName: 'Cisco',
      companyLogo: 'https://assets.roadmap.sh/guest/cisco-gyw5b.jpeg',
      name: 'Tomáš Janků',
      role: 'Sr. Software Engineer',
      rating: 5,
      text: "The course and it's interactivity is excellent and I'd honestly say it's **one of the best** on the SQL theme I've seen out there.",
      avatarUrl: 'https://assets.roadmap.sh/guest/tomas-janku-6bg89.jpeg',
    },
    {
      companyName: 'Beyond Works',
      companyLogo:
        'https://assets.roadmap.sh/guest/beyondwordsio_logo-xia4m.jpeg',
      name: 'Gourav Khunger',
      role: 'Software Engineer',
      rating: 5,
      text: [
        'This course was **absolutely brilliant!** The integrated database environment to practice what I learned was the best part. Being able to **run queries immediately** and see results in real-time made everything click so much faster than traditional learning methods.',
      ],
      avatarUrl: 'https://assets.roadmap.sh/guest/gourav-h2f3a.png',
    },
    {
      companyName: 'xpertSea',
      companyLogo: 'https://assets.roadmap.sh/guest/xpertsea-y24hu.jpeg',
      name: 'Meabed',
      role: 'CTO',
      rating: 5,
      text: 'Kamran has **clearly put a lot of thought** into this course. The content, structure and exercises were all great.',
      avatarUrl: 'https://assets.roadmap.sh/guest/meabed-fu83q.jpeg',
    },
    {
      companyName: 'Powersoft19',
      companyLogo: 'https://assets.roadmap.sh/guest/powersoft19-sk4t1.jpeg',
      name: 'Mohsin Aheer',
      role: 'Sr. Software Engineer',
      rating: 5,
      text: 'I already knew SQL but this course **taught me a bunch of new things.** Practical examples and challenges were great. Highly recommended!',
      avatarUrl: 'https://assets.roadmap.sh/guest/mohsinaheer-szchu.jpeg',
    },
    {
      companyName: 'xpertSea',
      companyLogo: 'https://assets.roadmap.sh/guest/xpertsea-y24hu.jpeg',
      name: 'Zeeshan',
      role: 'Sr. Software Engineer',
      rating: 5,
      text: 'Loved the teaching style and the way the course was structured. The **AI tutor was a great help** when I wanted some extra help.',
      avatarUrl: 'https://assets.roadmap.sh/guest/ziishaned-qjepj.png',
    },
    {
      companyName: 'University of Regensburg',
      companyLogo:
        'https://assets.roadmap.sh/guest/university_of_regensburg_logo-01784.jpeg',
      name: 'Faisal Ahsan',
      role: 'Software Engineer',
      rating: 5,
      text: 'The course and the learning experience was great. What I really liked was the **no-fluff explanations** and **practical examples**.',
      avatarUrl: 'https://assets.roadmap.sh/guest/faisal-q78p2.jpeg',
    },
    {
      companyName: 'xpertSea',
      companyLogo: 'https://assets.roadmap.sh/guest/xpertsea-y24hu.jpeg',
      name: 'Adnan Ahmed',
      role: 'Engineering Manager',
      rating: 5,
      text: 'Having the integrated IDE made a huge difference. Being able to **immediately practice** what I learned was **invaluable**.',
      avatarUrl: 'https://assets.roadmap.sh/guest/idnan-fzps5.jpeg',
    },
    {
      name: 'Kalvin Chakma',
      role: 'Jr. Software Engineer',
      rating: 5,
      text: "Best SQL course I've taken. The progression from basic to advanced concepts is **well thought out**, and the challenges are **excellent**.",
      avatarUrl: 'https://assets.roadmap.sh/guest/kalvin-d65ol.jpeg',
    },
  ];

  const [batchSize, setBatchSize] = useState(3);
  const maxBatchNumber = Math.ceil(reviews.length / batchSize);
  const [currentBatchNumber, setCurrentBatchNumber] = useState(0);

  const currentBatch = useMemo(() => {
    const result = reviews.slice(
      currentBatchNumber * batchSize,
      (currentBatchNumber + 1) * batchSize,
    );

    if (result.length < batchSize) {
      const remaining = batchSize - result.length;
      return [...result, ...reviews.slice(0, remaining)];
    }

    return result;
  }, [currentBatchNumber, batchSize]);

  const handleNextBatch = () => {
    setCurrentBatchNumber((prev) => (prev + 1) % maxBatchNumber);
  };

  const handlePreviousBatch = () => {
    setCurrentBatchNumber(
      (prev) => (prev - 1 + maxBatchNumber) % maxBatchNumber,
    );
  };

  useLayoutEffect(() => {
    const size = getTailwindScreenDimension();

    if (size === '2xl') {
      setBatchSize(3);
    } else if (size === 'xl' || size === 'lg') {
      setBatchSize(2);
    } else {
      setBatchSize(1);
    }
  }, []);

  return (
    <div className="mx-auto mt-16 w-full max-w-5xl">
      <h3 className="text-center text-2xl font-medium text-zinc-200 md:text-3xl">
        What other learners said
      </h3>

      <div className="mt-10 mb-6 flex items-center justify-end gap-2 xl:hidden">
        <NavigateButton
          onClick={handlePreviousBatch}
          icon={<ChevronLeftIcon className="h-4 w-4 stroke-[2.5] text-white" />}
        />
        <NavigateButton
          onClick={handleNextBatch}
          icon={
            <ChevronRightIcon className="h-4 w-4 stroke-[2.5] text-white" />
          }
        />
      </div>

      <div className="relative mt-0 flex gap-4 xl:mt-10">
        <div className="absolute inset-y-0 -left-2 hidden shrink-0 -translate-x-full flex-col items-center justify-center xl:flex">
          <NavigateButton
            onClick={handlePreviousBatch}
            icon={
              <ChevronLeftIcon className="h-5 w-5 stroke-[2.5] text-white" />
            }
          />
        </div>

        <div className="grid auto-rows-fr grid-cols-1 items-stretch gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {currentBatch.map((review, index) => (
            <div
              key={index}
              className={cn(
                'review-testimonial relative flex h-full flex-col overflow-hidden rounded-2xl bg-linear-to-br from-yellow-500/10 via-yellow-500/5 to-transparent p-8 backdrop-blur-sm lg:min-h-[456px] [&_strong]:font-normal [&_strong]:text-yellow-300/70',
                index === 2 && batchSize === 3 && 'hidden xl:flex',
                index === 1 && batchSize === 3 && 'hidden lg:flex',
              )}
            >
              <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-yellow-500/5" />
              <div className="mb-4 flex items-center gap-4">
                {review.avatarUrl && (
                  <img
                    src={review.avatarUrl}
                    alt={review.name}
                    className="h-16 w-16 rounded-full border-2 border-yellow-500/20 object-cover"
                  />
                )}
                {!review.avatarUrl && (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800">
                    <User2Icon className="h-8 w-8 text-zinc-400" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-zinc-100">
                    {review.name}
                  </h3>
                  <p className="text-sm text-yellow-500/70">{review.role}</p>
                  <div className="mt-1 flex">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <StarIcon
                        key={i}
                        className="h-4 w-4 fill-yellow-500 text-yellow-500"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-3">
                {(typeof review.text === 'string'
                  ? [review.text]
                  : review.text
                ).map((text, index) => (
                  <p
                    key={index}
                    className="text-zinc-400 [&_strong]:font-semibold! [&_strong]:text-white!"
                    dangerouslySetInnerHTML={{
                      __html: markdownToHtml(text),
                    }}
                  />
                ))}
              </div>

              {review?.companyName && (
                <div className="mt-10 flex items-center gap-3">
                  {review?.companyLogo && (
                    <img
                      src={review?.companyLogo}
                      alt={review?.companyName}
                      className="h-10 w-10 rounded-lg border border-yellow-500/20 object-cover"
                    />
                  )}
                  <div className="text-lg font-medium text-zinc-200">
                    {review?.companyName}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="absolute inset-y-0 -right-2 hidden shrink-0 translate-x-full flex-col items-center justify-center xl:flex">
          <NavigateButton
            onClick={handleNextBatch}
            icon={
              <ChevronRightIcon className="h-5 w-5 stroke-[2.5] text-white" />
            }
          />
        </div>
      </div>
    </div>
  );
}

type NavigateButtonProps = {
  onClick: () => void;
  icon: React.ReactNode;
};

function NavigateButton(props: NavigateButtonProps) {
  const { onClick, icon } = props;

  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center rounded-full bg-zinc-800 p-2 hover:bg-zinc-700"
    >
      {icon}
    </button>
  );
}
