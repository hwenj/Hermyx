import api from '../config/api';

// Finds mission by id
export const getMissionById = async (id) => {
  const { data } = await api.get(`/missions/${id}`);
  return data.mission;
};
