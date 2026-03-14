// External modules
import { Router } from 'express';
const router = Router();
import {
  getUsers,
  signUp,
  getUserPublicProfile,
  getUserCompletedMissions,
} from '../controllers/users.controller.js';
import {
  validateBodySchema,
  validateQuerySchema,
} from '../middlewares/validations.middleware.js';
import { getUsersQuerySchema, signUpSchema } from '@hermyx/shared';

// Get public profile of a user by username
router.get('/', validateQuerySchema(getUsersQuerySchema), getUsers);

//Get user by username
router.get('/:username/profile', getUserPublicProfile);

// Get completed missions history of a user by username
router.get('/:username/completed-missions', getUserCompletedMissions);

// Sign up a new user
router.post('/', validateBodySchema(signUpSchema), signUp);

export default router;
