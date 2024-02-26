const request = require("supertest");
const express = require('express');
const jwt = require('jsonwebtoken');

const { Booking } = require("../models/booking");
const { Room } = require("../models/room");
const { Team } = require("../models/team");
const router = require("../routes/bookings");

jest.mock("../models/booking");
jest.mock("../models/room");
jest.mock("../models/team");

const app = express();
app.use(express.json());
app.use("/bookings", router);

describe("Booking Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should create a new booking", async () => {
    const mockRoomData = { _id: "room1", name: "Room 1" };
    const mockTeamData = { _id: "team1", name: "Team 1" };
    Room.findById.mockResolvedValue(mockRoomData);
    Team.findById.mockResolvedValue(mockTeamData);

    Booking.findOne.mockResolvedValue(null);

    const mockSavedBooking = {
      _id: "1",
      ...mockRoomData,
      ...mockTeamData,
    };
    Booking.prototype.save.mockResolvedValue(mockSavedBooking);

    const token = jwt.sign({ userId: '65d9b2e2ae5c8f0835ebb759' }, 'secret-is-nice');

    const response = await request(app)
      .post("/bookings")
      .set('Authorization', `Bearer ${token}`)
      .send({
        roomId: "room1",
        teamId: "team1",
        day: new Date(),
        morningBooked: true,
      });

    expect(response.status).toBe(200);

    expect(response.body).toEqual(mockSavedBooking);
  });
});
