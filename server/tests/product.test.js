const { response } = require("express");
const { request, server, authToken } = require("./setup");

test("get all products", async () => {
  await request(server).get(`/api/product`).expect(200);
});

test("add, delete product", async () => {
  let product = {
    product_name: "Lego",
    product_description: "Assorted Lego",
    product_user: "6231525324e708142d0015dc",
    product_stall: "624dfa4e99717551e4350214",
    product_subcategory: "62413ed6507ee81b57633707",
    product_price: 50,
    quantity_in_stock: 1,
  };

  // Add product
  await request(server)
    .post(`/api/product`)
    .set("Authorization", authToken)
    .send(product)
    .expect(201)
    .then((result) => {
      product = { ...product, ...result.body.data };
    });

  // Delete Product
  await request(server)
    .delete(`/api/product/${product._id}`)
    .set("Authorization", authToken)
    .expect(200);
});

test("get active products", async () => {
  await request(server)
    .get(`/api/product/active`)
    .expect(200)
    .then((result) => {
      result.body.map((product) => {
        return expect(product.product_stall.activated).toBe(true);
      });
    });
});

test("get stall products", async () => {
  const stallId = "62364038dd0cdb49d7e980e7";
  await request(server)
    .get(`/api/product/stall/${stallId}`)
    .set("Authorization", authToken)
    .expect(200)
    .then((result) => {
      expect(result.body.length > 0);
    });
});

test("get the 8 most recently added products", async () => {
  await request(server)
    .get(`/api/product/recent`)
    .expect(200)
    .then((result) => {
      expect(result.body.length === 8);
    });
});

test("get products by invalid category id", async () => {
  let categoryId = "123412312312312312323123";
  await request(server).get(`/api/product/category/${categoryId}`).expect(404);
});

test("get products by valid category id", async () => {
  let categoryId = "62402fca687c82b8785cf61b"; // Produce
  await request(server)
    .get(`/api/product/category/${categoryId}`)
    .expect(200)
    .then((result) => {
      expect(result.body.length > 0);
    });
});

test("get all products by main category", async () => {
  let categoryId = "62402fca687c82b8785cf61b"; // Produce
  await request(server)
    .get(`/api/product/category/allproducts/${categoryId}`)
    .expect(200)
    .then((result) => {
      expect(result.body.length > 0);
    });
});

test("get all products by main category with invalid id", async () => {
  let categoryId = "62402fca687c82b8785cf123"; // Invalid id
  await request(server)
    .get(`/api/product/category/allproducts/${categoryId}`)
    .expect(404);
});

test("get products by user", async () => {
  let userId = "623118a96648304490ee4085"; //
  await request(server)
    .get(`/api/product/user/${userId}`)
    .set("Authorization", authToken)
    .expect(200)
    .then((result) => {
      expect(result.body.length > 0);
    });
});

test("get products by invalid user", async () => {
  let userId = "623118a96648304490ee4123"; //
  await request(server)
    .get(`/api/product/user/${userId}`)
    .set("Authorization", authToken)
    .expect(404);
});

test("get products by valid user without auth token", async () => {
  let userId = "623118a96648304490ee4085"; //
  await request(server).get(`/api/product/user/${userId}`).expect(401);
});

test("get product by valid id", async () => {
  let productId = "623b9b9a0b024a05594fc754"; //Tomatoes
  await request(server)
    .get(`/api/product/${productId}`)
    .set("Authorization", authToken)
    .expect(200)
    .then((result) => {
      expect(result.body[0].product_name).toBe("Tomatoes");
    });
});

test("get product by invalid id", async () => {
  let productId = "623b9b9a0b024a05594f1234"; // Invalid id
  await request(server)
    .get(`/api/product/${productId}`)
    .set("Authorization", authToken)
    .expect(404);
});

test("create, update, and delete product", async () => {
  let product = {
    product_name: "Lego",
    product_description: "Assorted Lego",
    product_user: "6231525324e708142d0015dc",
    product_stall: "624dfa4e99717551e4350214",
    product_subcategory: "62413ed6507ee81b57633707",
    product_price: 50,
    quantity_in_stock: 1,
  };

  // Add product
  await request(server)
    .post(`/api/product`)
    .set("Authorization", authToken)
    .send(product)
    .expect(201)
    .then((result) => {
      product = { ...product, ...result.body.data };
    });

  let newProductName = "New Product Name";
  await request(server)
    .put(`/api/product/${product._id}`)
    .set("Authorization", authToken)
    .send({ ...product, ...{ product_name: newProductName } })
    .expect(200)
    .then((result) => {
      expect(result.body.data.product_name).toBe(newProductName);
    });

  // Delete Product
  await request(server)
    .delete(`/api/product/${product._id}`)
    .set("Authorization", authToken)
    .expect(200);
});
