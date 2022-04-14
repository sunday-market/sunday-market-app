const { request, server, authToken } = require("./setup");

test("should retrieve user by id and send 200 response", async () => {
  const userId = "623118a96648304490ee4085";
  await request(server)
    .get(`/api/user/${userId}`)
    .set("Authorization", authToken)
    .expect("Content-Type", /json/)
    .expect(200)
    .then((data) => {
      expect(data.body.data.username).toBe("dtibbotts");
    });
});

test("should not find user and return 404 response", async () => {
  const userId = "623118a96648304490ee4088";
  await request(server)
    .get(`/api/user/${userId}`)
    .set("Authorization", authToken)
    .expect(404);
});

test("should return true as user exists and return 200 response", async () => {
  const userId = "623118a96648304490ee4085";
  await request(server)
    .get(`/api/user/exists/${userId}`)
    .set("Authorization", authToken)
    .expect(200)
    .then((data) => {
      expect(data.body).toBe(true);
    });
});

test("should return false as user does not exist and return 200 response", async () => {
  const userId = "623118a96648304490ee4485";
  await request(server)
    .get(`/api/user/exists/${userId}`)
    .set("Authorization", authToken)
    .expect(200)
    .then((data) => {
      expect(data.body).toBe(false);
    });
});

test("update user", async () => {
  // Update user
  await request(server)
    .put(`/api/user/62413672cf70bb59de561c2a`)
    .set("Authorization", authToken)
    .send({ fullname: "Daniel Tibbotts" })
    .expect(200)
    .then((data) => {
      expect(data.body.success).toBe(true);
    });
});
