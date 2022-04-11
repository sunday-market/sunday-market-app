const { request, server, authToken } = require("./setup");

// Test Data for new threads
const newStallThread = {
  stall_name: "Stall Message Thread Test",
  send_user: "6227deea74ee78aeeaec70c1",
  recieve_user: "623ea3b5cee41fcded600011",
};
const newUserThread = {
  send_user: "6227deea74ee78aeeaec70c2",
  recieve_user: "623ea3b5cee41fcded600012",
};

test("Create New Message Thread With a Stall Name and then delete it", async () => {
  let threadId;
  await request(server)
    .post("/api/messagethreads/")
    .set("Authorization", authToken)
    .send(newStallThread)
    .expect(200)
    .then((data) => {
      console.log(data.body);
      threadId = data.body._id;
    });

  await request(server)
    .delete(`/api/messagethreads/${threadId}`)
    .set("Authorization", authToken)
    .expect(200);
});

test("Create New Message Thread Without a Stall Name and then delete it", async () => {
  let threadId;
  await request(server)
    .post("/api/messagethreads/")
    .set("Authorization", authToken)
    .send(newUserThread)
    .then((data) => {
      threadId = data.body._id;
    });

  await request(server)
    .delete(`/api/messagethreads/${threadId}`)
    .set("Authorization", authToken)
    .expect(200);
});

test("Get All threads of user 6227deea74ee78aeeaec70c1", async () => {
  await request(server)
    .get("/api/messagethreads/6227deea74ee78aeeaec70c1")
    .set("Authorization", authToken)
    .expect("Content-Type", /json/)
    .expect(200)
    .then((data) => {
      console.log(data.body);
      expect(data.body.length).toBe(0);
    });
});
