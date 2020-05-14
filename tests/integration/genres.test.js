const request = require("supertest");
const { Genre } = require("../../models/genres");
const { User } = require("../../models/users");

let server; // create a server variable, which we can change later

//test suite for genres API:
describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index"); //loading server before each test
  });
  afterEach(async () => {
    await server.close(); //closing server after each test
    await Genre.remove({}); // dropping collection genres after each test
  });

  //nested test suite for GET request
  describe("GET /", () => {
    it("should return all genres", async () => {
      const payload = [
        { name: "genre1" },
        { name: "genre2" },
        { name: "genre3" },
      ];

      //populate genres collection in test database
      await Genre.insertMany(payload);
      //payload[0].name = "new genre"; //simulating error

      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body).toMatchObject(payload);
    });
  });

  //nested test suite for GET:id request
  describe("GET /:id", () => {
    it("should return genre with given id", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();
      const res = await request(server).get("/api/genres/" + genre._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("should return status 404 if genre does not exist", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();
      const res = await request(server).get("/api/genres/-1");
      expect(res.status).toBe(404);
    });
  });

  //nested test suite for POST request
  describe("POST /", () => {
    let name;
    let token;

    //setting up a happy path - this is a successful path template
    exec = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name });
    };

    //before each test we initialize variables for the happy path.
    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "genre1";
    });

    //auth middleware: 401 - no token
    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    //validation function expect name to have min 3 characters.
    it("should return status 400 if we send invalid data", async () => {
      name = "g";
      const res = await exec();
      expect(res.status).toBe(400); //bad request
    });

    //genre saved in the database
    it("should save genre in the database if it is valid", async () => {
      await exec();
      const genre = Genre.find({ name: "genre1" });
      expect(genre).not.toBeNull();
    });

    //genre in the response
    it("should put genre in the body of the request", async () => {
      const res = await exec();
      //we test that in the res.body we have an object with _id and name:genre1
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });
});
