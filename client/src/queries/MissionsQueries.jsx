import { queryOptions } from '@tanstack/react-query';
import { getMissionById } from '../services/MissionsServices';

export const getMissionByIdQueryOptions = (params, options) => {
  return queryOptions({
    queryKey: ['getMission', params],
    queryFn: () => getMissionById(params),
    ...options,
  });
};
