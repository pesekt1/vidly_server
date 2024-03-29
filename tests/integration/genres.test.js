const request = require("supertest");
const mongoose = require("mongoose");
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
    await Genre.deleteMany({}); // dropping collection genres after each test
  });

  afterAll(async () => {
    mongoose.disconnect();
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

    it("should return 404 if invalid id is passed", async () => {
      const res = await request(server).get("/api/genres/1");

      expect(res.status).toBe(404);
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

    //validation function expect name to have min 5 characters.
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

  describe("PUT /:id", () => {
    let token;
    let newName;
    let genre;
    let id;

    const exec = async () => {
      return await request(server)
        .put("/api/genres/" + id)
        .set("x-auth-token", token)
        .send({ name: newName });
    };

    beforeEach(async () => {
      // Before each test we need to create a genre and
      // put it in the database.
      genre = new Genre({ name: "genre1" });
      await genre.save();

      token = new User().generateAuthToken();
      id = genre._id;
      newName = "updatedName";
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 5 characters", async () => {
      newName = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 characters", async () => {
      newName = new Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 404 if id is invalid", async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 404 if genre with the given id was not found", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should update the genre if input is valid", async () => {
      await exec();

      const updatedGenre = await Genre.findById(genre._id);

      expect(updatedGenre.name).toBe(newName);
    });

    it("should return the updated genre if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", newName);
    });
  });

  describe("DELETE /:id", () => {
    let token;
    let genre;
    let id;

    const exec = async () => {
      return await request(server)
        .delete("/api/genres/" + id)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(async () => {
      // Before each test we need to create a genre and
      // put it in the database.
      genre = new Genre({ name: "genre1" });
      await genre.save();

      id = genre._id;
      token = new User({ isAdmin: true }).generateAuthToken();
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 403 if the user is not an admin", async () => {
      token = new User({ isAdmin: false }).generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it("should return 404 if id is invalid", async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 404 if no genre with the given id was found", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should delete the genre if input is valid", async () => {
      await exec();

      const genreInDb = await Genre.findById(id);

      expect(genreInDb).toBeNull();
    });

    it("should return the removed genre", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id", genre._id.toHexString());
      expect(res.body).toHaveProperty("name", genre.name);
    });
  });
});
