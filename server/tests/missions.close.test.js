import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import pool from '../src/config/db.config.js';

const testMission = vi.hoisted(() => {
  return {
    title: 'Closeable mission',
    description: 'Mission ready to be closed.',
    vacancies: 2,
    monetaryReward: 250,
    difficulty: 3,
    status: 'funded',
  };
});

const testUsers = vi.hoisted(() => {
  return {
    owner: {
      email: 'owner@email.com',
      username: 'missionOwner',
      firebaseUid: 'owner-firebase-uid-123',
    },
    anotherOwner: {
      email: 'another-owner@email.com',
      username: 'anotherOwner',
      firebaseUid: 'another-owner-firebase-uid-123',
    },
    adventurers: [
      {
        email: 'adventurer-one@email.com',
        username: 'missionAdventurerOne',
        firebaseUid: 'adventurer-one-firebase-uid-123',
      },
      {
        email: 'adventurer-two@email.com',
        username: 'missionAdventurerTwo',
        firebaseUid: 'adventurer-two-firebase-uid-123',
      },
    ],
  };
});

let ownerId;
let anotherOwnerId;
let authenticatedUserId;
let adventurerIds;

vi.mock('../src/middlewares/auth.middleware.js', () => {
  return {
    verifyToken: (req, res, next) => {
      req.user = { uid: authenticatedUserId };
      next();
    },
  };
});

beforeEach(async () => {
  await pool.query('TRUNCATE TABLE mission_participation CASCADE');
  await pool.query('TRUNCATE TABLE mission CASCADE');
  await pool.query('TRUNCATE TABLE app_user CASCADE');

  const ownerResult = await pool.query(
    'INSERT INTO app_user (email, username, firebase_uid) VALUES ($1, $2, $3) RETURNING uid',
    [
      testUsers.owner.email,
      testUsers.owner.username,
      testUsers.owner.firebaseUid,
    ],
  );

  ownerId = ownerResult.rows[0].uid;
  authenticatedUserId = ownerId;

  const anotherOwnerResult = await pool.query(
    'INSERT INTO app_user (email, username, firebase_uid) VALUES ($1, $2, $3) RETURNING uid',
    [
      testUsers.anotherOwner.email,
      testUsers.anotherOwner.username,
      testUsers.anotherOwner.firebaseUid,
    ],
  );

  anotherOwnerId = anotherOwnerResult.rows[0].uid;
  adventurerIds = [];

  for (const adventurer of testUsers.adventurers) {
    const adventurerResult = await pool.query(
      'INSERT INTO app_user (email, username, firebase_uid) VALUES ($1, $2, $3) RETURNING uid',
      [adventurer.email, adventurer.username, adventurer.firebaseUid],
    );

    adventurerIds.push(adventurerResult.rows[0].uid);
  }
});

afterAll(async () => {
  await pool.end();
});

const createMission = async ({ vacancies = testMission.vacancies } = {}) => {
  const missionResult = await pool.query(
    'INSERT INTO mission (publication_date, title, description, difficulty, vacancies, monetary_reward, status, owner_id) VALUES (NOW(), $1, $2, $3, $4, $5, $6, $7) RETURNING mid',
    [
      testMission.title,
      testMission.description,
      testMission.difficulty,
      vacancies,
      testMission.monetaryReward,
      testMission.status,
      ownerId,
    ],
  );

  return missionResult.rows[0].mid;
};

const addParticipants = async (missionId, participants) => {
  for (const adventurerId of participants) {
    await pool.query(
      'INSERT INTO mission_participation (mid, adventurer_id) VALUES ($1, $2)',
      [missionId, adventurerId],
    );
  }
};

const getMissionStatus = async (missionId) => {
  const missionResult = await pool.query(
    'SELECT status FROM mission WHERE mid = $1',
    [missionId],
  );

  return missionResult.rows[0].status;
};

describe('POST /api/missions/:missionId/close', () => {
  it('should close a mission when all vacancies are occupied', async () => {
    const missionId = await createMission({ vacancies: 2 });

    await addParticipants(missionId, adventurerIds);

    const response = await request(app).post(
      `/api/missions/${missionId}/close`,
    );

    const updatedStatus = await getMissionStatus(missionId);

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toEqual(
      expect.stringContaining('json'),
    );
    expect(response.body.message).toBe('Mission closed.');
    expect(response.body.status).toBe('in_progress');
    expect(response.body.participants).toBe(2);
    expect(updatedStatus).toBe('in_progress');
  });

  it('should close a mission when at least one vacancy is occupied', async () => {
    const missionId = await createMission({ vacancies: 2 });

    await addParticipants(missionId, [adventurerIds[0]]);

    const response = await request(app).post(
      `/api/missions/${missionId}/close`,
    );

    const updatedStatus = await getMissionStatus(missionId);

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toEqual(
      expect.stringContaining('json'),
    );
    expect(response.body.message).toBe('Mission closed.');
    expect(response.body.status).toBe('in_progress');
    expect(response.body.participants).toBe(1);
    expect(updatedStatus).toBe('in_progress');
  });

  it('should not close a mission without occupied vacancies', async () => {
    const missionId = await createMission();

    const response = await request(app).post(
      `/api/missions/${missionId}/close`,
    );

    const updatedStatus = await getMissionStatus(missionId);

    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toEqual(
      expect.stringContaining('json'),
    );
    expect(response.body.error).toBe(
      'You cannot close a mission without adventurers',
    );
    expect(updatedStatus).toBe(testMission.status);
  });

  it('should not close a mission if the authenticated user is not the owner', async () => {
    const missionId = await createMission();
    authenticatedUserId = anotherOwnerId;

    await addParticipants(missionId, [adventurerIds[0]]);

    const response = await request(app).post(
      `/api/missions/${missionId}/close`,
    );

    const updatedStatus = await getMissionStatus(missionId);

    expect(response.status).toBe(403);
    expect(response.headers['content-type']).toEqual(
      expect.stringContaining('json'),
    );
    expect(response.body.error).toBe(
      'You do not have permission to close this mission.',
    );
    expect(updatedStatus).toBe(testMission.status);
  });

  it('should return 404 when the mission does not exist', async () => {
    const response = await request(app).post('/api/missions/999999/close');

    expect(response.status).toBe(404);
    expect(response.headers['content-type']).toEqual(
      expect.stringContaining('json'),
    );
    expect(response.body.error).toBe('Mission not found');
  });
});
