const { User } = require("../../../models/users");
const mongoose = require("mongoose");
const auth = require("../../../middleware/auth");

describe("auth middleware", () => {
  afterAll(async () => {
    mongoose.disconnect();
  });

  it("it should populate req.user with the payload of a valid JWT", () => {
    //we need testing payload
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };

    //we need a valid token
    const user = new User(payload);
    const token = user.generateAuthToken();

    //we need to mock req, res and next because auth() expects them.
    //we create mock header function to return the token
    const req = { header: jest.fn().mockReturnValue(token) };
    const res = {}; //we dont use res so we create an empty object
    const next = jest.fn(); //we just need next() to be a function

    auth(req, res, next); // this will access req and add new property user
    expect(req.user).toMatchObject(payload); //we test if req.user contains decoded payload
  });
});
