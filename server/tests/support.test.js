const { request, server, authToken } = require("./setup");

test("contact support with valid data", async () => {
  let supportData = {
    name: "Daniel Tibbotts",
    email: "dtibbotts@outlook.com",
    contactReason: "testing",
    comments: "This is a test",
  };

  await request(server)
    .post(`/api/support/contactSupport`)
    .send(supportData)
    .expect(200)
    .then((result) => {
      expect(result.text).toBe("Message sent");
    });
});

test("contact support with invalid data", async () => {
  let supportData = {
    name: "Daniel Tibbotts",
  };

  await request(server)
    .post(`/api/support/contactSupport`)
    .send(supportData)
    .expect(400);
});
