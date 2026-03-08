import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { getMissionById, getMissions } from '../services/MissionsServices';

export const getMissionByIdQueryOptions = (params, options) => {
  return queryOptions({
    queryKey: ['getMission', params],
    queryFn: () => getMissionById(params),
    ...options,
  });
};

export const getMissionsInfiniteQueryOptions = (limit, options) => {
  return infiniteQueryOptions({
    queryKey: ['getMissions'],
    queryFn: ({ pageParam }) => getMissions({ page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasMore
        ? lastPage.pagination.currentPage + 1
        : undefined;
    },
    ...options,
  });
};
