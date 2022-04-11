const { request, server, authToken } = require("./setup");

// Test Data for new threads
const newStallThread = {
  stall_name: "Stall Message Thread Test",
  send_user: "6227deea74ee78aeeaec70c2",
  recieve_user: "623ea3b5cee41fcded600012",
};
const newUserThread = {
  send_user: "6227deea74ee78aeeaec70c2",
  recieve_user: "623ea3b5cee41fcded600012",
};
let testMessage = {
  message: "This is the UNIT TEST Message",
  send_user: "6227deea74ee78aeeaec70c2",
};

let testNoUserMessage = {
  message: "This is the UNIT TEST Message",
};
let testNoMessage = {
  send_user: "6227deea74ee78aeeaec70c2",
};

let testMessageNoThreadID = {
  message: "This is the UNIT TEST Message",
  send_user: "6227deea74ee78aeeaec70c2",
};

test("Create new Message Thread with stall and Message then delete them", async () => {
  let threadId;
  await request(server)
    .post("/api/messagethreads/")
    .set("Authorization", authToken)
    .send(newStallThread)
    .expect(200)
    .then((data) => {
      threadId = data.body._id;
    });
  testMessage = { ...testMessage, message_thread_id: threadId };
  console.log(testMessage);
  let message_id;
  await request(server)
    .post("/api/messages/")
    .set("Authorization", authToken)
    .send(testMessage)
    .expect(200)
    .then((data) => {
      console.log(data);
      message_id = data.body._id;
    });

  await request(server)
    .delete(`/api/messages/${message_id}`)
    .set("Authorization", authToken)
    .expect(200);

  await request(server)
    .delete(`/api/messagethreads/${threadId}`)
    .set("Authorization", authToken)
    .expect(200);
});

test("Create new Message Thread without stall and Message then delete them", async () => {
  let threadId;
  await request(server)
    .post("/api/messagethreads/")
    .set("Authorization", authToken)
    .send(newUserThread)
    .then((data) => {
      threadId = data.body._id;
    });
  testMessage = { ...testMessage, message_thread_id: threadId };

  let message_id;
  await request(server)
    .post("/api/messages/")
    .set("Authorization", authToken)
    .send(testMessage)
    .expect(200)
    .then((data) => {
      message_id = data.body._id;
    });

  await request(server)
    .delete(`/api/messages/${message_id}`)
    .set("Authorization", authToken)
    .expect(200);
  await request(server)
    .delete(`/api/messagethreads/${threadId}`)
    .set("Authorization", authToken)
    .expect(200);
});

test("Create new Message Thread with stall and Message without message should fail then delete them", async () => {
  let threadId;
  await request(server)
    .post("/api/messagethreads/")
    .set("Authorization", authToken)
    .send(newUserThread)
    .then((data) => {
      threadId = data.body._id;
    });
  testNoUserMessage = { ...testNoUserMessage, message_thread_id: threadId };

  await request(server)
    .post("/api/messages/")
    .set("Authorization", authToken)
    .send(testNoUserMessage)
    .expect(400);

  await request(server)
    .delete(`/api/messagethreads/${threadId}`)
    .set("Authorization", authToken)
    .expect(200);
});

test("Create new Message Thread with stall and Message without send user should fail then delete them", async () => {
  let threadId;
  await request(server)
    .post("/api/messagethreads/")
    .set("Authorization", authToken)
    .send(newUserThread)
    .then((data) => {
      threadId = data.body._id;
    });
  testNoMessage = { ...testNoMessage, message_thread_id: threadId };

  await request(server)
    .post("/api/messages/")
    .set("Authorization", authToken)
    .send(testNoMessage)
    .expect(400);

  await request(server)
    .delete(`/api/messagethreads/${threadId}`)
    .set("Authorization", authToken)
    .expect(200);
});

test("Create new Message Thread with stall and Message without message thread id should fail then delete them", async () => {
  let threadId;
  await request(server)
    .post("/api/messagethreads/")
    .set("Authorization", authToken)
    .send(newUserThread)
    .then((data) => {
      threadId = data.body._id;
    });

  await request(server)
    .post("/api/messages/")
    .set("Authorization", authToken)
    .send(testMessageNoThreadID)
    .expect(400);

  await request(server)
    .delete(`/api/messagethreads/${threadId}`)
    .set("Authorization", authToken)
    .expect(200);
});
