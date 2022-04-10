const { request, server, authToken } = require("./setup");

let testUser = {
  username: "sbob",
  password: "patrickstar",
  email: "SundayMarketApp@gmail.com",
  fullname: "Spongebob Squarepants",
  address_line1: "Bikini Bottom",
};

test("Register a user should return 201 response", async () => {
  await request(server)
    .post("/api/auth/register")
    .send(testUser)
    .expect(201)
    .then((data) => {
      testUser = { ...testUser, ...data.body.user };
    });
});

console.log(testUser);

test("Login unverified user should return 401 response", async () => {
  await request(server).post("/api/auth/login").send(testUser).expect(401);
});

test("Invalid Login should return 401", async () => {
  await request(server)
    .post("/api/auth/login")
    .send({
      email: "dtib201@mywhitecliffe.com",
      password: "abcdefghijklmnopqrstuvwxyz",
    })
    .expect(401);
});
