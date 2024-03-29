const request = require("supertest");
const { Genre } = require("../../models/genres");
const { User } = require("../../models/users");
const { Rental } = require("../../models/rentals");
const mongoose = require("mongoose");

describe("returns", () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let token;
  let path;

  //setting up a happy path - this is a successful path template
  exec = () => {
    return request(server)
      .post(path) //we only need to implement POST requests
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require("../../index"); //loading server before each test
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();
    path = "/api/returns";

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "Tomas",
        phone: "12345",
      },
      movie: {
        _id: movieId,
        title: "movie1",
        dailyRentalRate: 2,
      },
    });

    await rental.save(); //save rental object for testing
  });

  afterEach(async () => {
    await server.close(); //closing server after each test
    await Rental.deleteMany({}); // dropping collection genres after each test
  });

  afterAll(async () => {
    mongoose.disconnect();
  });

  it("should work", async () => {
    result = await Rental.findById(rental._id);
    expect(result).not.toBeNull();
  });

  //auth middleware: 401 - no token
  it("should return 401 if client is not logged in", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  //400 - no customerId
  it("should return 400 if customerId is not provided", async () => {
    customerId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  //400 - no movieId
  it("should return 400 if movieId is not provided", async () => {
    movieId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  //404 - no rental found
  it("should return 404 if rental is not found", async () => {
    await Rental.deleteMany({});
    const res = await exec();
    expect(res.status).toBe(404);
  });

  //400 - rental already processed - return date is set.
  it("should return 400 if rental is processed (return date is set)", async () => {
    await Rental.findByIdAndUpdate(rental._id, { dateReturned: Date.now() });
    const res = await exec();
    expect(res.status).toBe(400);
  });

  //200 - valid request
  it("should return 200 if it is a valid request", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });

  //return date is set after our request
  it("return date should be set after our request", async () => {
    const res = await exec();
    //time difference in milliseconds:
    const diff = new Date() - Date.parse(res.body.dateReturned);
    expect(diff).toBeLessThan(10 * 1000); //expect less than 10s
  });

  // it("should set the rentalFee if input is valid", async () => {
  //   //we simulate that we rented it 7 days ago
  //   rental.dateOut = moment().add(-7, "days").toDate();
  //   await rental.save();

  //   const res = await exec();

  //   const rentalInDb = await Rental.findById(rental._id);
  //   expect(rentalInDb.rentalFee).toBe(14); // 7days, daily fee 2... 7*2=14
  // });

  // it("should increase the movie stock if input is valid", async () => {
  //   const res = await exec();

  //   const movieInDb = await Movie.findById(movieId);
  //   expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
  // });

  it("should return the rental if input is valid", async () => {
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);

    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        "dateOut",
        "dateReturned",
        "rentalFee",
        "customer",
        "movie",
      ])
    );
  });
});
