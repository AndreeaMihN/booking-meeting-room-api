const request = require('supertest');
const express = require('express');
const router = require('../routes/offices');
const { Office } = require('../models/office');

jest.mock('../models/office');

describe('Office Routes', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET / should return list of offices', async () => {
    const offices = [{ name: 'Office 1' }, { name: 'Office 2' }];
    Office.find.mockResolvedValue(offices);

    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(offices);
  });

  it('GET /:id should return an office', async () => {
    const office = { _id: '123', name: 'Office 1' };
    Office.findById.mockResolvedValue(office);

    const response = await request(app).get('/123');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(office);
  });

});
