import { useInfiniteQuery } from '@tanstack/react-query';
import { getMissionsInfiniteQueryOptions } from './../queries/MissionsQueries';
import { PAGINATION_LIMIT } from '../consts/consts';
import { MissionSearchCard } from '../components/custom/missions/MissionSearchCard';
import { Button } from '@/components/ui/button';

export const SearchMission = () => {
  // Query options
  const retryOption = (failureCount, error) => {
    if (error.response?.status === 404) return false; // So Axios won't try to search again the data if there is none
    return failureCount < 3;
  };

  // API call using React Query (if the same query is used in more than one componente it should be isolated)
  const { data, hasNextPage, isFetchNextPage, fetchNextPage } =
    useInfiniteQuery(
      getMissionsInfiniteQueryOptions(PAGINATION_LIMIT.MISSIONS, {
        retry: retryOption,
      }),
    );

  // Early returns for each state
  if (!data) return <p>It seems there is no missions yet. Add one!</p>;

  // Data destructure for cleaner code
  const missions = data?.pages.flatMap((page) => page.missions);

  return (
    <main>
      <section className='p-4'>
        <div
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
          aria-label='Missions list'
        >
          {missions?.map((mission) => (
            <MissionSearchCard
              key={mission.mid}
              mission={mission}
            ></MissionSearchCard>
          ))}
        </div>
        <div className='flex align-middle justify-center py-5'>
          <Button
            onClick={() => fetchNextPage()}
            className='rounded-lg p-2 hover:cursor-pointer'
            disabled={!hasNextPage || isFetchNextPage}
          >
            {hasNextPage
              ? isFetchNextPage
                ? 'Loading'
                : 'More missions'
              : 'No more missions to show'}
          </Button>
        </div>
      </section>
    </main>
  );
};
