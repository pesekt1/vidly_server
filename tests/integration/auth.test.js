const request = require("supertest");
const { Genre } = require("../../models/genres");
const { User } = require("../../models/users");

let server;

//test suite
describe("auth middleware", () => {
  let name;
  let token;

  //setting up a happy path - this is a successful path template
  exec = () => {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name });
  };

  //before each test we initialize variables for the happy path.
  beforeEach(() => {
    server = require("../../index"); //loading server before each test
    token = new User().generateAuthToken();
    name = "genre1";
  });

  afterEach(async () => {
    await server.close(); //closing server after each test
    await Genre.remove({}); // dropping collection genres after each test
  });

  //no token - status 401
  it("should return 401 if client is not logged in", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  //invalid token - status 400
  it("should return 400 if json web token is invalid", async () => {
    token = "a";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  //invalid token - status 400
  it("should return 200 if json web token is valid", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
