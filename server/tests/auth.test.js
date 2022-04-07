const request = require("supertest");
jest.setTimeout(150000);

const server = "http://localhost:5000";
const authToken =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMzE1MjUzMjRlNzA4MTQyZDAwMTVkYyIsImlhdCI6MTY0OTMxODg2MiwiZXhwIjoxNjQ5NDA1MjYyfQ.70Ut2joce7rlAehvEH0G14F8124PlusbE52syNcUBqk";

const testUser = {
  username: "sbob",
  password: "patrickstar",
  email: "SundayMarketApp@gmail.com",
  fullname: "Spongebob Squarepants",
  address_line1: "Bikini Bottom",
};

// Register a User
test("Register a user should return 200 response", async () => {
  await request(server).post("/api/auth/register").send(testUser).expect(200);
});

// Login User

// Delete a User
