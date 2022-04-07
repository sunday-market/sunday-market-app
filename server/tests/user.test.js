const request = require("supertest");
jest.setTimeout(150000); // may have to increase as more tests require

const server = "http://localhost:5000";
const authToken =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMzE1MjUzMjRlNzA4MTQyZDAwMTVkYyIsImlhdCI6MTY0OTMxODg2MiwiZXhwIjoxNjQ5NDA1MjYyfQ.70Ut2joce7rlAehvEH0G14F8124PlusbE52syNcUBqk";

test("should retrieve on user by id and send 200 response", async () => {
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
