const { request, server, authToken } = require("./setup");

let customer_id = { customer_id: "6227deea74ee78aeeaec70c6" };
let orders = [
  {
    _id: "6256c626d62de6409738ea5c",
    transaction_id: "6256c626d62de6409738ea56",
    stall: {
      id: "62363ecadd0cdb49d7e980e1",
      name: "Dans Vege Stall",
      category_id: "62402fca687c82b8785cf61b",
      email: "dtibbotts@outlook.com",
      location: "Coalgate",
      image: "dansvegestall.jpg",
    },
    customer: {
      id: "6227deea74ee78aeeaec70c6",
      name: "Nick Harding",
      email: "nhar201@mywhitecliffe.com",
    },
    products: [
      {
        id: "62560343b133d40b172a851e",
        name: "Vegetarian Pizza Slice",
        description: "A healthy alternative to unhealthy pizza",
        category: "624163acdacf4acdf3ddd860",
        price: 10.5,
        quantity: 1,
        _id: "6256c626d62de6409738ea5d",
      },
    ],
    total_order_price: 10.5,
  },
];

test("Get All Transactions, get by customer id and error check", async () => {
  await request(server)
    .get("/api/transaction/")
    .set("Authorization", authToken)
    .expect(200);

  await request(server).get("/api/transaction/").expect(401);

  // get by customer id and error check
  await request(server)
    .get(`/api/transaction/customer/${customer_id.customer_id}`)
    .set("Authorization", authToken)
    .expect(200);

  // get by customer id and error check no user id
  await request(server)
    .get(`/api/transaction/customer/`)
    .set("Authorization", authToken)
    .expect(500);

  // get by customer id and error check no auth token
  await request(server)
    .get(`/api/transaction/customer/${customer_id.customer_id}`)
    .expect(401);

  // get by customer id and error check bad id
  await request(server)
    .get(`/api/transaction/customer/62560343b133d40b172a851e`)
    .set("Authorization", authToken)
    .expect(404);
});

test("Create Transaction, Get Transation and Delete Transaction and error tests", async () => {
  let transaction;
  await request(server)
    .post("/api/transaction/")
    .send(customer_id)
    .set("Authorization", authToken)
    .expect(200)
    .then((data) => {
      transaction = data.body.data;
    });

  // get transaction check no auth token
  await request(server).get(`/api/transaction/${transaction._id}`).expect(401);

  // get transaction check invalid id
  await request(server)
    .get(`/api/transaction/62560343b133d40b172a851e`)
    .set("Authorization", authToken)
    .expect(404);

  // get transaction check
  await request(server)
    .get(`/api/transaction/${transaction._id}`)
    .set("Authorization", authToken)
    .expect(200)
    .then((data) => {
      expect(data.body._id).toBe(transaction._id);
    });

  // delete transaction
  await request(server)
    .delete(`/api/transaction/${transaction._id}`)
    .set("Authorization", authToken)
    .expect(200);
});

test("Create Transaction, update transaction and add order and Delete Transaction and error check", async () => {
  let transaction;
  await request(server)
    .post("/api/transaction/")
    .send(customer_id)
    .set("Authorization", authToken)
    .expect(200)
    .then((data) => {
      transaction = data.body.data;
    });

  // update cart with order and check no auth token
  await request(server)
    .put(`/api/transaction/update/${transaction._id}`)
    .send(orders)
    .expect(401);

  // update cart with order and check no transaction id
  await request(server)
    .put(`/api/transaction/update/`)
    .set("Authorization", authToken)
    .send(orders)
    .expect(404);

  // update cart with order and check
  await request(server)
    .put(`/api/transaction/update/${transaction._id}`)
    .set("Authorization", authToken)
    .send({ transaction, orders })
    .expect(200)
    .then((data) => {
      expect(data.body.data.orders[0]._id).toBe("6256c626d62de6409738ea5c");
    });

  // delete transaction
  await request(server)
    .delete(`/api/transaction/${transaction._id}`)
    .set("Authorization", authToken)
    .expect(200);
});
