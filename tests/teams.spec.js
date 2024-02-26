const request = require('supertest');
const express = require('express');
const router = require('../routes/teams');
const { Team } = require('../models/team');

jest.mock('../models/team');

describe('Team Routes', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET / should return list of teams', async () => {
    const teams = [{ name: 'Team 1', numberOfMembers: 5 }, { name: 'Team 2', numberOfMembers: 8 }];
    Team.find.mockResolvedValue(teams);

    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(teams);
  });

  it('GET /:id should return a team', async () => {
    const team = { _id: '123', name: 'Team 1', numberOfMembers: 5 };
    Team.findById.mockResolvedValue(team);

    const response = await request(app).get('/123');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(team);
  });

});
