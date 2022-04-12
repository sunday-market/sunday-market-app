const { request, server, authToken } = require("./setup");

const shoppingProduct = {
  _id: "62392944e19f8bbe842ce3a6",
  product_name: "The Great Controversy",
  product_description: "The battle between Christ and Satan",
  product_price: 12,
  quantity: 1,
};

test("Create a new shopping cart and delete it", async () => {
  let shoppingcart;
  await request(server)
    .post("/api/cart/")
    .expect(200)
    .then((data) => {
      shoppingcart = data.body.data;
    });

  await request(server).delete(`/api/cart/${shoppingcart._id}`).expect(200);
});

test("Create a new shopping cart, get shopping cart by id and delete it", async () => {
  let shoppingcart;
  await request(server)
    .post("/api/cart/")
    .expect(200)
    .then((data) => {
      shoppingcart = data.body.data;
    });

  await request(server)
    .get(`/api/cart/${shoppingcart._id}`)
    .expect(200)
    .then((data) => {
      return expect(data.body[0].products_selected.length).toBe(0);
    });

  await request(server).delete(`/api/cart/${shoppingcart._id}`).expect(200);
});

test("Create a new shopping cart, add product remove product and delete cart", async () => {
  let shoppingcart;
  await request(server)
    .post("/api/cart/")
    .expect(200)
    .then((data) => {
      shoppingcart = data.body.data;
    });

  await request(server)
    .post(`/api/cart/additem/${shoppingcart._id}`)
    .send(shoppingProduct)
    .expect(200)
    .then((data) => {
      shoppingcart = data.body.data;
      expect(shoppingcart.products_selected[0].product_id).toBe(
        shoppingProduct._id
      );
      return expect(shoppingcart.products_selected.length).toBe(1);
    });

  let itemToRemove = { _id: shoppingcart.products_selected[0].product_id };
  await request(server)
    .delete(`/api/cart/removeitem/${shoppingcart._id}`)
    .send(itemToRemove)
    .expect(200)
    .then((data) => {
      shoppingcart = data.body.data;
      return expect(shoppingcart.products_selected.length).toBe(0);
    });

  await request(server).delete(`/api/cart/${shoppingcart._id}`).expect(200);
});

test("Create a new shopping cart, add product remove product and delete cart with error tests", async () => {
  let shoppingcart;
  await request(server)
    .post("/api/cart/")
    .expect(200)
    .then((data) => {
      shoppingcart = data.body.data;
    });

  // no cart id
  await request(server)
    .post(`/api/cart/additem/`)
    .send(shoppingProduct)
    .expect(404);

  // no body
  await request(server)
    .post(`/api/cart/additem/${shoppingcart._id}`)
    .expect(400);

  await request(server)
    .post(`/api/cart/additem/${shoppingcart._id}`)
    .send(shoppingProduct)
    .expect(200)
    .then((data) => {
      shoppingcart = data.body.data;
      expect(shoppingcart.products_selected[0].product_id).toBe(
        shoppingProduct._id
      );
      return expect(shoppingcart.products_selected.length).toBe(1);
    });

  let itemToRemove = { _id: shoppingcart.products_selected[0].product_id };

  // no cart id
  await request(server)
    .delete(`/api/cart/removeitem/`)
    .send(itemToRemove)
    .expect(500);

  // no body
  await request(server)
    .delete(`/api/cart/removeitem/${shoppingcart._id}`)
    .expect(400);

  await request(server)
    .delete(`/api/cart/removeitem/${shoppingcart._id}`)
    .send(itemToRemove)
    .expect(200)
    .then((data) => {
      shoppingcart = data.body.data;
      return expect(shoppingcart.products_selected.length).toBe(0);
    });

  await request(server).delete(`/api/cart/${shoppingcart._id}`).expect(200);
});

test("Create a new shopping cart, update it and delete it and update error tests", async () => {
  let shoppingcart;
  await request(server)
    .post("/api/cart/")
    .expect(200)
    .then((data) => {
      shoppingcart = data.body.data;
    });

  await request(server).put(`/api/cart/`).expect(404);
  await request(server).put(`/api/cart/${shoppingcart._id}`).expect(200);

  await request(server).delete(`/api/cart/${shoppingcart._id}`).expect(200);
});

test("Create a new shopping cart, add product, clear cart and delete cart", async () => {
  let shoppingcart;
  await request(server)
    .post("/api/cart/")
    .expect(200)
    .then((data) => {
      shoppingcart = data.body.data;
    });

  await request(server)
    .post(`/api/cart/additem/${shoppingcart._id}`)
    .send(shoppingProduct)
    .expect(200)
    .then((data) => {
      shoppingcart = data.body.data;
      expect(shoppingcart.products_selected[0].product_id).toBe(
        shoppingProduct._id
      );
      return expect(shoppingcart.products_selected.length).toBe(1);
    });
  await request(server)
    .put(`/api/cart/clearcart/${shoppingcart._id}`)
    .expect(200)
    .then((data) => {
      return expect(data.body.products_selected.length).toBe(0);
    });
  await request(server).delete(`/api/cart/${shoppingcart._id}`).expect(200);
});
