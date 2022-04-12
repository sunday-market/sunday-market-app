const { text } = require("express");
const { request, server, authToken } = require("./setup");

test("get all stalls", async () => {
  await request(server)
    .get(`/api/stalls/`)
    .expect(200)
    .then((result) => {
      expect(result.body.length > 0);
    });
});

test("attempt to create stall when unauthorised", async () => {
  await request(server).post(`/api/stalls/`).send({}).expect(401);
});

test("create and delete stall", async () => {
  let stall = {
    user: "62413672cf70bb59de561c2a", //dtibicloud
    stallName: "Test Stall",
    category: "62413d1e933fba06d7b853ba", // Pet Supplies
    city_location: "Wanaka",
  };

  await request(server)
    .post(`/api/stalls/`)
    .set("Authorization", authToken)
    .send(stall)
    .expect(201)
    .then((result) => {
      stall = { ...stall, ...result.body.data };
      expect(result.body.data.stallName).toBe(stall.stallName);
    });

  await request(server)
    .delete(`/api/stalls/${stall._id}`)
    .set("Authorization", authToken)
    .expect(200);
});

test("attempt to create stall with invalid data", async () => {
  let stall = {
    user: "62413672cf70bb59de561c2a", //dtibicloud
    stallName: "Test Stall",
    category: "62413d1e933fba06d7b853ba", // Pet Supplies
    //   city_location: "Wanaka",
  };

  await request(server)
    .post(`/api/stalls/`)
    .set("Authorization", authToken)
    .send(stall)
    .expect(400);
});

test("get user stalls when unauthorised", async () => {
  let userId = "623118a96648304490ee4085"; //dtibbotts
  await request(server).get(`/api/mystalls/${userId}`).expect(401);
});

test("get user stalls", async () => {
  let userId = "623118a96648304490ee4085"; //dtibbotts
  await request(server)
    .get(`/api/mystalls/${userId}`)
    .set("Authorization", authToken)
    .expect(200)
    .then((result) => {
      expect(result.body.length > 0);
    });
});

test("get user stalls with invalid user", async () => {
  let userId = "623118a96648304490ee1234"; //invalid user
  await request(server)
    .get(`/api/mystalls/${userId}`)
    .set("Authorization", authToken)
    .expect(404);
});

test("get stall with valid stall id", async () => {
  let stallId = "6249121d3efff68c974c672f"; // woofs and wabbits
  await request(server)
    .get(`/api/stalls/${stallId}`)
    .set("Authorization", authToken)
    .expect(200)
    .then((result) => {
      expect(result.body[0].stallName).toBe("Woofs and Wabbits");
    });
});

test("get stall with invalid stall id", async () => {
  let stallId = "6249121d3efff68c974c6123"; // invalid stall id
  await request(server)
    .get(`/api/stalls/${stallId}`)
    .set("Authorization", authToken)
    .expect(404);
});

test("attempt to update stall when unauthorised", async () => {
  let stallId = "6249121d3efff68c974c6123"; // invalid stall id
  await request(server).put(`/api/stalls/${stallId}`).send({}).expect(401);
});

test("create, update, and delete stall", async () => {
  let stall = {
    user: "62413672cf70bb59de561c2a", //dtibicloud
    stallName: "Test Stall",
    category: "62413d1e933fba06d7b853ba", // Pet Supplies
    city_location: "Wanaka",
  };

  await request(server)
    .post(`/api/stalls/`)
    .set("Authorization", authToken)
    .send(stall)
    .expect(201)
    .then((result) => {
      stall = { ...stall, ...result.body.data };
      expect(result.body.data.stallName).toBe(stall.stallName);
    });

  await request(server)
    .put(`/api/stalls/${stall._id}`)
    .set("Authorization", authToken)
    .send({ ...stall, ...{ stallName: "Updated Stall" } })
    .expect(200)
    .then((result) => {
      expect(result.body.data.stallName).toBe("Updated Stall");
    });

  await request(server)
    .delete(`/api/stalls/${stall._id}`)
    .set("Authorization", authToken)
    .expect(200);
});
