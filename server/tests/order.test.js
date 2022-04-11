const { request, server, authToken } = require("./setup");

test("get all orders", async () => {
  await request(server)
    .get(`/api/order`)
    .set("Authorization", authToken)
    .expect(200);
});

test("create and delete an order", async () => {
  let order = {
    stall: {
      id: "62363ecadd0cdb49d7e980e1",
      name: "Dans Vege Stall",
      category_id: "62363ecadd0cdb49d7e980e1",
      email: "dtibbotts@outlook.com",
      location: "Christchurch",
    },
    customer: {
      id: "623118a96648304490ee4085",
      name: "Dan Min Tibbotts",
      email: "dtib201@mywhitecliffe.com",
    },
    products: [],
  };

  await request(server)
    .post(`/api/order`)
    .set("Authorization", authToken)
    .send(order)
    .expect(201)
    .then((result) => {
      order = { ...order, ...result.body.data };
    });

  await request(server)
    .delete(`/api/order/${order._id}`)
    .set("Authorization", authToken)
    .expect(200)
    .then((result) => {
      expect(result.body.success).toBe(true);
    });
});

test("get order by order id", async () => {
  await request(server)
    .get(`/api/order/${"623a8de515e0f68d2ae5bbc9"}`)
    .set("Authorization", authToken)
    .expect(200)
    .then((result) => {
      expect(result.body.stall.name).toBe("Dans Vege Stall");
    });
});

test("get order by invalid order id", async () => {
  await request(server)
    .get(`/api/order/${"623a8de515e0f68d2ae51234"}`)
    .set("Authorization", authToken)
    .expect(404);
});

test("get users orders by user id", async () => {
  await request(server)
    .get(`/api/order/user/623118a96648304490ee4085`)
    .set("Authorization", authToken)
    .expect(200);
});

test("get users orders by invalid user id", async () => {
  await request(server)
    .get(`/api/order/user/623118a96648304490ee1234`)
    .set("Authorization", authToken)
    .expect(404);
});

test("get stall orders by stall id", async () => {
  await request(server)
    .get(`/api/order/stall/62363ecadd0cdb49d7e980e1`)
    .set("Authorization", authToken)
    .expect(200);
});

test("get stall orders by invalid stall id", async () => {
  await request(server)
    .get(`/api/order/stall/62363ecadd0cdb49d7e91234`)
    .set("Authorization", authToken)
    .expect(404);
});

test("get received orders by user id", async () => {
  await request(server)
    .get(`/api/order/received/623118a96648304490ee4085`)
    .set("Authorization", authToken)
    .expect(200);
});

test("get received orders by invalid user id", async () => {
  await request(server)
    .get(`/api/order/received/623118a96648304490ee1234`)
    .set("Authorization", authToken)
    .expect(404);
});
